import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  fileType: string;

  @Prop({ required: true })
  fileSize: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
