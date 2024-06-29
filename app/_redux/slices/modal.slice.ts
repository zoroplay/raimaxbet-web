// modal.slice.js
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface InitialStateType {
  title: null | string;
  message: null | string;
  success: boolean;
  promptMessage: null | string;
  promptLink: null | string;
  isOpen: boolean;
  isOpenComponent: boolean;
  component: null | string;
  data: null | string;
  modalState: null | string;
  fixtureTab: string;
  searchHistory: string[];
  globalModalState: { [key in string]: boolean };
}

const initialState: InitialStateType = {
  title: null,
  message: null,
  success: false,
  promptMessage: null,
  promptLink: null,
  isOpen: false,
  isOpenComponent: false,
  component: null,
  data: null,
  modalState: null,
  fixtureTab: "HIGHLIGHTS",
  searchHistory: [],
  globalModalState: {
    betslip: false,
    placebet: false,
  },
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state: InitialStateType, action: PayloadAction<any>) => {
      const modalObj = action.payload;

      // Check if it's a message modal
      if (modalObj.title || modalObj.message) {
        state.title = modalObj.title || null;
        state.message = modalObj.message || null;
        state.success = modalObj.success || false;
        state.promptMessage = modalObj.promptMessage || null;
        state.promptLink = modalObj.promptLink || null;
        state.isOpen = true;
      }

      // Check if it's a component modal
      if (modalObj.component) {
        state.isOpenComponent = true;
        state.component = modalObj.component;
        state.data = modalObj.data || null;
      }

      // Check for global modal state
      if (modalObj.modalState) {
        const modal = modalObj.modalState;
        state.globalModalState[modal] = true;
      }
    },

    closeModal: (state: InitialStateType) => {
      let newState = { ...state };
      newState.title = null;
      newState.message = null;
      newState.success = false;
      newState.promptMessage = null;
      newState.promptLink = null;
      newState.isOpen = false;
      return newState;
    },
    closeComponentModal: (state) => {
      let newState = { ...state };
      newState.isOpenComponent = false;
      newState.component = null;
      newState.data = null;
      return newState;
    },
    modalStateFalse: (state, action: PayloadAction<any>) => {
      const modal = action.payload;
      state.globalModalState[modal] = false;
    },
    setFixtureTab: (state, action: PayloadAction<any>) => {
      const fixtureTab = action.payload;
      state.fixtureTab = fixtureTab;
    },
    updateHistory: (state, action: PayloadAction<any>) => {
      const searchTerm = action.payload;
      let searchTerms = [...state.searchHistory];
      const index = searchTerms.indexOf(searchTerm);
      if (index !== -1) {
        searchTerms.splice(index, 1);
      }
      searchTerms.unshift(searchTerm);
      if (searchTerms.length > 10) {
        searchTerms.pop();
      }
      if (searchTerm === "delete-all") searchTerms = [];
      state.searchHistory = searchTerms;
    },
  },
});

// Export the slice actions and reducer
export const {
  openModal,
  closeModal,
  closeComponentModal,
  modalStateFalse,
  setFixtureTab,
  updateHistory,
} = modalSlice.actions;
export default modalSlice.reducer;
