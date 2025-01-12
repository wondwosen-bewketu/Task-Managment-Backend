import { IsString, IsEnum, IsOptional } from 'class-validator';
import { TaskStatus } from '../../../shared/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSubTaskDto {
  @ApiProperty({
    description: 'The title of the sub-task',
    example: 'Write API Documentation',
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The description of the sub-task',
    example: 'Document the API endpoints for the project',
  })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    description: 'The status of the sub-task',
    enum: TaskStatus,
    example: 'in_progress',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'The ID of the parent task this sub-task belongs to',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsOptional()
  parentTask?: string;
}

export class UpdateSubTaskDto {
  @ApiPropertyOptional({
    description: 'The updated title of the sub-task',
    example: 'Update API Documentation',
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'The updated description of the sub-task',
    example: 'Revise API documentation for the project',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'The updated status of the sub-task',
    enum: TaskStatus,
    example: 'completed',
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @ApiPropertyOptional({
    description: 'The ID of the updated parent task this sub-task belongs to',
    example: '60d21b4667d0d8992e610c85',
  })
  @IsString()
  @IsOptional()
  parentTask?: string;
}
