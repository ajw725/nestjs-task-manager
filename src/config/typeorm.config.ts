import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfig } from 'src/config.interface';
import * as config from 'config';

const dbConfig: DbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.DB_HOST || dbConfig.host,
  port: parseInt(process.env.DB_PORT) || dbConfig.port,
  username: process.env.DB_USERNAME || dbConfig.username,
  database: process.env.DB_NAME || dbConfig.database,
  password: process.env.DB_PASSWORD || dbConfig.password,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.DB_SYNC === 'true' || dbConfig.synchronize,
};
