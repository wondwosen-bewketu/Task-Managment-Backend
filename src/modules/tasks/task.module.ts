// task.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from './controllers/task.controller';
import { TaskService } from './services/task.service';
import {
  Task,
  TaskSchema,
  SubTask,
  SubTaskSchema,
} from './../../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: SubTask.name, schema: SubTaskSchema },
    ]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService], // Export TaskService so it can be imported elsewhere
})
export class TaskModule {}
