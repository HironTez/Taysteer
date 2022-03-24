import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { JWT_SECRET_KEY, PORT_BACKEND } from '../../../configs/common/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import path from 'path';
import YAML from 'yamljs';
import { SwaggerModule } from '@nestjs/swagger';
import secureSession from 'fastify-secure-session';
import fastifyPassport from 'fastify-passport';
import fastifyMultiPart from 'fastify-multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
      logger: ['error', 'warn'],
    }
  );

  app.register(secureSession, {
    secret: JWT_SECRET_KEY,
    salt: 'mq9hDxBVDbspDR6n',
  });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifyMultiPart);

  const swaggerDocument = YAML.load(
    path.join(__dirname, '../../../apps/taysteer-backend/doc/api.yaml')
  );
  SwaggerModule.setup('doc', app, swaggerDocument);

  await app.listen(PORT_BACKEND);
  console.log(`Service is running http://localhost:${PORT_BACKEND}`);
}
bootstrap();
