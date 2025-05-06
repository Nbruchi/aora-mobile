import {API_CONFIG} from "@/config";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "@/store";

interface CreatePostInput {
    title: string;
    description: string;
    images: string[];
    video?: File | Blob | any; // Added video field
}

interface  UpdatePostInput {
    title?: string;
    description?: string;
    images?: string[];
}

interface PostInteraction {
    isLiked: boolean;
    likes: number;
    formattedLikes: string;
    isSaved: boolean;
    saves: number;
    formattedSaves: string;
}

const baseUrl = `${API_CONFIG.baseUrl}/posts`

const baseQuery = fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, {getState}) =>{
        const state = getState() as RootState;
        const token = (state.user as any)?.token;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

export const postAPI = createApi({
    reducerPath: "postAPI",
    baseQuery,
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        getPosts: builder.query<Post[],{search?: string}| void>({
            query: (params) =>{
                if(params && params.search){
                    return {url:"/", params: {search: params.search}};
                }
                return {url:"/"}
            },
            providesTags: ["Post"]
        }),
        getPostById: builder.query<Post, string>({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{type: 'Post', id}]
        }),
        getPostBySlug: builder.query<Post, string>({
            query: (slug) => `/slug/${slug}`,
            providesTags: (result, error, slug) => [{type: 'Post', id: slug}]
        }),
        createPost: builder.mutation<Post, CreatePostInput | FormData>({
            query: (body) =>({
                url:"/",
                method: "POST",
                body
            }),
            invalidatesTags: ["Post"]
        }),
        updatePost: builder.mutation<Post, {id: string, data: UpdatePostInput}>({
            query: ({id, data}) =>({
                url:`/${id}`,
                method: "PUT",
                body: data
            }),
            invalidatesTags: (result, error, {id}) => [{type: 'Post', id}]
        }),
        deletePost: builder.mutation<{message: string}, string>({
            query: (id) =>({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Post"]
        }),
        likePost: builder.mutation<{isLiked:boolean; likes: number; formattedLikes: string}, string>({
            query: (id) =>({
                url: `/${id}/like`,
                method: "POST"
            }),
            invalidatesTags: (result, error, id) => [{type: 'Post', id}]
        }),
        savePost: builder.mutation<{isSaved:boolean; saves: number; formattedSaves: string}, string>({
            query: (id) =>({
                url: `/${id}/save`,
            }),
            invalidatesTags: (result, error, id) => [{type: 'Post', id}]
        }),
        getPostInteraction: builder.query<PostInteraction, string[]>({
            query: (id) => `/${id}/interaction`,
            providesTags: (result, error, ids) => ids.map(id => ({ type: "Post", id }))
        }),
        getPostsByUserId: builder.query<Post[], string>({
            query: (userId) => `/user/${userId}`,
            providesTags: ["Post"]
        })
    })
})

export const {
    useGetPostsQuery,
    useGetPostByIdQuery,
    useGetPostInteractionQuery,
    useGetPostBySlugQuery,
    useGetPostsByUserIdQuery,
    useCreatePostMutation,
    useUpdatePostMutation,
    useDeletePostMutation,
    useLikePostMutation,
    useSavePostMutation
} = postAPI;
