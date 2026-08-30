import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as sharp from 'sharp';

export type StorageBucket =
  | 'avatars'
  | 'teams'
  | 'flocks'
  | 'daily-records'
  | 'expenses';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private readonly s3: S3Client;
  private readonly publicUrl: string;
  private readonly mainBucket?: string;
  private readonly buckets: Record<StorageBucket, string>;

  constructor(private config: ConfigService) {
    const accessKeyId = this.readStorageConfig('STORAGE_ACCESS_KEY');
    const secretAccessKey = this.readStorageConfig('STORAGE_SECRET_KEY');

    this.s3 = new S3Client({
      endpoint: this.config.get('STORAGE_ENDPOINT', 'http://localhost:9002'),
      region: this.config.get('STORAGE_REGION', 'us-east-1'),
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: this.readBooleanConfig('STORAGE_FORCE_PATH_STYLE', true),
    });

    this.publicUrl = this.config.get('STORAGE_PUBLIC_URL', 'http://localhost:9002');
    this.mainBucket = this.config.get('STORAGE_BUCKET_NAME') || undefined;
    this.buckets = {
      avatars: this.config.get('STORAGE_BUCKET_AVATARS', 'guettgui-avatars'),
      teams: this.config.get('STORAGE_BUCKET_TEAMS', 'guettgui-teams'),
      flocks: this.config.get('STORAGE_BUCKET_FLOCKS', 'guettgui-flocks'),
      'daily-records': this.config.get('STORAGE_BUCKET_DAILY_RECORDS', 'guettgui-daily-records'),
      expenses: this.config.get('STORAGE_BUCKET_EXPENSES', 'guettgui-expenses'),
    };
  }

  async onModuleInit() {
    const targetBuckets = this.mainBucket ? [this.mainBucket] : Object.values(this.buckets);
    const distinctBuckets = Array.from(new Set(targetBuckets));
    const allowAutoCreate = this.config.get<string>('NODE_ENV') !== 'production';

    for (const bucketName of distinctBuckets) {
      try {
        await this.s3.send(new HeadBucketCommand({ Bucket: bucketName }));
        this.logger.log(`[S3] Bucket operationnel : "${bucketName}"`);
      } catch (err: any) {
        const isMissing = err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404;
        if (isMissing && allowAutoCreate) {
          this.logger.warn(`[S3] Bucket "${bucketName}" manquant. Creation automatique (dev)...`);
          try {
            await this.s3.send(new CreateBucketCommand({ Bucket: bucketName }));
            this.logger.log(`[S3] Bucket "${bucketName}" cree avec succes.`);
          } catch (createErr: any) {
            this.logger.error(`[S3] Echec creation du bucket "${bucketName}": ${createErr.message}`);
          }
        } else if (isMissing) {
          this.logger.error(
            `[S3] Bucket "${bucketName}" manquant en production — a creer manuellement.`,
          );
        } else {
          this.logger.error(`[S3] Erreur verification du bucket "${bucketName}": ${err.message}`);
        }
      }
    }
  }

  private readStorageConfig(key: string): string {
    const value = this.config.get<string>(key);
    if (!value || !value.trim()) {
      if (this.config.get<string>('NODE_ENV') === 'test') {
        return 'test-placeholder';
      }
      throw new Error(`${key} doit etre configure`);
    }
    return value;
  }

  private readBooleanConfig(key: string, fallback: boolean): boolean {
    const value = this.config.get<string>(key);
    if (!value) {
      return fallback;
    }
    return ['true', '1', 'yes', 'on'].includes(value.toLowerCase());
  }

  // ── Upload brut ──────────────────────────────────────────────────────

  async upload(
    bucket: StorageBucket,
    key: string,
    buffer: Buffer,
    contentType = 'image/webp',
  ): Promise<string> {
    const location = this.primaryLocation(bucket, key);
    await this.s3.send(
      new PutObjectCommand({
        Bucket: location.bucket,
        Key: location.key,
        Body: buffer,
        ContentType: contentType,
      }),
    );
    return this.buildPublicUrl(bucket, key);
  }

  // ── Upload image (resize + WebP) ────────────────────────────────────

  async uploadImage(
    bucket: StorageBucket,
    key: string,
    buffer: Buffer,
    options: { width?: number; height?: number } = {},
  ): Promise<string> {
    const { width = 800, height } = options;

    const webpBuffer = await sharp(buffer)
      .resize(width, height, { fit: 'cover' })
      .webp({ quality: 85 })
      .toBuffer();

    const webpKey = key.replace(/\.[^.]+$/, '') + '.webp';
    return this.upload(bucket, webpKey, webpBuffer, 'image/webp');
  }

  // ── Helpers metier ───────────────────────────────────────────────────

  async uploadAvatar(userId: string, buffer: Buffer): Promise<string> {
    return this.uploadImage('avatars', `${userId}/avatar`, buffer, {
      width: 300,
      height: 300,
    });
  }

  async uploadTeamLogo(teamId: string, buffer: Buffer): Promise<string> {
    return this.uploadImage('teams', `${teamId}/logo`, buffer, {
      width: 400,
      height: 400,
    });
  }

  async uploadFlockPhoto(flockId: string, buffer: Buffer): Promise<string> {
    return this.uploadImage('flocks', `${flockId}/photo`, buffer, {
      width: 1200,
    });
  }

  async uploadDailyRecordPhoto(recordId: string, buffer: Buffer): Promise<string> {
    return this.uploadImage('daily-records', `${recordId}/photo`, buffer, {
      width: 1200,
    });
  }

  async uploadExpenseReceipt(expenseId: string, buffer: Buffer): Promise<string> {
    return this.uploadImage('expenses', `${expenseId}/receipt`, buffer, {
      width: 1200,
    });
  }

  // ── Lecture / Suppression ────────────────────────────────────────────

  async getObject(
    bucket: StorageBucket,
    key: string,
  ): Promise<{ buffer: Buffer; contentType?: string }> {
    const locations = this.readLocations(bucket, key);
    const errors: string[] = [];

    for (const location of locations) {
      try {
        const object = await this.s3.send(
          new GetObjectCommand({
            Bucket: location.bucket,
            Key: location.key,
          }),
        );
        if (!object.Body) throw new NotFoundException('Fichier introuvable');

        const chunks: Buffer[] = [];
        for await (const chunk of object.Body as AsyncIterable<Buffer | Uint8Array>) {
          chunks.push(Buffer.from(chunk));
        }

        return {
          buffer: Buffer.concat(chunks),
          contentType: object.ContentType,
        };
      } catch (err: any) {
        const code = err?.name ?? err?.Code ?? 'UnknownError';
        errors.push(`[${location.bucket}/${location.key}] ${code}: ${err?.message ?? err}`);
      }
    }

    this.logger.warn(`Fichier introuvable: ${bucket}/${key} — tentatives: ${errors.join(' | ')}`);
    throw new NotFoundException('Fichier introuvable');
  }

  async delete(bucket: StorageBucket, key: string): Promise<void> {
    const location = this.primaryLocation(bucket, key);
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: location.bucket,
        Key: location.key,
      }),
    );
  }

  async getSignedUrl(bucket: StorageBucket, key: string, expiresIn = 3600): Promise<string> {
    const location = this.primaryLocation(bucket, key);
    const command = new GetObjectCommand({
      Bucket: location.bucket,
      Key: location.key,
    });
    return getSignedUrl(this.s3, command, { expiresIn });
  }

  // ── URL rewriting ───────────────────────────────────────────────────

  rewriteForClient(url: string | null | undefined): string {
    if (!url) return '';
    const appUrl = this.config.get<string>('APP_URL', '');

    // URL proxy existante : normaliser le domaine vers APP_URL actuel
    const proxyMatch = url.match(/\/api\/v1\/storage\/(.+)$/);
    if (proxyMatch) {
      if (!appUrl) return url;
      return `${appUrl}/api/v1/storage/${proxyMatch[1]}`;
    }

    // URL MinIO directe -> convertir en URL proxy
    try {
      const parsed = new URL(url);
      const storageEndpoint = this.config.get<string>('STORAGE_ENDPOINT', 'http://localhost:9002');
      const storageHost = new URL(storageEndpoint).hostname;

      // Si l'URL ne pointe pas vers MinIO, la retourner telle quelle
      if (parsed.hostname !== storageHost) {
        return url;
      }

      if (!appUrl) return url;

      let pathname = parsed.pathname;

      // Supprimer le prefixe mainBucket si present dans le chemin
      if (this.mainBucket && pathname.startsWith(`/${this.mainBucket}/`)) {
        pathname = pathname.slice(`/${this.mainBucket}`.length);
      }

      return `${appUrl}/api/v1/storage${pathname}`;
    } catch {
      return url;
    }
  }

  buildPublicUrl(bucket: StorageBucket, key: string): string {
    const appUrl = this.config.get<string>('APP_URL', '');
    if (appUrl) {
      return `${appUrl}/api/v1/storage/${bucket}/${key}`;
    }
    return `${this.publicUrl}/${bucket}/${key}`;
  }

  // ── Helpers internes ─────────────────────────────────────────────────

  private primaryLocation(bucket: StorageBucket, key: string) {
    if (this.mainBucket) {
      return { bucket: this.mainBucket, key: `${bucket}/${key}` };
    }
    return { bucket: this.buckets[bucket], key };
  }

  private readLocations(bucket: StorageBucket, key: string) {
    const locations = [this.primaryLocation(bucket, key)];
    const legacy = { bucket: this.buckets[bucket], key };
    if (
      !locations.some(
        (location) => location.bucket === legacy.bucket && location.key === legacy.key,
      )
    ) {
      locations.push(legacy);
    }
    return locations;
  }
}
