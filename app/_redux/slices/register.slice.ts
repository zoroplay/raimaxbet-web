import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RegisterState {
  username: null | string;
  password: null | string;
  phone: null | string;
  promoCode: null | string; 
  trackingToken: null | string; 
}

const initialState: RegisterState = {
  username: null,
  password: null,
  phone: null,
  promoCode: null,
  trackingToken: null
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterDetails(state: RegisterState, action: PayloadAction<any>) {
      const registerObj = action.payload;
      const newState = { ...state };
      Object.assign(newState, registerObj);
      return newState;
    },
    setTrackingToken(state: RegisterState, action: PayloadAction<any>) {
      const newState = { ...state};
      newState.trackingToken = action.payload;
      return newState;
    }
  },
});

export const { setRegisterDetails, setTrackingToken } = registerSlice.actions;
export default registerSlice.reducer;
