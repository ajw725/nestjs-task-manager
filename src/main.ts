import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ServerConfig } from './config.interface';
import * as config from 'config';

async function bootstrap() {
  const serverConfig: ServerConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: serverConfig.origin });

  await app.listen(port);
  logger.log(`Listening on port ${port}`);
  logger.log(`Accepting requests from origin ${serverConfig.origin}`);
}
bootstrap();
