import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import config from 'config';
console.log("🚀 ~ file: main.ts:5 ~ config:", config)

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const documentConfig = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('api')
    .build();

  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.PORT_BACKEND).then(() => {
    console.log(`Listening on http://localhost:${config.PORT_BACKEND}`);
  });
}
bootstrap();
