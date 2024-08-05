import { openModal } from "@/_redux/slices/modal.slice";
import apiSlice from "./api/api";
import { SEND_OTP, USER_NOTIFICATIONS, VERIFY_OTP } from "./CONSTANTS";
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
    userNotifications: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${USER_NOTIFICATIONS}`,
        method: "GET",
      }),
    }),
    setNotifications: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${USER_NOTIFICATIONS}/${body.id}`,
        method: "PUT",
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useUserNotificationsMutation,
  useSetNotificationsMutation,
} = notificationApiSlice;
