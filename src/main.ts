import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common'; // VersioningTypeをインポート

async function bootstrap() {
  try {
    console.log('NestJS server starting...');

    const app = await NestFactory.create(AppModule);

    // バージョニングを有効化
    app.enableVersioning({
      type: VersioningType.URI,
      prefix: 'v',
    });

    app.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: false,
        hsts: { maxAge: 31536000, includeSubDomains: true },
        noSniff: true,
      }),
    );

    await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
    console.log('✅ NestJS is now listening');
  } catch (error) {
    console.error('🔥 NestJS failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
