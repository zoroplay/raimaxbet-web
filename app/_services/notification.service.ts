import { openModal } from "@/_redux/slices/modal.slice";
import apiSlice from "./api/api";
import { SEND_OTP, VERIFY_OTP } from "./CONSTANTS";
import { updateUser } from "@/_redux/slices/user.slice";

const notificationApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Send users otp
    sendOtp: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${SEND_OTP}`,
        body: body,
        method: "POST",
      }),
    }),

    // Verify otp mutation
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${VERIFY_OTP}`,
        body: body,
        method: "POST",
      }),
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } =
  notificationApiSlice;
