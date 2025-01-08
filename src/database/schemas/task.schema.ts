import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchemaWithSoftDelete } from './schema';
import { TaskStatus, PriorityLevel } from '../../shared/enums';

@Schema({ timestamps: true })
export class Task extends BaseSchemaWithSoftDelete {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @Prop({ enum: PriorityLevel, default: PriorityLevel.MEDIUM })
  priority: PriorityLevel;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'SubTask' }] })
  subTasks: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'File' }] })
  attachments: Types.ObjectId[];
}

export const TaskSchema = SchemaFactory.createForClass(Task);
