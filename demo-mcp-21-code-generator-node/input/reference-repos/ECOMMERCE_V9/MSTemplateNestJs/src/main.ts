import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import rTracer = require('cls-rtracer')
import { ExceptionManager } from './common/lib/exceptions-manager.filter';
import generalConfig from './common/configuration/general.config';
//APM
import apmConfig from './common/configuration/apm.config';
var apm = require('elastic-apm-node').start(apmConfig);

const info = require('../package.json');

async function bootstrap() {

  const port = generalConfig.port;
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bufferLogs: true
  });

  //Configuración libreria para validación de DTOs
  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: true, forbidNonWhitelisted: true, whitelist: true }));
  //Configuración libreria para generación de indentificador de solicitud
  app.use(rTracer.expressMiddleware())
  //Configuración de filter para el manejo de excepciones
  app.useGlobalFilters(new ExceptionManager());
  //Empezar a escuchar los shutdown hooks
  app.enableShutdownHooks();

  //Swagger
  const swaggerconfig = new DocumentBuilder()
    .setTitle(info.name)
    .setDescription(info.description)
    .setVersion(info.version)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerconfig);
  SwaggerModule.setup('', app, document);


  await app.listen(port, () => Logger.log(`Microservice is listening on port ${port}`));
}
bootstrap();
