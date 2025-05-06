import { useState, useEffect } from 'react';
import { API_CONFIG } from '@/config';

/**
 * Custom hook to get the URL for an image
 * @param imageId - The image ID or Image object
 * @returns The URL of the image
 */
export const useImageUrl = (imageId: string | Image | undefined): string => {
  const [imageUrl, setImageUrl] = useState<string>('https://via.placeholder.com/300');

  useEffect(() => {
    if (!imageId) {
      setImageUrl('https://via.placeholder.com/300');
      return;
    }

    // If imageId is a string (ID), construct the URL to fetch the image by ID
    if (typeof imageId === 'string') {
      setImageUrl(`${API_CONFIG.baseUrl}/images/${imageId}`);
    } else {
      // Otherwise, it's an Image object
      setImageUrl(`${API_CONFIG.baseUrl}/images/${imageId._id}`);
    }
  }, [imageId]);

  return imageUrl;
};