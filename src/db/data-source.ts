import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const envFile = '.env.test';

const myEnv = dotenv.config({ path: envFile });
dotenvExpand.expand(myEnv);

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  migrations: ['src/db/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
};

console.log('Using Database Config:');
console.log('Host:', process.env.DATASOURCE_HOST);
console.log('Port:', process.env.DATASOURCE_PORT);

export default new DataSource(config);
