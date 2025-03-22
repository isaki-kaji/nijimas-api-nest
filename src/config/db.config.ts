import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

console.log('Using Database Config:');
console.log('Host:', process.env.DATASOURCE_HOST);
console.log('Port:', process.env.DATASOURCE_PORT);

export default registerAs('database', () => {
  const config = {
    type: 'postgres',
    host: process.env.DATASOURCE_HOST,
    port: Number(process.env.DATASOURCE_PORT),
    username: process.env.DATASOURCE_USERNAME,
    password: process.env.DATASOURCE_PASSWORD,
    database: process.env.DATASOURCE_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
    ssl: {
      rejectUnauthorized: false,
    },
    namingStrategy: new SnakeNamingStrategy(),
    // logging: true,
  } as const satisfies TypeOrmModuleOptions;
  return config;
});
