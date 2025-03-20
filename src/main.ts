import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.use(
    helmet({
      contentSecurityPolicy: false,
      frameguard: false,
      hsts: { maxAge: 31536000, includeSubDomains: true },
      noSniff: true,
    }),
  );
}
bootstrap();
