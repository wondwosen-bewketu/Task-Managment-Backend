import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import {
  Task,
  TaskSchema,
  SubTask,
  SubTaskSchema,
  File,
  FileSchema,
} from './../../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SubTask.name, schema: SubTaskSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
