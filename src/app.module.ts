import { Module } from '@nestjs/common';
import { EnvModule } from 'env/env.module';
import { UsersModule } from './domain/users/users.module';
import { AppConfigModule } from 'config/app-config.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'common/guard/auth.guard';

@Module({
  imports: [EnvModule, AppConfigModule, UsersModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
