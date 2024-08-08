import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';




async function movieApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(express.static("."))

  app.setGlobalPrefix('api');



  const config = new DocumentBuilder().setTitle("Api Movie").addBearerAuth().build()

  const document = SwaggerModule.createDocument(app, config)

  SwaggerModule.setup("/swagger", app, document)


  await app.listen(8080);
}
movieApp();
