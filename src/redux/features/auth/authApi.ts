
import { baseApi } from "@/redux/api/baseApi";


const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: '/auth/login',
                method: 'POST',
                body: userInfo
            })
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: '/users/register',
                method: 'POST',
                body: userInfo
            })
        }),
        logOut: builder.mutation({
            query: (number) => ({
              url: `/auth/logout`,
              method: "POST",
              body: { phoneNumber: number },
            }),
          }),
          getUserFingerprint: builder.query({
            query: () => ({
                url: `/auth/get-fingerprint`,
                method: "GET",
              }),
            }),
          getDeviceFingerprintForMatching: builder.query({
            query: () => ({
                url: `/auth/get-fingerprint-for-matching`,
                method: "GET",
              }),
            }),
          })
          
    })

export const {useLoginMutation, useRegisterMutation, useLogOutMutation, useGetUserFingerprintQuery, useGetDeviceFingerprintForMatchingQuery} = authApi;