import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { appConfig, databaseConfig } from './config';
import { DatabaseModule } from './database/database.module';
import { TaskModule, SubTaskModule } from './modules'; // Import TaskModule

@Module({
  imports: [
    // Global configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig], // Load both app and database configurations
    }),
    // Database module
    DatabaseModule,
    // Task module
    TaskModule,
    SubTaskModule,
  ],
})
export class AppModule {}
