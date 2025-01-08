import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
} from '../constants/file-upload.constants';

export const validateFileType = (mimeType: string): boolean => {
  return ALLOWED_FILE_TYPES.includes(mimeType);
};

export const validateFileSize = (size: number): boolean => {
  const maxSizeInBytes = MAX_FILE_SIZE_MB * 1024 * 1024;
  return size <= maxSizeInBytes;
};

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop() || '';
};
