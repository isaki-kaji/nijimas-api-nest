import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbConfig from './db.config';
import firebaseConfig from './firebase.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync(dbConfig.asProvider()),
    ConfigModule.forFeature(firebaseConfig),
  ],
  providers: [
    {
      provide: 'FIREBASE_AUTH',
      useFactory: (configService: ConfigService) => {
        return configService.get('firebase');
      },
      inject: [ConfigService],
    },
  ],
  exports: ['FIREBASE_AUTH'],
})
export class AppConfigModule {}
