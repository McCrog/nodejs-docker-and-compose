import { DataSourceOptions, DatabaseType } from 'typeorm';

export const appDataSourceOptions: DataSourceOptions = <DataSourceOptions>{
  type: <DatabaseType>process.env.DB_TYPE,
  host: <string>process.env.DB_HOST,
  port: <number>Number(<string>process.env.DB_PORT),
  username: <string>process.env.DB_USERNAME,
  password: <string>process.env.DB_PASSWORD,
  database: <string>process.env.DB_NAME,
  synchronize: <boolean>(process.env.DB_SYNCHRONIZE === 'true' || false),
  entities: [__dirname + '/**/**/*.entity.{js,ts}'],
};
