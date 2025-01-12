// file.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from '../tasks/task.module'; // Import TaskModule to access TaskService
import { FileController } from './controllers/file.controller';
import { FileService } from './services/file.service';
import { CloudinaryService } from './services/cloudinary.service';

@Module({
  imports: [ConfigModule, TaskModule], // Import TaskModule here
  controllers: [FileController],
  providers: [FileService, CloudinaryService], // FileService can now use TaskService
  exports: [FileService, CloudinaryService],
})
export class FileModule {}
