import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaWithSoftDelete } from './schema';
import { TaskStatus } from '../../shared/enums';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class SubTask extends BaseSchemaWithSoftDelete {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTask: string;
}

export const SubTaskSchema = SchemaFactory.createForClass(SubTask);
