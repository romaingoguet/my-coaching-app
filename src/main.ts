import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module.js';
import { config } from './app.config.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS for all origins (for development)
  app.enableCors({
    origin: '*', // Allow requests from any origin (including file:// URLs)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useStaticAssets(join(process.cwd(), 'public'));

  // Expose API config to global scope for client-side JavaScript
  if (typeof window !== 'undefined') {
    (window as unknown as Record<string, unknown>).APP_CONFIG = config;
    console.log('App Config loaded:', config);
  }

  await app.listen(config.port, '0.0.0.0');
}

await bootstrap();

