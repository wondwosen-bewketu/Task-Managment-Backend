// src/shared/helpers/file-upload.helpers.ts

import { FileUploadException } from '../errors';
import { FILE_UPLOAD_CONSTANTS } from '../constants';

/**
 * Validate the file type against the allowed MIME types.
 */
export function validateFileType(mimeType: string): void {
  const allowedMimeTypes = FILE_UPLOAD_CONSTANTS.ALLOWED_FILE_TYPES;

  if (!allowedMimeTypes.includes(mimeType)) {
    throw FileUploadException.invalidFileType(allowedMimeTypes);
  }
}

/**
 * Validate the file size against the maximum allowed size.
 */
export function validateFileSize(size: number): void {
  const maxSize = FILE_UPLOAD_CONSTANTS.MAX_FILE_SIZE;

  if (size > maxSize) {
    throw FileUploadException.fileSizeExceeded(maxSize / 1024 / 1024); // Convert bytes to MB
  }
}

/**
 * Get the file extension from the filename.
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  if (parts.length < 2) {
    throw FileUploadException.invalidFileName();
  }
  return parts.pop()!;
}
