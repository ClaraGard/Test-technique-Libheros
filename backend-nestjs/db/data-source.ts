import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
console.log("DB_HOST", process.env.DB_HOST)

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
  migrations: ["dst/db/migrations/*.js"],
  subscribers: [],
};
const dataSource = new DataSource(dataSourceOption);
export default dataSource;
