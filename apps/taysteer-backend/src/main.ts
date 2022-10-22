import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SESSION_SECRET_KEY,
  PORT,
  SESSION_SECRET_SALT,
  PORT_FRONTEND,
} from '../../../configs/common/config';
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
      cors: {
        origin: `http://localhost:${PORT_FRONTEND}`,
        credentials: true,
      },
      logger: ['error', 'warn'],
    }
  );

  app.register(secureSession, {
    secret: SESSION_SECRET_KEY,
    salt: SESSION_SECRET_SALT,
    cookie: {
      path: '*',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());
  app.register(fastifyMultiPart);

  const swaggerDocument = YAML.load(
    path.join(__dirname, '../../../apps/taysteer-backend/doc/api.yaml')
  );
  SwaggerModule.setup('api/doc', app, swaggerDocument);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Service is running at http://localhost:${PORT}`);
  });
}
bootstrap();
