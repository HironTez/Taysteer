import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT_BACKEND } from './common/config';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: true,
      logger: ['error', 'warn']
    }
  );
  await app.listen(PORT_BACKEND);
  console.log(`Service is running http://localhost:${PORT_BACKEND}`);
}
bootstrap();
