import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from '@/config';

// Define types for API requests
interface CreatePostRequest {
  title: string;
  description: string;
  images: string[];
}

interface UpdatePostRequest {
  id: string;
  title?: string;
  description?: string;
  images?: string[];
}

interface PostsResponse {
  posts: Post[];
  totalPosts: number;
  currentPage: number;
  totalPages: number;
}

// Create the API slice
export const postApi = createApi({
  reducerPath: 'postApi',
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
  tagTypes: ['Post', 'UserPosts'],
  endpoints: (builder) => ({
    // Get all posts with optional search
    getPosts: builder.query<PostsResponse, { search?: string; page?: number; limit?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.search) queryParams.append('search', params.search);
        if (params.page) queryParams.append('page', params.page.toString());
        if (params.limit) queryParams.append('limit', params.limit.toString());
        
        return {
          url: `/posts?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result) => 
        result 
          ? [
              ...result.posts.map(({ _id }) => ({ type: 'Post' as const, id: _id })),
              { type: 'Post', id: 'LIST' },
            ]
          : [{ type: 'Post', id: 'LIST' }],
    }),

    // Get a post by ID
    getPostById: builder.query<Post, string>({
      query: (id) => `/posts/${id}`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Get posts by user ID
    getPostsByUserId: builder.query<Post[], string>({
      query: (userId) => `/posts?creator=${userId}`,
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ _id }) => ({ type: 'Post' as const, id: _id })),
              { type: 'UserPosts', id: 'LIST' },
            ]
          : [{ type: 'UserPosts', id: 'LIST' }],
    }),

    // Create a new post
    createPost: builder.mutation<Post, CreatePostRequest>({
      query: (postData) => ({
        url: '/posts',
        method: 'POST',
        body: postData,
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }, { type: 'UserPosts', id: 'LIST' }],
    }),

    // Update a post
    updatePost: builder.mutation<Post, UpdatePostRequest>({
      query: ({ id, ...patch }) => ({
        url: `/posts/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Post', id },
        { type: 'Post', id: 'LIST' },
        { type: 'UserPosts', id: 'LIST' },
      ],
    }),

    // Delete a post
    deletePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/posts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }, { type: 'UserPosts', id: 'LIST' }],
    }),

    // Like a post
    likePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/posts/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Save a post
    savePost: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/posts/${id}/save`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
    }),

    // Get post-interaction status
    getPostInteraction: builder.query<{ liked: boolean; saved: boolean }, string>({
      query: (id) => `/posts/${id}/interaction`,
      providesTags: (result, error, id) => [{ type: 'Post', id }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostByIdQuery,
  useGetPostsByUserIdQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useLikePostMutation,
  useSavePostMutation,
  useGetPostInteractionQuery,
} = postApi;