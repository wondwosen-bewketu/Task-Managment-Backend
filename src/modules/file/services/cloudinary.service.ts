import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { FileUploadException } from '../../../shared/errors';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // Modify the uploadFile method to accept a folder argument
  async uploadFile(
    file: Express.Multer.File,
    folder: string, // Add folder parameter
  ): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: 'auto', folder }, // Use the folder here
          (error, result) => {
            if (error) {
              reject(
                new FileUploadException('Failed to upload file to Cloudinary'),
              );
            } else {
              resolve({ url: result.secure_url, publicId: result.public_id });
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      throw new FileUploadException('Failed to delete file from Cloudinary');
    }
  }
}
