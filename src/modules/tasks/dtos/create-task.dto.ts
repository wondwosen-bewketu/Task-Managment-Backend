import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { TaskStatus, PriorityLevel } from '../../../shared/enums';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @IsArray()
  @IsOptional()
  subTasks?: string[]; // Array of SubTask IDs

  @IsArray()
  @IsOptional()
  attachments?: string[]; // Array of File IDs
}
