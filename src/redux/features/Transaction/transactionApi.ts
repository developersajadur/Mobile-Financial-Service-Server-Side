import { baseApi } from "@/redux/api/baseApi";

const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    transactionsCount: builder.query({
      query: () => ({
        url: "/transactions/count",
        method: "GET",
      }),
      providesTags: ["transactions"], // Moved inside the query definition
    }),
    getMyTransactions: builder.query({
      query: () => ({
        url: "/transactions/my-transactions",
        method: "GET",
      }),
      providesTags: ["transactions"], // Corrected placement
    }),
    getAllTransactions: builder.query({
      query: () => ({
        url: "/transactions",
        method: "GET",
      }),
      providesTags: ["transactions"], // Corrected placement
    }),
    getTransactionsDetailsById: builder.query({
      query: ({userId}) => ({
        url: `/transactions/users/${userId}`,
        method: "GET",
        params: { userId },
      }),
      providesTags: ["transactions"],
    }),
  }),
});

export const { useTransactionsCountQuery, useGetMyTransactionsQuery, useGetAllTransactionsQuery, useGetTransactionsDetailsByIdQuery } = transactionApi;
