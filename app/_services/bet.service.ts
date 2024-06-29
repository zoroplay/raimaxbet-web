import apiSlice from "./api/api";
import {
  PLACE_BET,
  BOOK_BET,
  BET_LIST,
  FIND_WITH_BOOKING_CODE,
  FIND_WITH_BETSLIP,
  OPENED_BET,
  SETTLED_BET,
  REBET,
} from "./CONSTANTS";

const betApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // book a bet
    bookBet: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${BOOK_BET}/${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        body: body,
        method: "POST",
      }),
    }),

    // Rebet endpoint
    reBet: builder.query({
      query: (betslip_id) => ({
        url: `${REBET}/${betslip_id}?action=rebet`,
        method: "GET",
      }),
    }),

    // place a bet
    placeBet: builder.mutation({
      query: ({data, param=0}) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${PLACE_BET}/${process.env.NEXT_PUBLIC_CLIENT_ID}`,
        method: "POST",
        body: {...data, isBooking: param},
      }),
      invalidatesTags: ["User", "Bet"],
    }),

    // Bet list
    betList: builder.mutation({
      query: (body) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${BET_LIST}?page=${body.page ? body.page : 1}`,
        method: "POST",
        body,
      }),
    }),

    // Get coupons with code
    findWithCode: builder.query({
      query: (code) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${FIND_WITH_BOOKING_CODE}/${process.env.NEXT_PUBLIC_CLIENT_ID}?code=${code}`,
        method: "GET",
      }),
    }),
    // Get coupons with bet slip id
    findWithBetslip: builder.mutation({
      query: (code) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${FIND_WITH_BETSLIP}?code=${code}`,
        method: "POST",
        body: {
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          betslipId: code
        }
      }),
    }),

    // Get open bets
    getOpenBets: builder.query({
      query: () => ({
        url: `${OPENED_BET}`,
        method: "GET",
      }),
      providesTags: ["Bet"],
    }),

    // Get settled bets
    getSettledBets: builder.mutation({
      query: (body) => ({
        url: `${SETTLED_BET}?page=${body.page ? body.page : 1}`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useBetListMutation,
  useBookBetMutation,
  usePlaceBetMutation,
  useFindWithBetslipMutation,
  useFindWithCodeQuery,
  useGetOpenBetsQuery,
  useGetSettledBetsMutation,
  useReBetQuery,

} = betApiSlice;
