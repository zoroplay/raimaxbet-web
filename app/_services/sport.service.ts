import apiSlice from "./api/api";
import {
  GET_SPORTS,
  SLIDERS,
  UPCOMING_FIXTURES,
  LIVE_FIXTURES,
  FIXTURE,
  TOP_TOURNAMENT,
  GLOBALVAR,
  BONUSLIST,
  GET_FIXTURE_BY_DATE,
  // GROUP_BY_SPORTS,
  TOP_BETS,
  FIXTURE_SINGLE,
  LIVE_COUNT,
  EVENT_SEARCH,
  FAVOURITE,
  GET_SPORT_CATEGORY,
  GET_TOURNAMENTS,
  GET_FIXTURES_BY_CATEGORY,
  // FIXTURES_BY_SPORT_DATE,
} from "./CONSTANTS";
import { updateUser } from "@/_redux/slices/user.slice";

const sportApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get sports
    getSports: builder.query({
      query: (param) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_SPORTS}?period=${param}&timeoffset=+1`,
        method: "GET",
      }),
    }),

    getSportCategories: builder.query({
      query: (param) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_SPORT_CATEGORY}/${param}?period=all&timeoffset=+1`,
        method: "GET",
      }),
    }),

    getFixturesByCategory: builder.query({
      query: (param) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_FIXTURES_BY_CATEGORY}/${param}?period=all&timeoffset=+1`,
        method: "GET",
      }),
    }),

    getSportTournaments: builder.query({
      query: (param) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${GET_TOURNAMENTS}/${param}?period=all&timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Get slides
    getSlides: builder.query({
      query: () => ({
        url: SLIDERS,
        method: "GET",
      }),
    }),

    // Get upcoming fixtures
    getUpcoming: builder.query({
      query: ({ sid, type, page, userId, favourite }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${UPCOMING_FIXTURES}/${sid}?${type}=1&page=${page}&timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Get upcoming fixtures
    getFavourite: builder.query({
      query: ({ page = 1, userId, favourite }) => ({
        url: `${
          process.env.NEXT_PUBLIC_NEW_API
        }${UPCOMING_FIXTURES}/${1}?${"upcoming"}=1&page=${page}&timeoffset=+1&favourite=${favourite}&userId=${userId}`,
        method: "GET",
      }),
      providesTags: ["Favourite"],
    }),

    // Get single fixture
    getSingleFixture: builder.query({
      query: (param) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${FIXTURE_SINGLE}/${param}?timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Get global variable
    getGlobalVariable: builder.query({
      query: () => ({
        url: GLOBALVAR,
        method: "GET",
      }),
    }),

    // Get bonus list
    getBonusList: builder.query({
      query: () => ({
        url: BONUSLIST,
        method: "GET",
      }),
    }),

    // Get fixtues by date
    getBySportsDate: builder.query({
      query: ({ start, end, sid = 1, market = 1, limit = 10, page = 1 }) => ({
        url: `${GET_FIXTURE_BY_DATE}?date=${start}&end_date=${end}&sid=${sid}&market=${market}&channel=mobile&limit=${limit}&page=${page}&timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Group by sports
    // groupBySports: builder.query({
    // query: ({ start = "", end = "" }) => ({
    //   url: `${GROUP_BY_SPORTS}?date=${start}&end_date=${end}&timeoffset=+1`,
    //   method: "GET",
    // }),
    // }),

    // Get fixtures by tournament
    getFixturesByTournament: builder.query({
      query: ({ tid, sid }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${FIXTURE}/${tid}?sportID=${sid}&source=mobile&timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Get live fixtures
    getLiveFixtures: builder.query({
      query: ({ sid }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${LIVE_FIXTURES}/${sid}?source=mobile&markets=1`,
        method: "GET",
      }),
    }),

    getLiveCount: builder.query({
      query: ({ sid }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${LIVE_COUNT}/${sid}`,
        method: "GET",
      }),
    }),

    // Top tournaments
    getTopTournament: builder.query({
      query: () => ({
        url: TOP_BETS,
        method: "GET",
      }),
    }),

    // Search event
    searchEvent: builder.query({
      query: ({ search, page = 1 }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${UPCOMING_FIXTURES}/0?markets=1&upcoming=1&page=${page}&search=${search}&timeoffset=+1`,
        method: "GET",
      }),
    }),

    // Favourites
    favourite: builder.mutation({
      query: ({ userId, competitor1, competitor2, action = "add" }) => ({
        url: `${process.env.NEXT_PUBLIC_NEW_API}${FAVOURITE}`,
        method: "POST",
        body: {
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          userId,
          competitor1,
          competitor2,
          action,
        },
      }),
      invalidatesTags: ["Favourite"],
    }),
  }),
});

export const getLiveFixtures = (sportID: any) => {
  // Http.get(
  //   `https://sports.api.sportsbookengine.com/api/v2${LIVE_FIXTURES}/${sportID}?source=mobile&timeoffset=+1`
  // );
};

export const {
  useGetSportsQuery,
  useGetSportCategoriesQuery,
  useGetSportTournamentsQuery,
  useLazyGetFixturesByTournamentQuery,
  useGetFixturesByCategoryQuery,
  useGetSlidesQuery,
  useGetUpcomingQuery,
  useGetFavouriteQuery,
  useGetBySportsDateQuery,
  // useGroupBySportsQuery,
  useGetSingleFixtureQuery,
  useGetTopTournamentQuery,
  useGetFixturesByTournamentQuery,
  useGetBonusListQuery,
  useGetGlobalVariableQuery,
  useGetLiveFixturesQuery,
  useGetLiveCountQuery,
  useSearchEventQuery,
  useFavouriteMutation,
} = sportApiSlice;
