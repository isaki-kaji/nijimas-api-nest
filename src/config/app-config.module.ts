import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './db.config';
import firebaseConfig from './firebase.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    ConfigModule.forFeature(firebaseConfig),
  ],
})
export class AppConfigModule {}
