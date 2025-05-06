import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/config';

// Define types for API responses
interface ImagesResponse {
  images: Image[];
  totalImages: number;
  currentPage: number;
  totalPages: number;
}

// Create the API slice
export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_CONFIG.baseUrl,
    credentials: 'include', // Include cookies in requests
    prepareHeaders: (headers, { getState }) => {
      // Add default headers from API_CONFIG
      Object.entries(API_CONFIG.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return headers;
    },
  }),
  tagTypes: ['Image', 'PostImages'],
  endpoints: (builder) => ({
    // Get all images with optional pagination
    getImages: builder.query<ImagesResponse, { page?: number; limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        return {
          url: `/images?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.images.map(({ _id }) => ({ type: 'Image' as const, id: _id })),
              { type: 'Image', id: 'LIST' },
            ]
          : [{ type: 'Image', id: 'LIST' }],
    }),

    // Get an image by ID
    getImageById: builder.query<Image, string>({
      query: (id) => `/images/${id}`,
      providesTags: (result, error, id) => [{ type: 'Image', id }],
    }),

    // Upload an image
    uploadImage: builder.mutation<Image, FormData>({
      query: (formData) => ({
        url: '/images',
        method: 'POST',
        body: formData,
        // Don't set the Content-Type header as it will be set automatically with the boundary
        formData: true,
      }),
      invalidatesTags: [{ type: 'Image', id: 'LIST' }, { type: 'PostImages', id: 'LIST' }],
    }),

    // Delete an image
    deleteImage: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/images/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Image', id: 'LIST' }, { type: 'PostImages', id: 'LIST' }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetImagesQuery,
  useGetImageByIdQuery,
  useUploadImageMutation,
  useDeleteImageMutation,
} = imageApi;