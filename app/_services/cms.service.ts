import { openModal } from "@/_redux/slices/modal.slice";
import apiSlice from "./api/api";
import { RESPONSIBLE, ABOUT_US, RULES, FAQ, TERMS, CONTACT } from "./CONSTANTS";
import { updateUser } from "@/_redux/slices/user.slice";

const cmsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Cms contents
    getAbout: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${ABOUT_US}`,
        method: "GET",
      }),
    }),
    getRules: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${RULES}`,
        method: "GET",
      }),
    }),
    getFaq: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${FAQ}`,
        method: "GET",
      }),
    }),
    getResponsibleGaming: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${RESPONSIBLE}`,
        method: "GET",
      }),
    }),
    terms: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${TERMS}`,
        method: "GET",
      }),
    }),
    getContact: builder.query({
      query: () => ({
        url: `${process.env.NEXT_PUBLIC_PROD_API}${CONTACT}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useTermsQuery,
  useGetAboutQuery,
  useGetContactQuery,
  useGetFaqQuery,
  useGetResponsibleGamingQuery,
  useGetRulesQuery,
} = cmsApiSlice;
