import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, SubTask } from '../../../database/schemas';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTask>,
  ) {}

  // Helper to convert IDs to ObjectId
  private static toObjectIdArray(ids?: string[]): Types.ObjectId[] | undefined {
    return ids?.map((id) => new Types.ObjectId(id));
  }

  // Create a new task
  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const { subTasks, ...taskData } = createTaskDto;

    const createdTask = new this.taskModel({
      ...taskData,
      subTasks: TaskService.toObjectIdArray(subTasks),
    });

    return createdTask.save();
  }

  // Retrieve all tasks with population and selected fields
  async findAll(): Promise<Task[]> {
    return this.taskModel
      .find({}, 'title description status priority subTasks attachments')
      .populate({
        path: 'subTasks',
        model: 'SubTask',
        select: 'title description status',
      })
      .exec();
  }

  // Retrieve a single task by ID with population
  async findOne(id: string): Promise<Task | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    return this.taskModel
      .findById(id, 'title description status priority subTasks attachments')
      .populate({
        path: 'subTasks',
        model: 'SubTask',
        select: 'title description status',
      })
      .exec();
  }

  // Update a task
  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task | null> {
    if (!Types.ObjectId.isValid(id)) return null;

    const { subTasks, ...updateData } = updateTaskDto;

    return this.taskModel
      .findByIdAndUpdate(
        id,
        {
          ...updateData,
          ...(subTasks && { subTasks: TaskService.toObjectIdArray(subTasks) }),
        },
        { new: true },
      )
      .exec();
  }

  // Remove a task
  async remove(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) return false;

    const result = await this.taskModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
