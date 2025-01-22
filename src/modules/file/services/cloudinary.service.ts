import { Injectable, Logger } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileUploadException } from '../../../shared/errors';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // Modify the uploadFile method to accept a folder and options argument
  async uploadFile(
    file: Express.Multer.File,
    folder: string, // Add folder parameter
    options?: { access_mode?: string }, // Optional options for access control
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: 'auto',
        folder,
        ...options, // Spread the options to include any passed options like access_mode
      };

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            reject(
              new FileUploadException('Failed to upload file to Cloudinary'),
            );
          } else {
            resolve({ url: result.secure_url, publicId: result.public_id });
          }
        })
        .end(file.buffer);
    });
  }

  async getFileUrl(publicId: string): Promise<string> {
    try {
      const result = await cloudinary.api.resource(publicId);
      if (!result || result.error) {
        this.logger.error(`Cloudinary resource not found: ${publicId}`);
        throw new Error(
          result.error?.message || `Resource not found - ${publicId}`,
        );
      }
      return result.secure_url;
    } catch (error) {
      this.logger.error(
        `Error fetching file from Cloudinary for publicId "${publicId}": ${error.message}`,
      );
      throw new Error(
        `Failed to retrieve file from Cloudinary: ${error.message}`,
      );
    }
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new FileUploadException('Failed to delete file from Cloudinary');
    }
  }
}
