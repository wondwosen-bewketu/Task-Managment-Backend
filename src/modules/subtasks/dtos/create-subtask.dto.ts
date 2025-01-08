import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../shared/enums';

export class CreateSubTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  parentTask?: string;
}

export class UpdateSubTaskDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsString()
  @IsOptional()
  parentTask?: string;
}
