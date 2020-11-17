import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbConfig } from '../config.interface';
import * as config from 'config';

const dbConfig: DbConfig = config.get('db');

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  host: process.env.RDS_HOSTNAME || dbConfig.host,
  port: parseInt(process.env.RDS_PORT) || dbConfig.port,
  username: process.env.RDS_USERNAME || dbConfig.username,
  database: process.env.RDS_DB_NAME || dbConfig.database,
  password: process.env.RDS_PASSWORD || dbConfig.password,
  entities: [__dirname + '/../**/*.entity.{ts,js}'],
  synchronize: process.env.DB_SYNC === 'true' || dbConfig.synchronize,
};
