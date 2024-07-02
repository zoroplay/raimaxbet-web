// import enviroment from "configs/enviroment.config";
// import { REHYDRATE } from "redux-persist";
import axios from "axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import customBaseQuery from "../custom-query/customQuery";
// import { SkipToken } from "@reduxjs/toolkit/dist/query";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  tagTypes: ["User", "Deposit", "Bet", "Withdrawal", "Favourite"],
  endpoints: (builder) => ({}),
  // refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 50000,
});

export const Http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_NEW_API,
  timeout: 45000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log('Axios Error: ', error)

    return Promise.reject(error);
  }
);

export default apiSlice;
