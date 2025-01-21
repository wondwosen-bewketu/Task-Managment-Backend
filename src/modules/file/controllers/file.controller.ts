import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Param,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';

@Controller('files')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(private readonly fileService: FileService) {}

  // Upload file for a task
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('taskId') taskId: string,
  ): Promise<{ url: string; publicId: string }> {
    if (!taskId) {
      throw new BadRequestException('Task ID is required');
    }

    // Delegate to FileService to upload and associate file with the task
    return this.fileService.uploadFileForTask(file, taskId);
  }

  @Post('summarize/tasks/:publicId') // Add 'tasks' here
  async summarizeFile(
    @Param('publicId') publicId: string,
  ): Promise<{ summary: string }> {
    try {
      const fullPublicId = `tasks/${publicId}`;
      this.logger.log(
        `Request to summarize file with publicId: ${fullPublicId}`,
      );
      const summary = await this.fileService.summarizePdf(fullPublicId);
      return { summary };
    } catch (error) {
      this.logger.error('Error summarizing file', error.stack);
      throw new Error('Failed to summarize file');
    }
  }

  @Post('download/:publicId')
  async downloadFile(
    @Param('publicId') publicId: string,
  ): Promise<{ url: string }> {
    const url = await this.fileService.getFileDownloadUrl(publicId);
    return { url }; // Return the download URL for the file
  }
}
