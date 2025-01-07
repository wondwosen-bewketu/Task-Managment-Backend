import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaWithSoftDelete } from './schema';
import { Types } from 'mongoose';

export type SubTaskDocument = SubTask & Document;

@Schema({ timestamps: true })
export class SubTask extends BaseSchemaWithSoftDelete {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isCompleted: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  task: Types.ObjectId;
}

export const SubTaskSchema = SchemaFactory.createForClass(SubTask);
