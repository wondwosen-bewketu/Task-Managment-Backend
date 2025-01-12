import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { BaseSchemaWithSoftDelete } from './schema';

@Schema({ timestamps: true })
export class File extends BaseSchemaWithSoftDelete {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  publicId: string;

  @Prop({ required: false })
  extension?: string; // Optional field for file extension

  @Prop({ default: null, required: false })
  size?: number; // Optional field with default null

  @Prop({ type: Types.ObjectId, ref: 'Task' })
  parentTask: Types.ObjectId; // Should be ObjectId type since it references another document
}

export const FileSchema = SchemaFactory.createForClass(File);
