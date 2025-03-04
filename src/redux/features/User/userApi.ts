
import { baseApi } from "@/redux/api/baseApi";


const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getAllUser: builder.query({
        query: (params) => ({
          url: "/users",
          method: "GET",
          params, 
        }),
        providesTags: ["users"],
      }),  
        userCount: builder.query({
            query: () => ({
              url: "/users/count",
              method: "GET",
            }),
            providesTags: ["users"],
          }),
        getApprovalRequest: builder.query({
            query: () => ({
              url: "/users/approval-request",
              method: "GET",
            }),
            providesTags: ["approvalRequests"],
          }),

        getUserById: builder.query({
            query: (args) => ({
              url: `/users/${args.id}`,
              method: "GET",
              body: args.data
            }),
            providesTags: ["users"],
          }),
          updateUserStatus: builder.mutation({
            query: ({ userId, isBlocked }) => ({
              url: `/users/${userId}/status`,
              method: "PATCH",
              body: { isBlocked },
            }),
            invalidatesTags: ["users"],
          }),
          approveUser: builder.mutation({
            query: (userId) => ({
              url: `/users/${userId}/approve`,
              method: "PATCH",
            }),
            invalidatesTags: ["approvalRequests", "users"],
          }),
    })
})

export const {useGetAllUserQuery, useApproveUserMutation ,useUserCountQuery, useGetUserByIdQuery, useUpdateUserStatusMutation, useGetApprovalRequestQuery} = userApi;