import apiSlice from "./api/api";
import {
  GET_ALL_PAYMENT,
  INITIATE_DEPOSIT,
  INITIATE_TRANSFER,
  VERIFY_PAYMENT,
} from "./CONSTANTS";

const deopositApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all payment providers
    getAllPayment: builder.query({
      query: () => ({
        url: GET_ALL_PAYMENT,
        method: "GET",
      }),
      providesTags: ["Deposit"],
    }),

    // Initiate deposit
    initiateDeposit: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${INITIATE_DEPOSIT}`,
        method: "POST",
        body: body,
      }),
    }),
    // Initiate deposit
    initiateTransfer: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${INITIATE_TRANSFER}/${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "PUT",
        body: body,
      }),
    }),

    // Verify payment
    verifyPayment: builder.query({
      query: ({ paymentChannel, ref }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${VERIFY_PAYMENT}?clientId=${process.env.NEXT_PUBLIC_CLIENT_ID}&paymentChannel=${paymentChannel}&transactionRef=${ref}`,
        method: "GET",
      }),
      providesTags: ["Deposit"],
    }),
  }),
});

export const {
  useGetAllPaymentQuery,
  useInitiateDepositMutation,
  useVerifyPaymentQuery,
  useInitiateTransferMutation,
} = deopositApiSlice;
