import { Module, ValidationPipe } from '@nestjs/common';
import { EnvModule } from 'env/env.module';
import { UsersModule } from './domain/users/users.module';
import { AppConfigModule } from 'config/app-config.module';
import { APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from 'common/guard/auth.guard';
import { UidInterceptor } from 'common/interceptor/uid.interceptor';
import { PostsModule } from './domain/posts/posts.module';

@Module({
  imports: [EnvModule, AppConfigModule, UsersModule, PostsModule],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: UidInterceptor,
    },
  ],
})
export class AppModule {}
