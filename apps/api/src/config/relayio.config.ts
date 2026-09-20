import { registerAs } from '@nestjs/config';

export default registerAs('relayio', () => ({
  apiUrl: process.env.RELAYIO_API_URL || 'https://api.relayio.com',
  apiKey: process.env.RELAYIO_API_KEY,
}));
