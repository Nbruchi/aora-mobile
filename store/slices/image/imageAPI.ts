import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {API_CONFIG} from "@/config";
import {RootState} from "@/store";

const baseQuery = fetchBaseQuery({
    baseUrl: `${API_CONFIG.baseUrl}/images`,
    prepareHeaders: (headers, {getState}) =>{
        const state = getState() as RootState;
        const token = (state.user as any)?.token;

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

export const imageAPI = createApi({
    reducerPath: "imageAPI",
    baseQuery,
    tagTypes: ['Image'],
    endpoints: (builder) =>({
        uploadImage: builder.mutation<Image, FormData>({
            query: (formData) =>({
                url:"/",
                method: "POST",
                body: formData
            }),
            invalidatesTags: ["Image"]
        }),
        getImages: builder.query<Image[], void>({
          query: () => "/",
          providesTags: ["Image"]
        }),
        getImageById: builder.query<Blob, string>({
            query: (id) =>({
                url: `/${id}`,
                responseHandler: (response) => response.blob()
            })
        }),
        deleteImage: builder.mutation<{message: string}, string>({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["Image"]
        }),
        getImagesByUserId: builder.query<Image[], string>({
            query: (userId) => `/user/${userId}`,
            providesTags: ["Image"]
        })
    })
})

export const {
    useUploadImageMutation,
    useGetImageByIdQuery,
    useGetImagesQuery,
    useGetImagesByUserIdQuery,
    useDeleteImageMutation
} = imageAPI;