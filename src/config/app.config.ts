// app.config.ts
import { registerAs } from '@nestjs/config';
import { IsEnum, IsInt, IsOptional, Min, Max } from 'class-validator';
import { AppConfigType } from '../config/types';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class AppEnvironmentValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;
}

export default registerAs<AppConfigType>('app', () => {
  const validatedConfig = new AppEnvironmentValidator();
  Object.assign(validatedConfig, process.env);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    appName: process.env.APP_NAME || 'NestJS Boilerplate',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 8080,
  };
});
