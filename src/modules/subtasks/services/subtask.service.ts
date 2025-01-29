import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      console.log('Creating subtask:', createSubTaskDto);

      const { parentTask, ...subTaskData } = createSubTaskDto;

      // Ensure title and description are not empty
      if (!subTaskData.title || !subTaskData.description) {
        throw new Error('Title and description are required for a subtask.');
      }

      const task = await this.taskModel.findById(parentTask);

      if (!task) {
        throw new Error('Parent task not found');
      }

      const subTask = new this.subTaskModel({
        ...subTaskData,
        parentTask,
      });

      const savedSubtask = await subTask.save();

      task.subTasks.push(savedSubtask._id);
      await task.save();

      return savedSubtask;
    } catch (error) {
      console.error('Error creating subtask:', error);
      throw new InternalServerErrorException('Failed to create subtask');
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: SubTask[]; total: number }> {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.subTaskModel.find().skip(skip).limit(limit).exec(),
        this.subTaskModel.countDocuments().exec(),
      ]);

      return { data, total };
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      throw new InternalServerErrorException('Failed to fetch subtasks');
    }
  }

  async findOne(id: string): Promise<SubTask> {
    try {
      const subTask = await this.subTaskModel.findById(id).exec();
      if (!subTask) {
        throw new NotFoundException(`Subtask with ID ${id} not found`);
      }
      return subTask;
    } catch (error) {
      console.error(`Error fetching subtask with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to fetch subtask');
    }
  }

  async update(
    id: string,
    updateSubTaskDto: UpdateSubTaskDto,
  ): Promise<SubTask> {
    try {
      const subTask = await this.subTaskModel
        .findByIdAndUpdate(id, updateSubTaskDto, { new: true })
        .exec();

      if (!subTask) {
        throw new NotFoundException(`Subtask with ID ${id} not found`);
      }

      return subTask;
    } catch (error) {
      console.error(`Error updating subtask with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to update subtask');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const subTask = await this.subTaskModel.findByIdAndDelete(id).exec();
      if (!subTask) {
        throw new NotFoundException(`Subtask with ID ${id} not found`);
      }

      // Ensure that the parent task exists and remove the subtask reference from it
      if (subTask.parentTask) {
        const parentTask = await this.taskModel.findById(subTask.parentTask);
        if (parentTask) {
          parentTask.subTasks = parentTask.subTasks.filter(
            (subTaskId) => !subTaskId.equals(subTask._id),
          );
          await parentTask.save();
        } else {
          console.error('Parent task not found during subtask removal');
        }
      }
    } catch (error) {
      console.error(`Error removing subtask with ID ${id}:`, error);
      throw new InternalServerErrorException('Failed to remove subtask');
    }
  }
}
