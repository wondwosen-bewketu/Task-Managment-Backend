import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task, SubTask } from '../../../database/schemas';
import { CreateTaskDto, UpdateTaskDto } from '../dtos';
import { PriorityLevel, TaskStatus } from '../../../shared/enums';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTask>,
  ) {}

  private static toObjectIdArray(ids?: string[]): Types.ObjectId[] | undefined {
    return ids?.map((id) => new Types.ObjectId(id));
  }

  private validateObjectId(id: string): void {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(`Invalid ID format: ${id}`);
    }
  }

  async create(createTaskDto: CreateTaskDto): Promise<any> {
    try {
      const { subTasks, ...taskData } = createTaskDto;
      const createdTask = new this.taskModel({
        ...taskData,
        subTasks: TaskService.toObjectIdArray(subTasks),
      });

      const task = await createdTask.save();
      return task.toObject({ versionKey: false }); // Removes __v
    } catch (error) {
      throw new BadRequestException('Failed to create task');
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    filters?: { status?: TaskStatus; priority?: PriorityLevel },
  ): Promise<any> {
    const skip = (page - 1) * limit;

    const query: Partial<Record<string, unknown>> = {
      ...(filters?.status && { status: filters.status }),
      ...(filters?.priority && { priority: filters.priority }),
    };

    const [tasks, total] = await Promise.all([
      this.taskModel
        .find(query)
        .populate({
          path: 'subTasks',
          model: 'SubTask', // Reference the SubTask model
          select: 'title description status', // Specify the fields to fetch from SubTask
        })
        .skip(skip)
        .limit(limit)
        .lean() // Converts documents to plain objects
        .exec(),
      this.taskModel.countDocuments(query).exec(),
    ]);

    return {
      tasks,
      total,
    };
  }

  async findOne(id: string): Promise<any> {
    this.validateObjectId(id);

    const task = await this.taskModel
      .findById(id)
      .populate({
        path: 'subTasks',
        model: 'SubTask', // Reference the SubTask model
        select: 'title description status', // Specify the fields to fetch from SubTask
      })
      .lean() // Converts document to a plain JavaScript object
      .exec();

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async updateStatus(id: string, status: TaskStatus): Promise<any> {
    this.validateObjectId(id);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .lean()
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const { __v, ...rest } = updatedTask; // Remove __v field from the response
    return rest;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<any> {
    this.validateObjectId(id);

    const updatedTask = await this.taskModel
      .findByIdAndUpdate(id, updateTaskDto, { new: true })
      .lean()
      .exec();

    if (!updatedTask) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    const { __v, ...rest } = updatedTask; // Remove __v field from the response
    return rest;
  }

  async remove(id: string): Promise<void> {
    this.validateObjectId(id);

    const result = await this.taskModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }
}
