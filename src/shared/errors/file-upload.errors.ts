// src/shared/errors/file-upload.errors.ts

import { BadRequestException } from '@nestjs/common';

/**
 * Custom error for file upload-related issues.
 */
export class FileUploadException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }

  static invalidFileType(allowedTypes: string[]) {
    return new FileUploadException(
      `Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`,
    );
  }

  static fileSizeExceeded(maxSizeMB: number) {
    return new FileUploadException(
      `File size exceeds the limit of ${maxSizeMB} MB`,
    );
  }
  static invalidFileName() {
    return new FileUploadException('Invalid file name');
  }
}
