import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { SubTaskService } from '../services';
import { CreateSubTaskDto } from '../dtos';
import { SubTask } from '../../../database/schemas';

@Controller('subtasks')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Post()
  create(@Body() createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    return this.subTaskService.create(createSubTaskDto);
  }

  @Get(':taskId')
  findAll(@Param('taskId') taskId: string): Promise<SubTask[]> {
    return this.subTaskService.findAll(taskId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SubTask> {
    return this.subTaskService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSubTaskDto: CreateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTaskService.update(id, updateSubTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<SubTask> {
    return this.subTaskService.remove(id);
  }
}
