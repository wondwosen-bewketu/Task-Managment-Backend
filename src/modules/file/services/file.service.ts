import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File } from '../../../database/schemas';
import { CreateFileDto, UpdateFileDto } from '../dtos';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private readonly fileModel: Model<File>,
  ) {}

  async create(createFileDto: CreateFileDto): Promise<File> {
    const createdFile = new this.fileModel(createFileDto);
    return createdFile.save();
  }

  async findAll(): Promise<File[]> {
    return this.fileModel.find().exec();
  }

  async findOne(id: string): Promise<File> {
    return this.fileModel.findById(id).exec();
  }

  async update(id: string, updateFileDto: UpdateFileDto): Promise<File> {
    return this.fileModel
      .findByIdAndUpdate(id, updateFileDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.fileModel.findByIdAndDelete(id).exec();
  }
}
