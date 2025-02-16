import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
import { DataSource, DataSourceOptions } from 'typeorm';

const config: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  migrations: ['src/migrations/*.ts'],
  entities: ['src/entities/*.entity.ts'],
};

export default new DataSource(config);
