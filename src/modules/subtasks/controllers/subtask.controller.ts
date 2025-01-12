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
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('SubTasks') // Groups endpoints under "SubTasks" in Swagger UI
@Controller('subtasks')
export class SubTaskController {
  constructor(private readonly subTaskService: SubTaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new sub-task' })
  @ApiResponse({
    status: 201,
    description: 'The sub-task has been successfully created.',
    type: SubTask,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  create(@Body() createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    return this.subTaskService.create(createSubTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all sub-tasks' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all sub-tasks.',
    type: [SubTask],
  })
  findAll(): Promise<SubTask[]> {
    return this.subTaskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single sub-task by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the sub-task to retrieve',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the sub-task.',
    type: SubTask,
  })
  @ApiResponse({ status: 404, description: 'Sub-task not found.' })
  findOne(@Param('id') id: string): Promise<SubTask> {
    return this.subTaskService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a sub-task by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the sub-task to update',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully updated the sub-task.',
    type: SubTask,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 404, description: 'Sub-task not found.' })
  update(
    @Param('id') id: string,
    @Body() updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTaskService.update(id, updateSubTaskDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a sub-task by ID' })
  @ApiParam({
    name: 'id',
    description: 'The ID of the sub-task to delete',
    example: '60d21b4667d0d8992e610c85',
  })
  @ApiResponse({
    status: 200,
    description: 'The sub-task has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Sub-task not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.subTaskService.remove(id);
  }
}
