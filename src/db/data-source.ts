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
  host: process.env.DATASOURCE_HOST,
  port: Number(process.env.DATASOURCE_PORT),
  username: process.env.DATASOURCE_USERNAME,
  password: process.env.DATASOURCE_PASSWORD,
  database: process.env.DATASOURCE_DATABASE,
  migrations: ['src/db/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
  logging: true,
};

export default new DataSource(config);
