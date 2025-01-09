import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,POST,PATCH,DELETE', 
    allowedHeaders: 'Content-Type, Authorization', 
  });

  // Configure Swagger options
  const config = new DocumentBuilder()
    .setTitle('Personal Book Library API')
    .setDescription('API documentation for the Personal Book Library Manager')
    .setVersion('1.0')
    .addTag('books')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Swagger UI available at /api

  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Swagger API docs available at: http://localhost:3000/api');
}

bootstrap();
