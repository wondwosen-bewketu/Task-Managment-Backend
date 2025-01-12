import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { TaskService } from '../../tasks/services';
import axios, { AxiosError } from 'axios';

@Injectable()
export class FileService {
  private readonly logger = new Logger(FileService.name);
  private readonly chatPdfApiKey = 'AIzaSyDZ3NC4Y0yB8ypVY0AuzWMrdAh4C9BKu9Q'; // Your new API key here
  private readonly chatPdfApiUrl = 'https://api.chatpdf.com/v1/sources/add-url';
  private readonly chatPdfMessageUrl =
    'https://api.chatpdf.com/v1/chats/message';

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

    const uploadedFile = await this.cloudinaryService.uploadFile(file, 'tasks');

    const task = await this.taskService.findOne(taskId);
    if (!task) {
      throw new BadRequestException('Task not found');
    }

    task.attachments.push(uploadedFile.url);
    await this.taskService.update(taskId, { attachments: task.attachments });

    return uploadedFile;
  }

  // Summarize the task file by interacting with ChatPDF API
  async summarizeTaskFile(taskId: string, propt: string): Promise<any> {
    try {
      const task = await this.taskService.findOne(taskId);
      if (!task)
        throw new BadRequestException(`Task with ID ${taskId} not found.`);
      if (!task.attachments || task.attachments.length === 0) {
        throw new BadRequestException('No attachments found for this task.');
      }

      const firstAttachment = task.attachments[0];
      if (!firstAttachment || !firstAttachment.startsWith('http')) {
        throw new BadRequestException('Invalid file URL in attachments.');
      }

      const requestBody = { url: encodeURI(firstAttachment) };
      this.logger.log(
        `Request body for ChatPDF: ${JSON.stringify(requestBody)}`,
      );

      // Add the source file to ChatPDF
      const addSourceResponse = await axios.post(
        'https://api.chatpdf.com/v1/sources/add-url',
        requestBody,
        {
          headers: {
            'x-api-key': this.chatPdfApiKey, // Using the new API key
            'Content-Type': 'application/json',
          },
        },
      );

      const sourceId = addSourceResponse.data.sourceId;
      const summaryRequestBody = {
        sourceId,
        messages: [
          { role: 'user', content: propt }, // Using 'propt' as message content
        ],
      };

      // Request for summarization
      const summarizeResponse = await axios.post(
        this.chatPdfMessageUrl,
        summaryRequestBody,
        {
          headers: {
            'x-api-key': this.chatPdfApiKey, // Using the new API key
            'Content-Type': 'application/json',
          },
        },
      );

      this.logger.log('Summary retrieved successfully.');
      return summarizeResponse.data;
    } catch (error) {
      this.logger.error(
        `Error during summarization: ${error.message}`,
        error.response?.data || error.toString(),
      );
      if (error instanceof AxiosError) {
        throw new Error(
          `Failed to summarize the file. Status: ${
            error.response?.status || 'Unknown'
          }, Message: ${error.response?.data?.message || error.message}`,
        );
      }
      throw new Error(
        'An unexpected error occurred while summarizing the file.',
      );
    }
  }
}
