import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { FileType } from '../../../shared/enums';

export class CreateFileDto {
  @IsString()
  filename: string;

  @IsString()
  path: string;

  @IsEnum(FileType)
  type: FileType;

  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  relatedTask?: string;
}

export class UpdateFileDto {
  @IsString()
  @IsOptional()
  filename?: string;

  @IsString()
  @IsOptional()
  path?: string;

  @IsEnum(FileType)
  @IsOptional()
  type?: FileType;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsOptional()
  @IsString()
  relatedTask?: string;
}
