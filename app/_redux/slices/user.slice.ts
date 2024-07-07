import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: null | any;
  token: null | string;
  activeBonus: null;
  isFirstLogin: boolean;
  // refreshToken: null | string;
}

const initialState: UserState = {
  user: null,
  token: null,
  activeBonus: null,
  isFirstLogin: false,
  // refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    openIsFirstLogin(state: UserState) {
      state.isFirstLogin = true;
    },
    closeIsFirstLogin(state: UserState) {
      state.isFirstLogin = false;
    },
    updateUser(state: UserState, action: PayloadAction<any>) {
      const userObj = action.payload;
      const newState = { ...state };
      Object.assign(newState, userObj);
      return newState;
    },
    logoutUser(state: UserState) {
      const newState = { ...state };
      newState.user = null;
      newState.token = null;
      // newState.refreshToken = null;
      return newState;
    },
    setBonus(state: UserState, action: PayloadAction<any>) {
      const newState = { ...state };
      newState.activeBonus = action.payload;
      return newState;
    },
  },
});

export const {
  updateUser,
  logoutUser,
  setBonus,
  closeIsFirstLogin,
  openIsFirstLogin,
} = userSlice.actions;
export default userSlice.reducer;
