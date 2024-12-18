import { Module } from '@nestjs/common';
import { EnvModule } from 'env/env.module';
import { UsersModule } from './domain/users/users.module';
import { AppConfigModule } from 'config/app-config.module';

@Module({
  imports: [EnvModule, AppConfigModule, UsersModule],
})
export class AppModule {}
