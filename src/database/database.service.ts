import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigType } from '../config/types';

@Injectable()
export class DatabaseService implements MongooseOptionsFactory {
  constructor(private readonly configService: ConfigService<ConfigType>) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('database.uri', { infer: true }),
      retryAttempts: this.configService.get<number>('database.retryAttempts', {
        infer: true,
      }),
      retryDelay: this.configService.get<number>('database.retryDelay', {
        infer: true,
      }),
    };
  }
}
