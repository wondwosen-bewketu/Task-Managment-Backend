import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { SubTask } from '../../../database/schemas';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @IsArray()
  @IsOptional()
  subTasks?: SubTask[];
}
