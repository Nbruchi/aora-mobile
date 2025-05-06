import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { User } from './userSlice';
import { API_CONFIG } from '@/config';

// Define types for API requests
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Create the API slice
export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: API_CONFIG.baseUrl,
    credentials: 'include', // Include cookies in requests
    prepareHeaders: (headers, { getState }) => {
      // Add default headers from API_CONFIG
      Object.entries(API_CONFIG.headers).forEach(([key, value]) => {
        headers.set(key, value);
      });

      // You can add auth token here if needed
      return headers;
    },
  }),
  // Add error handling for network errors
  keepUnusedDataFor: 5, // Keep data in cache for 5 seconds
  refetchOnMountOrArgChange: true, // Refetch data when component mounts or arguments change
  refetchOnFocus: true, // Refetch data when window regains focus
  refetchOnReconnect: true, // Refetch data when network reconnects
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Login endpoint
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: '/users/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // Register endpoint
    register: builder.mutation<User, RegisterRequest>({
      query: (userData) => ({
        url: '/users/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    // Logout endpoint
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // Get user profile
    getUserProfile: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: ['User'],
    }),

    // Update user profile
    updateUserProfile: builder.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} = userApi;