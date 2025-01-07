import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './file.schema';
import { TaskModule } from '../task/task.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
    TaskModule, // File module will interact with Task module
  ],
  controllers: [FileController],
  providers: [FileService],
})
export class FileModule {}
