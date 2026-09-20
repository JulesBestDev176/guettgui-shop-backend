import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Prefixe global
  app.setGlobalPrefix('v1');

  // Securite
  app.use(helmet());
  app.use(compression());

  // CORS
  app.enableCors({
    origin: process.env.NODE_ENV === 'production'
      ? ['https://guettgui.com', 'https://app.guettgui.com']
      : true,
    credentials: true,
  });

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Guett Gui API')
      .setDescription('API de gestion d\'elevage avicole')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    logger.log('Swagger disponible sur /api/docs');
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application demarree sur le port ${port}`);
}

bootstrap();
