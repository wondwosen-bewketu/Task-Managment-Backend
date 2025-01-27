import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpCode,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PriorityLevel, TaskStatus } from '../../../shared/enums';
import { Task } from '../../../database/schemas';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<any> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination and filtering' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, type: String, enum: TaskStatus })
  @ApiQuery({
    name: 'priority',
    required: false,
    type: String,
    enum: Object.values(PriorityLevel),
  }) // Fix here
  @ApiQuery({ name: 'title', required: false, type: String })
  @ApiQuery({ name: 'description', required: false, type: String })
  @ApiResponse({
    status: 200,
    description: 'Return paginated and filtered tasks',
    schema: {
      properties: {
        tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
        total: { type: 'number' },
      },
    },
  })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: TaskStatus,
    @Query('priority') priority?: PriorityLevel,
    @Query('title') title?: string,
    @Query('description') description?: string,
  ): Promise<any> {
    const filters = {
      status,
      priority,
      title,
      description,
    };
    return this.taskService.findAll(page, limit, filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task', type: Task })
  async findOne(@Param('id') id: string): Promise<any> {
    return this.taskService.findOne(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    type: Task,
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus },
  ): Promise<any> {
    return this.taskService.updateStatus(id, body.status);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<any> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.taskService.remove(id);
  }
}
