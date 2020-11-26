import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as config from 'config';

async function bootstrap () {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const options = new DocumentBuilder()
    .setTitle('API Exams Schedulings')
    .setDescription(
      'REST services to managment exams schedulings for clients',
    )
    .setVersion('1.0')
    .setContact('Rodolfo do Nascimento Azevedo', 'https://www.linkedin.com/in/rodolfo-azevedo-98485b52/', 'rof20004@gmail.com')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      docExpansion: 'none',
      defaultModelsExpandDepth: -1,
    },
  });

  const serverConfig = config.get('server');
  await app.listen(serverConfig.port);
}

bootstrap();
