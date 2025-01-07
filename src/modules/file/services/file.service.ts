import { Injectable } from '@nestjs/common';
import * as cloudinary from 'cloudinary';
import { File } from '../../../database/schemas';

@Injectable()
export class FileService {
  constructor() {
    cloudinary.config({
      cloud_name: 'your-cloud-name',
      api_key: 'your-api-key',
      api_secret: 'your-api-secret',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<File> {
    const result = await cloudinary.v2.uploader.upload(file.path);
    // Store file metadata in the database
    const newFile = new File({
      url: result.secure_url,
      fileName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      createdAt: new Date(),
    });
    // Store file info in the database
    return newFile.save();
  }

  async downloadFile(id: string) {
    // Logic to download the file from Cloudinary or your server
    // Return the file URL
  }
}
