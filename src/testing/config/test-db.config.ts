import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export default registerAs('testDatabase', () => {
  const config = {
    type: 'postgres',
    url: process.env.TEST_DATASOURCE_URL,
    autoLoadEntities: true,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
  } as const satisfies TypeOrmModuleOptions;
  return config;
});
