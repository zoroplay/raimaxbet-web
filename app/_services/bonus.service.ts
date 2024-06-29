import { setBonus } from "@/_redux/slices/user.slice";
import apiSlice from "./api/api";
import { AWARD_BONUS, CHECK_FIRST_DEPOSIT, GET_USER_BONUS } from "./CONSTANTS";

const bonusApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user bonus
    getUserBonus: builder.query({
      query: ({ userId }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_USER_BONUS}?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "GET",
      }),
      providesTags: ["Deposit"],
    }),
    // Get user bonus
    checkFirstDeposit: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${CHECK_FIRST_DEPOSIT}?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "GET",
      }),
    }),
    awardBonus: builder.mutation({
      query:(data) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${AWARD_BONUS}?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: 'POST',
        body: data,
      }),
      onQueryStarted: async (credentials, { dispatch, queryFulfilled }) => {
        try {

          dispatch(setBonus(null));
        } catch (error) {
          return;
        }
      },
    })
  }),
});

export const { 
  useGetUserBonusQuery,
  useCheckFirstDepositQuery,
  useAwardBonusMutation
} = bonusApiSlice;
