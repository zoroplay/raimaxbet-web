import { fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import environmentConfig from "@/_configs/environment.config";
import { RootState } from "@/_types";
import { updateUser, logoutUser } from "@/_redux/slices/user.slice";
import type { BaseQueryResult } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { openModal, closeComponentModal } from "@/_redux/slices/modal.slice";

const baseQuery = fetchBaseQuery({
  baseUrl: environmentConfig.API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    const typedGetState = getState() as RootState;
    const token = typedGetState.user.token;
    console.log(`Token: ${token}`);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const customBaseQuery: BaseQueryFn = async (
  args: Parameters<typeof baseQuery>[0],
  api: any,
  extraOptions: {}
): Promise<BaseQueryResult<any | unknown | {}> | undefined> => {
  let result = await baseQuery(args, api, extraOptions);
  // console.log(result, "*res");

  if (result.error && result.error.status === 401) {
    // const refreshToken = api.getState().user.refreshToken;
    // const refreshResult: any = await baseQuery(
    //   { url: "user/refresh_token", method: "POST", body: { refreshToken } },
    //   api,
    //   extraOptions
    // );
    // console.log(refreshResult.error, "cusError");
    // if (refreshResult.data) {
    //   api.dispatch(updateUser({ token: refreshResult.data.accessToken }));
    //   result = await baseQuery(args, api, extraOptions);
    // } else if (refreshResult.error.status) {
    //   api.dispatch(logoutUser());
    //   api.dispatch(closeComponentModal());
    //   api.dispatch(
    //     openModal({
    //       title: "Refresh Token Expired",
    //       message: "Please login again to continue",
    //       success: false,
    //     })
    //   );
    // } else {
    api.dispatch(logoutUser());
    api.dispatch(closeComponentModal());
    // api.dispatch(
    //   openModal({
    //     title: "Token Expired",
    //     message: "Please login again to continue",
    //     success: false,
    //     promptLink: "/",
    //   })
    // );
    api.dispatch(openModal({ component: "LoginModal" }));
  }

  return result;
};

export default customBaseQuery;
