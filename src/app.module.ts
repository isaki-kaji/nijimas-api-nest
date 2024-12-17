import { Module } from '@nestjs/common';
import { DbModule } from 'db/db.module';
import { EnvModule } from 'env/env.module';
import { UsersModule } from './domain/users/users.module';

@Module({
  imports: [EnvModule, DbModule, UsersModule],
})
export class AppModule {}
