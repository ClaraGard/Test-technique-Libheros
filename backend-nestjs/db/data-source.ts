import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export const dataSourceOption: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false, // Don't use synchronize in production!
  logging: false,
  entities: ["dist/src/**/*.entity.js"],
  migrations: ["dist/db/migrations/*.js"],
  subscribers: [],
};
const dataSource = new DataSource(dataSourceOption);
export default dataSource;
