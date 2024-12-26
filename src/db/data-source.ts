import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

// .envファイルの内容をprocess.envに展開する
dotenvExpand.expand(dotenv.config());

export default new DataSource({
  type: 'postgres',
  url: process.env.DATASOURCE_URL,
  entities: ['dist/entities/*.entity.js'],
  migrations: ['dist/database/migrations/*.js'],
});
