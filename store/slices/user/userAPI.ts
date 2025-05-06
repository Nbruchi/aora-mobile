import {API_CONFIG} from "@/config";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {RootState} from "@/store";

type RegisterInput = {
    username: string;
    email: string;
    password: string;
};

type LoginInput = {
    email: string;
    password: string;
};

type UpdateUserInput = Partial<Omit<User, "_id">>;

const baseUrl = API_CONFIG.baseUrl;

export const userAPI = createApi({
    reducerPath: "userAPI",
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers, {getState}) =>{
            const state = getState() as RootState;
            const token = (state.user as any)?.token;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        register: builder.mutation<User, RegisterInput>({
            query: (body) =>({
                url:"/users/register",
                method: "POST",
                body
            })
        }),
        login: builder.mutation<User, LoginInput>({
            query: (body) =>({
                url:"/users/login",
                method:"POST",
                body
            })
        }),
        logout: builder.mutation<{message: string}, void>({
            query: () =>({
                url:"/users/logout",
                method:"POST"
            })
        }),
        getUsers: builder.query<User[], string | void>({
            query: (search) =>({
                url:"/users",
                method:"GET",
                params: search ? {search}: undefined
            })
        }),
        getUser: builder.query<User, string>({
            query: (id) =>({
                url: `/users/${id}`,
                method:"GET"
            })
        }),
        updateUser: builder.mutation<User, {id: string, data: UpdateUserInput}>({
            query: ({id, data}) =>({
                url:`/users/${id}`,
                method: "PUT",
                body: data
            })
        }),
        deleteUser: builder.mutation<{message: string}, string>({
            query: (id) =>({
                url: `/users/ ${id}`,
                method:"DELETE"
            })
        })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useLogoutMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useGetUserQuery,
    useGetUsersQuery,
} = userAPI;