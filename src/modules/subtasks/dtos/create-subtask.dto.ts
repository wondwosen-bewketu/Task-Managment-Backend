import { IsString, IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateSubTaskDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsMongoId()
  @IsNotEmpty()
  task: string; // The ID of the task this subtask belongs to

  @IsString()
  @IsOptional()
  status?: string; // Status like 'pending', 'in-progress', 'completed'

  @IsOptional()
  @IsString()
  dueDate?: string; // Optional due date for the subtask
}
