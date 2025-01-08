import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { FileService } from '../services';
import { CreateFileDto, UpdateFileDto } from '../dtos';
import { File } from '../../../database/schemas';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  create(@Body() createFileDto: CreateFileDto): Promise<File> {
    return this.fileService.create(createFileDto);
  }

  @Get()
  findAll(): Promise<File[]> {
    return this.fileService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<File> {
    return this.fileService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateFileDto: UpdateFileDto,
  ): Promise<File> {
    return this.fileService.update(id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.fileService.remove(id);
  }
}
