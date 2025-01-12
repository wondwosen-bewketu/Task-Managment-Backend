import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { TaskService } from '../services/task.service';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { Task } from '../../../database/schemas';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

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
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      return await this.taskService.create(createTaskDto);
    } catch (error) {
      throw new HttpException('Failed to create task', HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks', type: [Task] })
  async findAll(): Promise<Task[]> {
    return await this.taskService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a task by id' })
  @ApiResponse({ status: 200, description: 'Return the task', type: Task })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.taskService.findOne(id);
    if (!task) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    }
    return task;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a task' })
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
  @ApiOperation({ summary: 'Delete a task' })
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
