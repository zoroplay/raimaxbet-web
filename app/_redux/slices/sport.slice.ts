import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialSateSportType {
  SportsbookGlobalVariable: null | any;
  sports: any;
}

const initialState: InitialSateSportType = {
  SportsbookGlobalVariable: null,
  sports: []
};

const sportSlice = createSlice({
  name: "sport",
  initialState,
  reducers: {
    updateSportsbookGlobalVariable(state, action: PayloadAction<any>) {
      const data = action.payload;
      const newState = { ...state };
      newState.SportsbookGlobalVariable = data;
      return newState;
    },
    updateSports(state, action: PayloadAction<any>) {
      const newState = { ...state };
      newState.sports = action.payload;
      return newState;
    }
  },
});

export const { updateSportsbookGlobalVariable, updateSports } =
  sportSlice.actions;
export default sportSlice.reducer;
