import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, SubTask, File } from '../../../database/schemas';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTask>,
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  // Create a new task
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { subTasks, attachments, ...taskData } = createTaskDto;

    const createdTask = new this.taskModel({
      ...taskData,
      subTasks: subTasks?.map((id) => new Types.ObjectId(id)),
      attachments: attachments?.map((id) => new Types.ObjectId(id)),
    });

    return createdTask.save();
  }

  // Find all tasks
  async findAll(): Promise<Task[]> {
    return this.taskModel
      .find()
      .populate('subTasks')
      .populate('attachments')
      .exec();
  }

  // Find one task by id
  async findOne(id: string): Promise<Task> {
    return this.taskModel
      .findById(id)
      .populate('subTasks')
      .populate('attachments')
      .exec();
  }

  // Update a task
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const { subTasks, attachments, ...updateData } = updateTaskDto;

    return this.taskModel
      .findByIdAndUpdate(
        id,
        {
          ...updateData,
          ...(subTasks && {
            subTasks: subTasks.map((id) => new Types.ObjectId(id)),
          }),
          ...(attachments && {
            attachments: attachments.map((id) => new Types.ObjectId(id)),
          }),
        },
        { new: true },
      )
      .exec();
  }

  // Remove a task
  async remove(id: string): Promise<void> {
    await this.taskModel.findByIdAndDelete(id).exec();
  }
}
