import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from '../../../database/schemas';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  // Create a new task
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  // Find all tasks
  async findAll(): Promise<Task[]> {
    return this.taskModel.find().populate('subTasks').exec();
  }

  // Find one task by id
  async findOne(id: string): Promise<Task> {
    return this.taskModel.findById(id).populate('subTasks').exec();
  }

  // Update a task
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    return this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .exec();
  }

  // Remove a task
  async remove(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete(id).exec();
  }
}
