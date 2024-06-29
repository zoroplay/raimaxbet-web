import apiSlice from "./api/api";
import {
  ALL_BANKS,
  GET_BANK_ACCOUNT,
  VERIFY_ACCOUNT,
  WITHDRAW,
} from "./CONSTANTS";

const withdrawApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all banks
    getAllBanks: builder.query({
      query: () => ({
        url: ALL_BANKS,
        method: "GET",
      }),
    }),

    // Get bank account
    getAccounts: builder.query({
      query: (clientId: number) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_BANK_ACCOUNT}?clientId=${clientId}&client=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "GET",
      }),
      providesTags: ["Withdrawal"],
    }),

    // Withdraw
    withdraw: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${WITHDRAW}?source=mobile`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["User", "Withdrawal"],
    }),

    // Verify Account
    verifyAccount: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${VERIFY_ACCOUNT}?source=mobile`,
        method: "POST",
        body: body,
      }),
    }),
  }),
});

export const {
  useGetAllBanksQuery,
  useGetAccountsQuery,
  useWithdrawMutation,
  useVerifyAccountMutation,
} = withdrawApiSlice;
