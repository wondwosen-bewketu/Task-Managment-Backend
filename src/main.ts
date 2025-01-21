// main.ts (NestJS entry point)

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/types';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Enable CORS with optional configurations
  app.enableCors({
    origin: 'http://localhost:5173', // Specify the frontend's origin (you can also use a wildcard '*' for testing)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies or authentication headers if needed
  });

  // Retrieve configuration using ConfigService
  const configService = app.get<ConfigService<ConfigType>>(ConfigService);
  const appConfig = configService.get('app', { infer: true });

  // Set application port and name
  const port = appConfig?.port || 3000; // Ensure a default port if not defined
  const appName = appConfig?.appName || 'NestJS App';

  // Setup Swagger documentation
  const config = new DocumentBuilder()
    .setTitle(appName)
    .setDescription(`${appName} API documentation`)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Start listening on the specified port
  await app.listen(port);
}

bootstrap();
