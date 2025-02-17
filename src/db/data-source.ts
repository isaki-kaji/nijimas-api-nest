import { DataSource, DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const envFile =
  process.env.ENV_FILE ||
  (process.env.NODE_ENV === 'test' ? '.env.test' : '.env');
const myEnv = dotenv.config({ path: envFile });
dotenvExpand.expand(myEnv);

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  migrations: ['src/db/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
};

console.log('🔍 TypeORM DataSource URL:', process.env.DATASOURCE_URL);

export default new DataSource(config);
