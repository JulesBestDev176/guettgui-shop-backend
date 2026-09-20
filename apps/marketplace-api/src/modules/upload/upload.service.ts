import { Injectable, BadRequestException } from '@nestjs/common';
import { join, extname } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { randomBytes } from 'crypto';

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const UPLOAD_DIR = join(process.cwd(), 'uploads');

@Injectable()
export class UploadService {
  constructor() {
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }
  }

  validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME.includes(file.mimetype)) {
      throw new BadRequestException('Format de fichier non accepté (JPEG, PNG, WEBP, GIF uniquement)');
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('Fichier trop volumineux (max 5 Mo)');
    }
  }

  getPublicUrl(filename: string, baseUrl: string): string {
    return `${baseUrl}/uploads/${filename}`;
  }

  generateFilename(originalName: string): string {
    const ext = extname(originalName).toLowerCase();
    return `${randomBytes(16).toString('hex')}${ext}`;
  }
}
