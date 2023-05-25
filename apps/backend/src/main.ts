import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { PORT_BACKEND, SESSION_SECRET_KEY, SESSION_SECRET_SALT } from 'config';

import { AllExceptionsFilter } from './middleware/exceptions.filter';
import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import YAML from 'yamljs';
import fastifyPassport from '@fastify/passport';
import path from 'path';
import secureSession from '@fastify/secure-session';

async function bootstrap() {
  // Create app
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Check required environment variables
  if (!SESSION_SECRET_KEY)
    throw new ReferenceError(
      'No session secret key found. Please update the SESSION_SECRET_KEY environment variable.',
    );
  if (!SESSION_SECRET_SALT)
    throw new ReferenceError(
      'No session secret salt found. Please update the SESSION_SECRET_SALT environment variable.',
    );

  // Set up sessions
  app.register(secureSession, {
    secret: SESSION_SECRET_KEY,
    salt: SESSION_SECRET_SALT,
    cookie: {
      // path: '*',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    },
  });
  app.register(fastifyPassport.initialize());
  app.register(fastifyPassport.secureSession());

  // Set up global error handle
  app.useGlobalFilters(new AllExceptionsFilter());

  const swaggerDocument = YAML.load(
    path.join(__dirname, '../doc/api.yaml')
  );
  SwaggerModule.setup('', app, swaggerDocument);

  // Start application
  await app.listen(PORT_BACKEND);
  console.log(`Listening on http://localhost:${PORT_BACKEND}`);
}
bootstrap();
