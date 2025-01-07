import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { SubTask } from './subtask.schema';
import { BaseSchemaWithSoftDelete } from './schema';

export type TaskDocument = Task & Document;

@Schema({ timestamps: true })
export class Task extends BaseSchemaWithSoftDelete {
  // Extend base schema
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'Pending' })
  status: string; // Task status (Pending, In Progress, Completed)

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'SubTask' }],
    default: [],
  })
  subTasks: SubTask[];

  @Prop({
    type: [
      {
        url: String,
        fileName: String,
        fileType: String,
        fileSize: Number,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  attachments: Array<{
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    createdAt: Date;
  }>;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
