import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { CloudinaryService } from './cloudinary.service';
import { TaskService } from '../../tasks/services';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);

  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly taskService: TaskService,
  ) {}

  // Upload file for a task and associate it with the task
  async uploadFileForTask(
    file: Express.Multer.File,
    taskId: string,
  ): Promise<{ url: string; publicId: string }> {
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }

    // Upload file to Cloudinary
    const uploadedFile = await this.cloudinaryService.uploadFile(file, 'tasks');

    // Find the task and update its attachments
    const task = await this.taskService.findOne(taskId);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    task.attachments.push(uploadedFile.url);
    await this.taskService.update(taskId, { attachments: task.attachments });

    return uploadedFile;
  }

  async summarizePdf(publicId: string): Promise<string> {
    try {
      // Fetch the file URL from Cloudinary using publicId
      const fileUrl = await this.cloudinaryService.getFileUrl(publicId);
      this.logger.log(`Fetching file from Cloudinary: ${fileUrl}`);

      // Prepare to send the PDF to the external API for summarization
      const form = new FormData();
      form.append('file', fileUrl);

      // Send request to the external API (Replace with actual URL and headers)
      const response = await axios.post(
        'https://api.apyhub.com/ai/summarize-url',
        form,
        {
          headers: {
            ...form.getHeaders(),
            'apy-token':
              'APY02s97SNHioC3Lm3y5DWsGId7apyx4NUHFByRRzAIllvWlnuw473kCB0Bj0IAB1Mro2I',
          },
        },
      );

      if (response.status === 200) {
        this.logger.log('PDF summarized successfully');
        return response.data.summary;
      } else {
        this.logger.error(
          'Failed to summarize PDF, external API returned an error',
        );
        throw new BadRequestException('Failed to summarize the PDF');
      }
    } catch (error) {
      this.logger.error('Error summarizing PDF', error.stack);
      throw new BadRequestException('Failed to summarize the PDF');
    }
  }
  // Fetch file download URL from Cloudinary
  async getFileDownloadUrl(publicId: string): Promise<string> {
    if (!publicId) {
      throw new BadRequestException('Public ID is required');
    }

    return await this.cloudinaryService.getFileUrl(publicId);
  }

  async getFilesForTask(taskId: string): Promise<string[]> {
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }

    // Fetch the task from the database
    const task = await this.taskService.findOne(taskId);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    // Return the list of file URLs associated with the task
    return task.attachments || [];
  }
}
