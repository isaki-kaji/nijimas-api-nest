import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('database', () => {
  const useSsl = process.env.DB_USE_SSL === 'true';
  const config = {
    type: 'postgres',
    host: process.env.DATASOURCE_HOST,
    port: Number(process.env.DATASOURCE_PORT),
    username: process.env.DATASOURCE_USERNAME,
    password: process.env.DATASOURCE_PASSWORD,
    database: process.env.DATASOURCE_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
    ssl: useSsl ? { rejectUnauthorized: false } : false,
    namingStrategy: new SnakeNamingStrategy(),
    // logging: true,
  } as const satisfies TypeOrmModuleOptions;
  return config;
});
