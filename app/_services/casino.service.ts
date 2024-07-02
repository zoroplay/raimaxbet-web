import apiSlice from "./api/api";
import {
  ALL_CATEGORIES_BY_PROVIDER,
  ALL_TOP_CATEGORIES,
  ALL_GAMES_BY_CATEGORY,
  GET_BY_TOP_CATEGORIES,
  GET_BY_TOP_CATEGORY,
} from "./CONSTANTS";

const casinoApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all categories by provider slug
    getAllCategoriesByProviderSlug: builder.query({
      query: () => ({
        url: ALL_CATEGORIES_BY_PROVIDER,
        method: "GET",
      }),
    }),

    // All casino games by categories
    getAllGamesByCategory: builder.query({
      query: (id) => ({
        url: `${ALL_GAMES_BY_CATEGORY}/${id}`,
        method: "GET",
      }),
    }),

    // All top casino games by categories
    getAllTopCategories: builder.query({
      query: () => ({
        url: ALL_TOP_CATEGORIES,
        method: "GET",
      }),
    }),

    // All games by top catigories
    getGamesByTopCategory: builder.query({
      query: (id) => ({
        url: `${GET_BY_TOP_CATEGORIES}/${id}`,
        method: "GET",
      }),
    }),

    // All games by top catigory
    getAllGames: builder.query({
      query: (page) => ({
        url: `${GET_BY_TOP_CATEGORY}?paginate=1&page=${page}`,
        method: "GET",
      }),
    }),

    // search by games
    getGamesBySearch: builder.query({
      query: (item) => ({
        url: `${GET_BY_TOP_CATEGORY}?search=${item}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetAllCategoriesByProviderSlugQuery,
  useGetAllGamesByCategoryQuery,
  useGetGamesByTopCategoryQuery,
  useGetAllGamesQuery,
  useGetAllTopCategoriesQuery,
  useGetGamesBySearchQuery,
} = casinoApiSlice;
