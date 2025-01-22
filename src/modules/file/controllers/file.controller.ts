import {
  Controller,
  Get,
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

  @Post('summarize/tasks/:publicId')
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

  @Get('download/:publicId')
  async downloadFile(
    @Param('publicId') publicId: string,
  ): Promise<{ url: string }> {
    try {
      // Automatically prepend "tasks/" if not already included
      const fullPublicId = publicId.startsWith('tasks/')
        ? publicId
        : `tasks/${publicId}`;

      // Fetch the secure URL from Cloudinary
      const url = await this.fileService.getFileDownloadUrl(fullPublicId);

      // Return the URL for download
      return { url };
    } catch (error) {
      this.logger.error('Error fetching file for download', error.stack);
      throw new BadRequestException('Failed to fetch file for download');
    }
  }

  @Get('info/:publicId')
  async getFileInfo(
    @Param('publicId') publicId: string,
  ): Promise<{ url: string; publicId: string }> {
    try {
      const fullPublicId = `tasks/${publicId}`; // Add folder name here if required
      const url = await this.fileService.getFileDownloadUrl(fullPublicId);
      return { url, publicId: fullPublicId };
    } catch (error) {
      this.logger.error('Error fetching file info', error.stack);
      throw new BadRequestException('Failed to fetch file info');
    }
  }

  // New endpoint: Fetch file content for inline display (without download prompt)
  @Get('inline/:publicId')
  async getFileInline(@Param('publicId') publicId: string): Promise<string> {
    try {
      const url = await this.fileService.getFileDownloadUrl(publicId);
      this.logger.log(`Fetching file content for inline display: ${url}`);
      return url; // Return the file URL for inline display
    } catch (error) {
      this.logger.error('Error fetching inline file content', error.stack);
      throw new BadRequestException('Failed to fetch file content');
    }
  }

  @Get('task/:taskId/files')
  async getFilesForTask(
    @Param('taskId') taskId: string,
  ): Promise<{ files: string[] }> {
    try {
      const files = await this.fileService.getFilesForTask(taskId);
      return { files };
    } catch (error) {
      this.logger.error('Error fetching files for task', error.stack);
      throw new BadRequestException('Failed to fetch files for the task');
    }
  }
}
