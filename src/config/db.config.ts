import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

console.log('Urlの確認-------------------------:');
console.log('url', process.env.DATASOURCE_URL);

export default registerAs('database', () => {
  const config = {
    type: 'postgres',
    url: process.env.DATASOURCE_URL,
    autoLoadEntities: true,
    synchronize: false,
    namingStrategy: new SnakeNamingStrategy(),
    // logging: true,
  } as const satisfies TypeOrmModuleOptions;
  return config;
});
