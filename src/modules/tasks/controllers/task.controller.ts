import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { Task } from '../../../database/schemas';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TaskStatus } from 'src/shared/enums';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task (no auth required)' })
  @ApiResponse({
    status: 201,
    description: 'Task created successfully',
    type: Task,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskService.create(createTaskDto);
    } catch (error) {
      throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with pagination (no auth required)' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'Return all tasks with pagination',
    schema: {
      properties: {
        tasks: { type: 'array', items: { $ref: '#/components/schemas/Task' } },
        total: { type: 'number' },
      },
    },
  })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ tasks: Task[]; total: number }> {
    return await this.taskService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id (no auth required)' })
  @ApiResponse({ status: 200, description: 'Return the task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update task status' })
  @ApiResponse({
    status: 200,
    description: 'Task status updated successfully',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: TaskStatus },
  ): Promise<Task> {
    const { status } = body;

    const updatedTask = await this.taskService.updateStatus(id, status);

    if (!updatedTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }

    return updatedTask;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task (no auth required)' })
  @ApiResponse({
    status: 200,
    description: 'Task updated successfully',
    type: Task,
  })
  @ApiResponse({ status: 404, description: 'Task not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const updatedTask = await this.taskService.update(id, updateTaskDto);
    if (!updatedTask) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return updatedTask;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task (no auth required)' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    const success = await this.taskService.remove(id);
    if (!success) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return { message: 'Task deleted successfully' };
  }
}
