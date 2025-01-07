import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ConfigType } from './config/types';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule);

  // Retrieve configuration using ConfigService
  const configService = app.get<ConfigService<ConfigType>>(ConfigService);
  const appConfig = configService.get('app', { infer: true });

  // Set application port and name
  const port = appConfig?.port;
  const appName = appConfig?.appName || 'NestJS App';

  // Start listening on the specified port
  await app.listen(port);

  // Log server details
  console.log(`${appName} is running on: http://localhost:${port}`);
}

bootstrap();
