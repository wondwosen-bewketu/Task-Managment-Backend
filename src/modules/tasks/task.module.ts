import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './controllers';
import { TaskService } from './services';
import {
  Task,
  TaskSchema,
  SubTask,
  SubTaskSchema,
} from './../../database/schemas';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SubTask.name, schema: SubTaskSchema },
    ]),
    FileModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
