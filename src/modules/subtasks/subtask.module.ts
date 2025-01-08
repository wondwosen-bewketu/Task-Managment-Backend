import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubTaskController } from './controllers';
import { SubTaskService } from './services';
import { SubTask, SubTaskSchema } from '../../database/schemas';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SubTask.name, schema: SubTaskSchema }]),
  ],
  controllers: [SubTaskController],
  providers: [SubTaskService],
  exports: [SubTaskService],
})
export class SubTaskModule {}
