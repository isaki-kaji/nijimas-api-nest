import { Module } from '@nestjs/common';
import { DbModule } from 'db/db.module';
import { EnvModule } from 'env/env.module';

@Module({
  imports: [EnvModule, DbModule],
})
export class AppModule {}
