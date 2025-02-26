import { baseApi } from "@/redux/api/baseApi";


export const withdrawApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        withdraw: builder.mutation({
            query: (withdrawData) => ({
                url: '/transactions/make-withdraw-transaction',
                method: 'POST',
                body: withdrawData,
            }),
            invalidatesTags: ['transactions'],
        }),
    })
})

export const { useWithdrawMutation } = withdrawApi;