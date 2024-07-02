import { createSlice, original, PayloadAction } from "@reduxjs/toolkit";
import { tournamentsId } from "@/static/tournamentsIds";

interface UserState {
  fixtureTabs: { [key in string]: string | any[] }[]; //This list is used to track current tab, and display UI based on user interaction
  fixtures: any[]; //List of fixtures for tournament checkbox selections
  // favourites: any[];
  sport: { [key in string]: any }; //saves the current Sport with all it tournament(when all leagues for a sport is selected)
  currentFixtureTab: { [key in string]: string | any[] }; //This is the first item on the fixtureTabs list, which is the current tab
  currentTournament: { [key in string]: boolean }; //it holds the id of all tournaments, assigned to a boolean, used to manupilate check state of checkbox
}

const initialState: UserState = {
  fixtureTabs: [
    {
      name: "today",
    },
  ],
  fixtures: [],
  // favourites: [],
  currentFixtureTab: {
    name: "today",
  },
  currentTournament: tournamentsId,
  sport: {},
};

const fixtureSlice = createSlice({
  name: "fixtures",
  initialState,
  reducers: {
    updateFixtures: (state, action: PayloadAction<any>) => {
      const currentFixtureTab = action.payload;
      let allFixtureTabs = [...state.fixtureTabs];

      // Tab name is used to select UI to display
      // If tab name already exist in fixtureTabs replace it with the current selected
      if (currentFixtureTab.name === state.currentFixtureTab.name) {
        allFixtureTabs[0] = currentFixtureTab;
      } else {
        currentFixtureTab !== "return" &&
          allFixtureTabs.unshift(currentFixtureTab);
      }

      // Make the previous selected tab the current tab
      if (currentFixtureTab === "return") {
        allFixtureTabs = allFixtureTabs.reverse();
      }

      // List does not exceed two items
      if (allFixtureTabs.length > 2) {
        allFixtureTabs.pop();
      }

      state.currentFixtureTab = allFixtureTabs[0];
      state.fixtureTabs = allFixtureTabs;
    },

    addToFixtures: (state, action: PayloadAction<any>) => {
      const data = action.payload;
      const fixtureList = [...state.fixtures];

      let isAdd = true;
      if (data?.fixtures) {
        fixtureList.map((item) => {
          if (item.fixtures[0].tournamentID === data.fixtures[0].tournamentID) {
            isAdd = false;
          }
        });
        isAdd && fixtureList.unshift(data);
      }

      state.fixtures = fixtureList;
    },

    removeFromFixtures: (state, action: PayloadAction<any>) => {
      const tournamentID = action.payload;
      const fixtureList = [...state.fixtures];

      const newList = fixtureList.filter((item) => {
        return tournamentID !== item.fixtures[0].tournamentID;
      });

      state.fixtures = newList;
    },

    updateCurrentTournaments: (state, action: PayloadAction<any>) => {
      const { data, id } = action.payload;
      const current = { ...state.currentTournament };
      const currentSport = { ...state.sport };

      if (data) {
        state.sport = Object.assign(currentSport, data);
      }
      if (id) {
        state.currentTournament = { ...current, [id]: !current[id] };
      }
    },
    // updateFavourites: (state, action: PayloadAction<any>) => {
    //   const { fixture } = action.payload;
    //   const currentFixtures = [...state.fixtures];
    //   const isAdded = currentFixtures.find(
    //     (item) => item?.matchID === fixture?.matchID
    //   );

    //   if (isAdded) {
    //     currentFixtures.filter((item) => item?.matchID !== fixture?.matchID);
    //     state.fixtures = currentFixtures;
    //   } else {
    //     currentFixtures.push(fixture);
    //     state.fixtures = currentFixtures;
    //   }
    // },
  },
});

export const {
  updateFixtures,
  addToFixtures,
  removeFromFixtures,
  updateCurrentTournaments,
  // updateFavourites,
} = fixtureSlice.actions;
export default fixtureSlice.reducer;
