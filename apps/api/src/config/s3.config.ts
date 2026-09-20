import { registerAs } from '@nestjs/config';

export default registerAs('storage', () => ({
  endpoint: process.env.STORAGE_ENDPOINT || 'http://localhost:9002',
  accessKey: process.env.STORAGE_ACCESS_KEY,
  secretKey: process.env.STORAGE_SECRET_KEY,
  bucket: process.env.STORAGE_BUCKET_NAME || 'guettgui',
  publicUrl: process.env.STORAGE_PUBLIC_URL || 'http://localhost:9002',
  forcePathStyle: process.env.STORAGE_FORCE_PATH_STYLE !== 'false',
}));
