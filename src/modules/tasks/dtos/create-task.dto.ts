import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { SubTask } from '../../../database/schemas';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isCompleted: boolean;

  @IsArray()
  @IsOptional()
  subTasks: SubTask[];
}
