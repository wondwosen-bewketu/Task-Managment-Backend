import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaWithTimestamp } from './schema';
import { FileType } from '../../shared/enums';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class File extends BaseSchemaWithTimestamp {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  path: string;

  @Prop({ required: true, enum: FileType })
  type: FileType;

  @Prop({ required: true })
  size: number;

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  relatedTask: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
