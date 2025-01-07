import { Schema, Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

// Base Schema for MongoDB
export class BaseSchema {
  @Prop({ type: Types.ObjectId, auto: true })
  id: string;
}

// Base Schema with Timestamps
@Schema({ timestamps: true })
export class BaseSchemaWithTimestamp extends BaseSchema {
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

// Base Schema with Soft Delete (optional)
@Schema({ timestamps: true })
export class BaseSchemaWithSoftDelete extends BaseSchemaWithTimestamp {
  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}
