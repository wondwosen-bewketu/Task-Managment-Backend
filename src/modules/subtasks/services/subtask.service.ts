import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTask, Task } from '../../../database/schemas';
import { CreateSubTaskDto, UpdateSubTaskDto } from '../dtos';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTask>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  async create(createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    const { parentTask, ...subTaskData } = createSubTaskDto;

    const task = await this.taskModel.findById(parentTask);
    if (!task) {
      throw new NotFoundException('Parent task not found');
    }

    const subTask = await this.subTaskModel.create({
      ...subTaskData,
      parentTask,
    });
    task.subTasks.push(subTask._id);
    await task.save();

    return subTask;
  }

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: SubTask[]; total: number }> {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.subTaskModel.find().skip(skip).limit(limit).exec(),
      this.subTaskModel.countDocuments().exec(),
    ]);

    return { data, total };
  }

  async findOne(id: string): Promise<SubTask> {
    const subTask = await this.subTaskModel.findById(id).exec();
    if (!subTask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return subTask;
  }

  async update(
    id: string,
    updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    const subTask = await this.subTaskModel
      .findByIdAndUpdate(id, updateSubTaskDto, { new: true })
      .exec();
    if (!subTask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return subTask;
  }

  async remove(id: string): Promise<void> {
    const subTask = await this.subTaskModel.findByIdAndDelete(id).exec();
    if (!subTask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    if (subTask.parentTask) {
      const parentTask = await this.taskModel.findById(subTask.parentTask);
      if (parentTask) {
        parentTask.subTasks = parentTask.subTasks.filter(
          (subTaskId) => !subTaskId.equals(subTask._id),
        );
        await parentTask.save();
      }
    }
  }
}
