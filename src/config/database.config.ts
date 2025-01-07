import { Injectable } from '@nestjs/common';
import { DatabaseConfigType } from './types/database-config.type';
import { registerAs } from '@nestjs/config';

@Injectable()
export class DatabaseConfigService {
  getDatabaseConfig(): DatabaseConfigType {
    return {
      uri: process.env.DATABASE_URI || 'mongodb://localhost:27017/mydatabase',
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryAttempts: 5,
      retryDelay: 3000, // milliseconds
    };
  }
}

export default registerAs<DatabaseConfigType>('database', () => {
  const configService = new DatabaseConfigService();
  return configService.getDatabaseConfig();
});
