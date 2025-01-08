import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SubTask } from '../../../database/schemas';
import { CreateSubTaskDto, UpdateSubTaskDto } from '../dtos';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectModel(SubTask.name)
    private readonly subTaskModel: Model<SubTask>,
  ) {}

  async create(createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    const createdSubTask = new this.subTaskModel(createSubTaskDto);
    return createdSubTask.save();
  }

  async findAll(): Promise<SubTask[]> {
    return this.subTaskModel.find().exec();
  }

  async findOne(id: string): Promise<SubTask> {
    return this.subTaskModel.findById(id).exec();
  }

  async update(
    id: string,
    updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    return this.subTaskModel
      .findByIdAndUpdate(id, updateSubTaskDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.subTaskModel.findByIdAndDelete(id).exec();
  }
}
