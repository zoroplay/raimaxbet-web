import { openModal } from "@/_redux/slices/modal.slice";
import apiSlice from "./api/api";
import {
  LOGIN,
  REGISTER,
  UPDATE_USER,
  GET_USER,
  TRANSACTIONS,
  VERIFY_USER,
  CHANGE_PASSWORD,
  RESET_PASSWORD,
} from "./CONSTANTS";
import { updateUser } from "@/_redux/slices/user.slice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Register users
    register: builder.mutation({
      query: (userData) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${REGISTER}`,
        body: userData,
        method: "POST",
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const {token} = data.data;
          const {data: user} = data
          
          dispatch(
            updateUser({
              token,
              user,
            })
          );
        } catch (error) {
          return;
        }
      },
      transformResponse: (response) => {
        console.log(response, "rtk");
        return response;
      },
    }),

    // Login user
    login: builder.mutation({
      query: (userData) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${LOGIN}`,
        body: userData,
        method: "POST",
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const {token} = data.data;
          const {data: user} = data
          
          // delete user.token;
          // console.log(data, 'login');

          dispatch(
            updateUser({
              token,
              user,
            })
          );
        } catch (error) {
          return;
        }
      },
      transformResponse: (response) => {
        // console.log(response, "rtk");
        return response;
      },
      invalidatesTags: ["User", "Deposit"],
    }),

    // Change password
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${CHANGE_PASSWORD}`,
        body: data,
        method: "PUT",
      }),
    }),

    // Change password
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${RESET_PASSWORD}`,
        body: data,
        method: "PATCH",
      }),
    }),

    // Verify user mutation
    verifyUser: builder.mutation({
      query: (user) => ({
        url:`${process.env.NEXT_PUBLIC_NEW_API}${VERIFY_USER}`,
        body: user,
        method: "POST",
      }),
    }),

    // update user
    updateUserProfile: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${UPDATE_USER}`,
        body,
        method: "PUT",
      }),
      invalidatesTags: ["User"],
    }),

    // Transctions
    transactions: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${TRANSACTIONS}`,
        body,
        method: "POST",
      }),
    }),

    // get user details
    getUserDetails: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_USER}/${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetUserDetailsQuery,
  useLoginMutation,
  useRegisterMutation,
  useUpdateUserProfileMutation,
  useTransactionsMutation,
  useVerifyUserMutation,
  useChangePasswordMutation,
  useResetPasswordMutation,
} = authApiSlice;
