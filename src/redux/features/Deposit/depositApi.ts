import { baseApi } from "@/redux/api/baseApi";


const depositApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        deposit: builder.mutation({
            query: (depositData) => ({
                url: '/transactions/make-deposit-transaction',
                method: 'POST',
                body: depositData,
            }),
            invalidatesTags: ['transactions'],
        }),
    })
})

export const { useDepositMutation } = depositApi;