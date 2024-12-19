import { Module } from '@nestjs/common';
import { EnvModule } from 'env/env.module';
import { UsersModule } from './domain/users/users.module';
import { AppConfigModule } from 'config/app-config.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from 'common/guard/auth.guard';
import { UidInterceptor } from 'common/interceptor/uid.interceptor';

@Module({
  imports: [EnvModule, AppConfigModule, UsersModule],
  providers: [
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
