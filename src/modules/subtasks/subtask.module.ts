import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubTaskController } from './controllers';
import { SubTaskService } from './services';
import {
  SubTask,
  SubTaskSchema,
  Task,
  TaskSchema,
} from '../../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubTask.name, schema: SubTaskSchema },
      { name: Task.name, schema: TaskSchema },
    ]),
  ],
  controllers: [SubTaskController],
  providers: [SubTaskService],
})
export class SubTaskModule {}
