import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StorageService, StorageBucket } from '../../shared/storage/storage.service';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  private readonly folderToBucket: Record<string, StorageBucket> = {
    avatars: 'avatars',
    teams: 'teams',
    flocks: 'flocks',
    'daily-records': 'daily-records',
    expenses: 'expenses',
  };

  constructor(private readonly storageService: StorageService) {}

  async upload(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('Fichier manquant');
    }

    // Validation MIME type
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Type de fichier non autorise. Formats acceptes : JPEG, PNG, WebP, GIF',
      );
    }

    // Validation taille (5 MB max)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('Le fichier depasse la taille maximale de 5 MB');
    }

    const bucket: StorageBucket = this.folderToBucket[folder] || 'flocks';
    const { randomUUID } = await import('crypto');
    const key = `${randomUUID()}`;

    const url = await this.storageService.uploadImage(bucket, key, file.buffer, {
      width: 1200,
    });

    this.logger.log(`Upload ${file.originalname} -> ${url}`);
    return url;
  }

  async remove(key: string): Promise<void> {
    // Tente de parser le bucket depuis la cle (format: bucket/reste)
    const slashIdx = key.indexOf('/');
    if (slashIdx > 0) {
      const bucketCandidate = key.slice(0, slashIdx) as StorageBucket;
      const fileKey = key.slice(slashIdx + 1);
      if (this.folderToBucket[bucketCandidate]) {
        await this.storageService.delete(bucketCandidate, fileKey);
        this.logger.log(`Delete ${bucketCandidate}/${fileKey}`);
        return;
      }
    }

    // Fallback : supprimer depuis le bucket par defaut
    await this.storageService.delete('flocks', key);
    this.logger.log(`Delete flocks/${key}`);
  }
}
