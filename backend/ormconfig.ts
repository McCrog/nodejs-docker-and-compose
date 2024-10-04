import { DataSourceOptions, DatabaseType } from 'typeorm';

export const appDataSourceOptions: DataSourceOptions = <DataSourceOptions>{
  type: <DatabaseType>process.env.DB_TYPE,
  host: <string>process.env.POSTGRES_HOST,
  port: <number>Number(<string>process.env.POSTGRES_PORT),
  username: <string>process.env.POSTGRES_USER,
  password: <string>process.env.POSTGRES_PASSWORD,
  database: <string>process.env.POSTGRES_DB,
  synchronize: <boolean>(process.env.POSTGRES_SYNCHRONIZE === 'true' || false),
  entities: [__dirname + '/**/**/*.entity.{js,ts}'],
};
