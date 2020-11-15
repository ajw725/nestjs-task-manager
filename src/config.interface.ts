export interface ServerConfig {
  port: number;
  origin: string;
}

/*
 * a note on the type property:
 * there are many other types, but TypeOrmModuleOptions has a (long) union type, so
 * we need to specify a subset of that instead of just allowing any string
 */
export interface DbConfig {
  host: string;
  type: 'postgres' | 'mysql' | 'sqlite';
  port: number;
  database: string;
  username: string;
  password: string;
  synchronize: boolean;
}

export interface JwtConfig {
  expiresIn: number;
  secret: string;
}
