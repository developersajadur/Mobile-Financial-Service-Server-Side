import { baseApi } from "@/redux/api/baseApi";


export const transferApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        transfer: builder.mutation({
            query: (transferData) => ({
                url: '/transactions/make-transfer-transaction',
                method: 'POST',
                body: transferData,
            }),
            invalidatesTags: ['transactions', "users"],
        }),
    })
})

export const { useTransferMutation } = transferApi;