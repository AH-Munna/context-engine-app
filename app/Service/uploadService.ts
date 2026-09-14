import {Platform} from 'react-native';
import api, {formatApiError} from './api';

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024; // 5 MB
export const MAX_IMAGE_UPLOAD_MB = 5;

/**
 * Uploads an image or document from the device to the backend /uploads/ endpoint.
 *
 * @param fileUri Local file URI from camera or image library
 * @param fileName Optional custom file name
 * @param fileType MIME type (default 'image/jpeg')
 * @returns Public URL of uploaded asset
 */
export async function uploadFile(
  fileUri: string,
  fileName?: string,
  fileType?: string,
): Promise<string> {
  try {
    const formData = new FormData();
    const cleanUri =
      Platform.OS === 'ios' ? fileUri.replace('file://', '') : fileUri;
    const name = fileName || `upload_${Date.now()}.jpg`;
    const type = fileType || 'image/jpeg';

    formData.append('file', {
      uri: cleanUri,
      name,
      type,
    } as any);

    const response = await api.post('/uploads/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: data => data,
    });

    if (response.data?.url) {
      return response.data.url;
    }

    throw new Error('Upload succeeded but no asset URL was returned');
  } catch (err: any) {
    throw new Error(formatApiError(err));
  }
}

export default {
  uploadFile,
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_MB,
};
