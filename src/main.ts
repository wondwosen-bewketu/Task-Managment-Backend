import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/types';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Retrieve configuration using ConfigService
  const configService = app.get<ConfigService<ConfigType>>(ConfigService);
  const appConfig = configService.get('app', { infer: true });

  // Set application port and name
  const port = appConfig?.port;
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
