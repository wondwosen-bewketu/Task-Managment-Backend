import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubTask, Task } from '../../../database/schemas';
import { CreateSubTaskDto, UpdateSubTaskDto } from '../dtos';

@Injectable()
export class SubTaskService {
  constructor(
    @InjectModel(SubTask.name) private readonly subTaskModel: Model<SubTask>,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
  ) {}

  /**
   * Create a new subtask and associate it with a parent task.
   * @param createSubTaskDto - Data Transfer Object for creating a subtask.
   * @returns The created subtask.
   */
  async create(createSubTaskDto: CreateSubTaskDto): Promise<SubTask> {
    const { parentTask, ...subTaskData } = createSubTaskDto;

    // Verify the parent task exists
    const task = await this.taskModel.findById(parentTask);
    if (!task) {
      throw new NotFoundException('Parent task not found');
    }

    // Create and save the subtask
    const subTask = await this.subTaskModel.create({
      ...subTaskData,
      parentTask,
    });

    // Add the subtask ID to the parent task's subTasks array and save the parent task
    task.subTasks = [...task.subTasks, subTask._id as Types.ObjectId];
    await task.save();

    return subTask;
  }

  /**
   * Retrieve all subtasks.
   * @returns An array of subtasks.
   */
  async findAll(): Promise<SubTask[]> {
    return this.subTaskModel.find().exec();
  }

  /**
   * Retrieve a subtask by ID.
   * @param id - The ID of the subtask to retrieve.
   * @returns The subtask, if found.
   */
  async findOne(id: string): Promise<SubTask> {
    const subTask = await this.subTaskModel.findById(id).exec();
    if (!subTask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }
    return subTask;
  }

  /**
   * Update a subtask by ID.
   * @param id - The ID of the subtask to update.
   * @param updateSubTaskDto - Data Transfer Object for updating a subtask.
   * @returns The updated subtask.
   */
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

  /**
   * Delete a subtask by ID.
   * @param id - The ID of the subtask to delete.
   * @returns A promise that resolves when the subtask is deleted.
   */
  async remove(id: string): Promise<void> {
    const subTask = await this.subTaskModel.findByIdAndDelete(id).exec();
    if (!subTask) {
      throw new NotFoundException(`Subtask with ID ${id} not found`);
    }

    // Remove the subtask ID from the parent task's subTasks array
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
