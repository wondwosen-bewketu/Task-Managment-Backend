import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTask, SubTaskDocument } from '../../../database/schemas';
import { CreateSubTaskDto } from '../dtos';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectModel(SubTask.name) private subTaskModel: Model<SubTaskDocument>,
  ) {}

  async create(createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    const createdSubTask = new this.subTaskModel(createSubTaskDto);
    return createdSubTask.save();
  }

  async findAll(taskId: string): Promise<SubTask[]> {
    return this.subTaskModel.find({ task: taskId }).exec();
  }

  async findOne(id: string): Promise<SubTask> {
    return this.subTaskModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSubTaskDto: CreateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTaskModel
      .findByIdAndUpdate(id, updateSubTaskDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<SubTask> {
    return this.subTaskModel.findByIdAndDelete(id).exec();
  }
}
