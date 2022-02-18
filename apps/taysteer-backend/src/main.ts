import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT_BACKEND } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  console.log(`App is running. Port: ${PORT_BACKEND}`);
  await app.listen(PORT_BACKEND);
}
bootstrap();