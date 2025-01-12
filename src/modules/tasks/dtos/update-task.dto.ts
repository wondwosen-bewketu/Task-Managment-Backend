import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';
import { TaskStatus, PriorityLevel } from '../../../shared/enums';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ description: 'The title of the task', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'The description of the task', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    enum: TaskStatus,
    description: 'The status of the task',
    required: false,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiProperty({
    enum: PriorityLevel,
    description: 'The priority level of the task',
    required: false,
  })
  @IsEnum(PriorityLevel)
  @IsOptional()
  priority?: PriorityLevel;

  @ApiProperty({
    type: [String],
    description: 'Array of SubTask IDs',
    required: false,
  })
  @IsArray()
  @IsOptional()
  subTasks?: string[]; // Array of SubTask IDs

  @ApiProperty({
    type: [String],
    description: 'Array of File IDs',
    required: false,
  })
  @IsArray()
  @IsOptional()
  attachments?: string[]; // Array of File IDs
}
