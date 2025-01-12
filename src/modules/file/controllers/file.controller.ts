import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Query,
  BadRequestException,
  Param,
  Body,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../services/file.service';
// import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

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

  // // Delete file for a task
  // @Delete('delete/:publicId')
  // async deleteFile(
  //   @Param('publicId') publicId: string,
  //   @Query('taskId') taskId: string,
  // ): Promise<void> {
  //   if (!publicId || !taskId) {
  //     throw new BadRequestException('Public ID and Task ID are required');
  //   }

  //   // Delegate to FileService to delete the file and update the task
  //   return this.fileService.deleteFileForTask(publicId, taskId);
  // }

  @Post('summarize/:taskId')
  async summarizeTask(@Param('taskId') taskId: string, @Body() body: any) {
    const { propt } = body; // 'propt' will be used as the message content for summarization
    if (!propt) {
      throw new BadRequestException('Prompt is required.');
    }

    const summary = await this.fileService.summarizeTaskFile(taskId, propt);
    return summary;
  }
}
