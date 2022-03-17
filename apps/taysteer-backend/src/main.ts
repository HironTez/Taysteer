import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT_BACKEND } from '../../../configs/common/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import path from 'path';
import YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import fastifyMultiPart from 'fastify-multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
      logger: ['error', 'warn']
    }
  );

  app.register(fastifyMultiPart);

  const swaggerDocument = YAML.load(path.join(__dirname, '../../../apps/taysteer-backend/doc/api.yaml'));
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT_BACKEND);
  console.log(`Service is running http://localhost:${PORT_BACKEND}`);
}
bootstrap();
