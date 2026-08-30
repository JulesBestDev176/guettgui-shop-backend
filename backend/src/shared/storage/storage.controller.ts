import { Controller, Get, Logger, NotFoundException, Param, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { StorageBucket, StorageService } from './storage.service';

const allowedBuckets: StorageBucket[] = [
  'avatars',
  'teams',
  'flocks',
  'daily-records',
  'expenses',
];

@Controller('storage')
export class StorageController {
  private readonly logger = new Logger(StorageController.name);

  constructor(private readonly storage: StorageService) {}

  @Get(':bucket/*')
  async getFile(
    @Param('bucket') bucket: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!allowedBuckets.includes(bucket as StorageBucket)) {
      res.status(404).send();
      return;
    }
    const safeBucket = bucket as StorageBucket;

    // Extraire la cle depuis l'URL originale pour preserver les slashes
    // req.originalUrl = /api/v1/storage/avatars/userId/avatar.webp
    const rawUrl = req.originalUrl.split('?')[0];
    const marker = `/storage/${bucket}/`;
    const markerIdx = rawUrl.indexOf(marker);
    const key: string = markerIdx >= 0 ? rawUrl.slice(markerIdx + marker.length) : '';

    try {
      const object = await this.storage.getObject(safeBucket, key);
      res.setHeader('Content-Type', object.contentType ?? 'application/octet-stream');
      res.setHeader('Content-Length', object.buffer.length);
      res.setHeader('Cache-Control', 'public, max-age=86400, no-transform');
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      res.send(object.buffer);
    } catch (err) {
      if (err instanceof NotFoundException) {
        res.status(404).send();
      } else {
        this.logger.error(
          `Erreur proxy storage ${safeBucket}/${key}: ${err instanceof Error ? err.message : String(err)}`,
        );
        res.status(502).send();
      }
    }
  }
}
