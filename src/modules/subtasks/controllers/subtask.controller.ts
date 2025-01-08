import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { SubTaskService } from '../services';
import { CreateSubTaskDto, UpdateSubTaskDto } from '../dtos';
import { SubTask } from '../../../database/schemas';

@Controller('subtasks')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Post()
  create(@Body() createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    return this.subTaskService.create(createSubTaskDto);
  }

  @Get()
  findAll(): Promise<SubTask[]> {
    return this.subTaskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SubTask> {
    return this.subTaskService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTaskService.update(id, updateSubTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.subTaskService.remove(id);
  }
}
