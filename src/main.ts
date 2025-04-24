import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';

async function bootstrap() {
  try {
    console.log('NestJS server starting...');

    const app = await NestFactory.create(AppModule);

    app.use(
      helmet({
        contentSecurityPolicy: false,
        frameguard: false,
        hsts: { maxAge: 31536000, includeSubDomains: true },
        noSniff: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Nijimas API')
      .setDescription('Nijimas APIのドキュメント')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);

    await app.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0');
    console.log('✅ NestJS is now listening');
  } catch (error) {
    console.error('🔥 NestJS failed to start:', error);
    process.exit(1);
  }
}

bootstrap();
