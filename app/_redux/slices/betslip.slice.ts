import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CouponDataType, InitialStateCouponType } from "@/_types";
import {
  calculateWinnings,
  groupSelections,
  groupTournament,
  calculateTotalOdds,
  checkBetType,
  checkIfHasLive,
  getDataFromPayload,
  calculateBonus,
  getSplitProps,
  min,
} from "@/_utils/helpers";
import { original } from "@reduxjs/toolkit";

import CouponCalculation from "@/_utils/CouponCalculation";

const couponCalculation = new CouponCalculation();
const WTH_PERC: any = process.env.NEXT_PUBLIC_WTH_PERC;

// const initialState: { [key in string]: string }[] = [];
const initialState: any = {
  betPlaced: null,
  loadedCoupon: null,
  confirm: false,
  coupon: {
    acceptChanges: false,
    selections: [],
    combos: [],
    totalOdds: 1,
    maxBonus: 0,
    minBonus: 0,
    grossWin: 0,
    maxWin: 0,
    minWin: 0,
    stake: 100,
    totalStake: 100,
    minOdds: 1,
    maxOdds: 1,
    wthTax: 0,
    exciseDuty: 0,
    useBonus: false,
    source: "mobile",
    userId: 0,
    username: "",
  },
  sportsbookBonusList: [],
};

const betSlipSlice = createSlice({
  name: "betslip",
  initialState,
  reducers: {
    addToCoupon(state, action: PayloadAction<any>) {
      const couponPayload = action.payload;

      const globalVars = couponPayload.sport;
      let type = couponPayload.type;

      const data = getDataFromPayload(couponPayload);

      let couponData = { ...state.coupon };
      const bonusList = state.sportsbookBonusList;

      state.coupon.event_type = type;

      if (!state.coupon.selections.length) {
        //add selection to selections list
        state.coupon.selections.push(data);

        state.coupon.bet_type = "Single";
        state.coupon.betslip_type = "Single";
        state.coupon.totalOdds = (
          parseFloat(state.coupon.totalOdds) * parseFloat(data.odds)
        ).toFixed(2);

        //calculate and get pot winnings with bonus
        const winnings = calculateWinnings(state.coupon, globalVars, bonusList);
        state.coupon.maxWin = winnings.maxWin;
        state.coupon.maxBonus = winnings.maxBonus;
        state.coupon.wthTax = winnings.wthTax;
        state.coupon.grossWin = winnings.grossWin;
        state.coupon.fixtures = groupSelections(state.coupon.selections);
        state.coupon.tournaments = groupTournament(state.coupon.selections);
        // check if event is live
        if (type === "live") state.coupon.hasLive = true;
      } else {
        state.coupon.betslip_type = "Multiple";
        state.coupon.bet_type = "Multiple";

        for (let i = 0; i < couponData.selections.length; i++) {
          if (couponData.selections[i].matchId === data.matchId) {
            //add selection to selections list
            state.coupon.selections.push(data);
            // const bonus = calculateBonus(state.coupon, globalVars, bonusList);
            // console.log(bonus, "bon");
            //group selections by match
            state.coupon.tournaments = groupTournament(state.coupon.selections);
            state.coupon.fixtures = groupSelections(couponData.selections);
            //bet type
            state.coupon.bet_type = "Split";
            state.coupon.betslip_type = "Combo";

            const splitProps: any = getSplitProps(state.coupon);
            //calculate winnings
            const minWinnings =
              parseFloat(splitProps.minOdds) * parseFloat(splitProps.minStake);
            const maxWinnings =
              parseFloat(splitProps.maxOdds) * parseFloat(splitProps.minStake);
            //calculate bonus
            state.coupon.minBonus = calculateBonus(
              state.coupon,
              globalVars,
              bonusList
            );

            state.coupon.minGrossWin =
              parseFloat(splitProps.minBonus) + minWinnings;
            state.coupon.minWTH =
              ((state.coupon.minGrossWin - state.coupon.stake) * WTH_PERC) /
              100;
            state.coupon.minWin =
              state.coupon.minGrossWin - state.coupon.minWTH;
            state.coupon.grossWin =
              parseFloat(splitProps.maxBonus) + maxWinnings;
            state.coupon.wthTax =
              ((state.coupon.grossWin - state.coupon.stake) * WTH_PERC) / 100;
            state.coupon.maxWin = state.coupon.grossWin - couponData.wthTax;

            return;
          }
        }

        //add selection to selections list
        state.coupon.selections.push(data);
        // const bonus = calculateBonus(state.coupon, globalVars, bonusList);
        // console.log(bonus, "bon");

        state.coupon.totalOdds = (
          parseFloat(state.coupon.totalOdds) * parseFloat(data.odds)
        ).toFixed(2);

        //group selections by match
        state.coupon.tournaments = groupTournament(couponData.selections);
        state.coupon.fixtures = groupSelections(couponData.selections);
        //check bet type
        state.coupon.bet_type = checkBetType(state.coupon.fixtures);
        // check if event is live

        if (type === "live") state.coupon.hasLive = true;

        if (state.coupon.bet_type === "Split") {
          const splitProps: any = getSplitProps(state.coupon);

          state.coupon.minStake =
            parseFloat(splitProps.stake) / splitProps.noOfCombos;

          //calculate winnings
          const minWinnings =
            parseFloat(splitProps.minOdds) * parseFloat(state.coupon.minStake);
          const maxWinnings =
            parseFloat(splitProps.maxOdds) * parseFloat(state.coupon.minStake);
          //calculate bonus
          state.coupon.minBonus = calculateBonus(
            state.coupon,
            globalVars,
            bonusList
          );

          state.coupon.minGrossWin =
            parseFloat(state.coupon.minBonus) + minWinnings;
          state.coupon.minWTH =
            ((state.coupon.minGrossWin - state.coupon.stake) * WTH_PERC) / 100;
          state.coupon.minWin = state.coupon.minGrossWin - state.coupon.minWTH;
          state.coupon.grossWin = parseFloat(splitProps.maxBonus) + maxWinnings;
          const wthTax =
            ((state.coupon.grossWin - state.coupon.stake) * WTH_PERC) / 100;
          state.coupon.wthTax = wthTax < 1 ? 0 : wthTax;
          state.coupon.maxWin = state.coupon.grossWin - state.coupon.wthTax;

          return;
        } else {
          const calculatedGroup = couponCalculation.calcCombinations(
            state.coupon
          );
          state.coupon.combos = calculatedGroup.Groups;
          //calculate and get pot winnings with bonus
          if (state.coupon.bet_type === "Combo") {
            // dispatch({ type: SET_COUPON_DATA, payload: couponData });
            if (state.coupon.Groupings && couponData.Groupings.length) {
              // updateComboWinningsFromTotal()
            }
          } else {
            const winnings = calculateWinnings(
              state.coupon,
              globalVars,
              bonusList
            );
            // console.log(winnings);
            state.coupon.maxWin = winnings.maxWin;
            state.coupon.maxBonus = winnings.maxBonus;
            state.coupon.wthTax = winnings.wthTax;
            state.coupon.grossWin = winnings.grossWin;
          }
        }
      }
    },
    removeFromCoupon(state, action: PayloadAction<any>) {
      const { id, globalVars } = action.payload;
      // find deleted item

      const res = original(state.coupon.selections);
      const data = res.find((item: any) => item.selectionId === id);

      const bonusList = state.sportsbookBonusList;
      //
      // get the new selections
      const newSelection = state.coupon.selections.filter(
        (item: any) => item.selectionId !== id
      );

      state.coupon.selections = newSelection;

      if (state.coupon.selections.length > 0) {
        const prevBetType = state.coupon.bet_type;
        //group selections by match
        state.coupon.tournaments = groupTournament(state.coupon.selections);
        state.coupon.fixtures = groupSelections(state.coupon.selections);
        //check bet type
        // console.log(state.coupon, "coups");
        // state.coupon.bet_type = multibetCombination(state.coupon.selections);

        state.coupon.bet_type = checkBetType(state.coupon.fixtures);

        if (state.coupon.bet_type === "Split") {
          const splitProps: any = getSplitProps(state.coupon);
          //calculate winnings
          const minWinnings =
            parseFloat(splitProps.minOdds) * parseFloat(splitProps.minStake);
          const maxWinnings =
            parseFloat(splitProps.maxOdds) * parseFloat(splitProps.minStake);
          //calculate bonus
          state.coupon.minBonus = calculateBonus(
            state.coupon,
            globalVars,
            bonusList
          );

          state.coupon.minGrossWin =
            parseFloat(state.coupon.minBonus) + minWinnings;
          state.coupon.minWTH =
            ((state.coupon.minGrossWin - state.coupon.stake) * WTH_PERC) / 100;
          state.coupon.minWin = state.coupon.minGrossWin - state.coupon.minWTH;
          state.coupon.grossWin =
            parseFloat(state.coupon.maxBonus) + maxWinnings;
          state.coupon.wthTax =
            ((state.coupon.grossWin - state.coupon.stake) * WTH_PERC) / 100;
          state.coupon.maxWin = state.coupon.grossWin - state.coupon.wthTax;
        } else {
          // recalculate totalOdds if prev bet type was Split
          if (prevBetType === "Split") {
            state.coupon.totalOdds = calculateTotalOdds(
              state.coupon.selections
            );
            state.coupon.minBonus = calculateBonus(
              state.coupon,
              globalVars,
              bonusList
            );
          } else {
            // else remove selection from total odds
            state.coupon.totalOdds = (
              parseFloat(state.coupon.totalOdds) / parseFloat(data.odds)
            ).toFixed(2);
            state.coupon.minBonus = calculateBonus(
              state.coupon,
              globalVars,
              bonusList
            );
          }
          // check if has live
          state.coupon.hasLive = checkIfHasLive(state.coupon.selections);

          const calculatedGroup = couponCalculation.calcCombinations(
            state.coupon
          );
          state.coupon.combos = calculatedGroup.Groups;
          // couponData.combos = await getCombos(couponData);
          //calculate and get pot winnings with bonus
          if (state.coupon.bet_type === "Combo") {
            // dispatch({ type: SET_COUPON_DATA, payload: coupondata })
            // if (coupondata.Groupings && coupondata.Groupings.length) {
            //   const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
            //   coupondata = coupondata.updateFromCalculatedCoupon(coupondata, calculatedCoupon);
            //   // update combos with max win
            //   coupondata.combos.forEach(combo => {
            //     for (let i = 0; i < coupondata.Groupings.length; i++) {
            //       if (combo.Grouping === coupondata.Groupings[i].Grouping) {
            //         combo.minWIn = coupondata.Groupings[i].minWin;
            //         combo.maxWin = coupondata.Groupings[i].maxWin;
            //         combo.Stake = coupondata.Groupings[i].Stake;
            //       }
            //     }
            //   })
            //   setTimeout(() => {
            //     return dispatch(updateComboWinningsFromTotal());
            //   }, 500);
            // }
          } else {
            const winnings = calculateWinnings(
              state.coupon,
              globalVars,
              bonusList
            );
            state.coupon.maxWin = winnings.maxWin;
            state.coupon.maxBonus = winnings.maxBonus;
            state.coupon.wthTax = winnings.wthTax;
            state.coupon.grossWin = winnings.grossWin;
          }
        }
      } else {
        const coupon = {
          acceptChanges: false,
          selections: [],
          combos: [],
          totalOdds: 1,
          maxBonus: 0,
          minBonus: 0,
          grossWin: 0,
          maxWin: 0,
          minWin: 0,
          stake: 100,
          totalStake: 100,
          minOdds: 1,
          maxOdds: 1,
          wthTax: 0,
          exciseDuty: 0,
          useBonus: false,
          source: "mobile",
        };
        state.coupon = coupon;
      }
    },
    deleteAllFromCoupon(state) {
      const coupon = {
        acceptChanges: false,
        selections: [],
        combos: [],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        grossWin: 0,
        maxWin: 0,
        minWin: 0,
        stake: 100,
        totalStake: 100,
        minOdds: 1,
        maxOdds: 1,
        wthTax: 0,
        exciseDuty: 0,
        useBonus: false,
        source: "mobile",
      };
      state.coupon = coupon;
    },
    updateWinnings(state, action: PayloadAction<any>) {
      const { stake, globalVars, id } = action.payload;
      // console.log(stake, globalVars, "stake");

      // grab current state
      const coupondata = original(state.coupon);

      const bonusList = state.sportsbookBonusList;
      const selections = [...state.coupon.selections];

      if (stake === "") {
        state.coupon.stake = "";
        if (state.coupon.betslip_type == "Single") {
          let totalStake = 0;
          let minWin: number[] = [];
          let maxWin = 0;
          const newSelections = selections.map((item: any) => {
            const newItem = Object.assign({}, item);
            if (item.selectionId === id) newItem.stake = 0;
            totalStake += newItem.stake;
            newItem.stake !== 0 && minWin.push(newItem.odds * newItem.stake);
            maxWin += newItem.odds * parseFloat(newItem.stake);
            return newItem;
          });
          state.coupon.selections = newSelections;
          state.coupon.totalStake = totalStake;
          state.coupon.minWin = min(minWin);
          // console.log(minWin.min());
        }
      }

      if (stake !== "") {
        if (state.coupon.betslip_type === "Single") {
          let maxWin = 0;
          let minWin = [];
          const maxOdds = state.coupon.selections.max("odds");
          const minOdds = state.coupon.selections.min("odds");

          if (id === "all") {
            const stakePerBet = parseFloat(stake);
            state.coupon.stake = stake; // set new total stake
            state.coupon.totalStake = stake * state.coupon.selections.length;

            for (let index = 0; index < selections.length; index++) {
              const selection = selections[index];
              selection.stake = stakePerBet;
              selections[index] = selection;

              maxWin += selection.odds * stakePerBet;
              minWin.push(selection.odds * stakePerBet);
            }
            state.coupon.maxWin = maxWin;
            state.coupon.minWin = min(minWin);
          } else {
            const index = state.coupon.selections.findIndex(
              (i: any) => i.selectionId === id
            );
            if (index !== -1) {
              state.coupon.stake = "";
              maxWin = 0;
              minWin = [];
              let totalStake = 0;
              selections[index].stake = parseFloat(stake);

              for (let index = 0; index < selections.length; index++) {
                const selection = selections[index];
                if (selection.stake > 0) {
                  maxWin += selection.odds * parseFloat(selection.stake);
                  totalStake += parseFloat(selection.stake);
                  selections[index] = selection;
                  minWin.push(selection.odds * selection.stake);
                }
              }
              state.coupon.maxWin = maxWin;
              state.coupon.minWin = min(minWin);
              state.coupon.selections = selections;
              state.coupon.totalStake = totalStake;
            }
          }

          state.coupon.totalOdds = parseFloat(maxOdds).toFixed(2);
          state.coupon.minOdds = parseFloat(minOdds).toFixed(2);
        } else {
          state.coupon.totalOdds = calculateTotalOdds(
            state.coupon.selections
          ).toFixed(2);
          state.coupon.totalStake = parseFloat(stake);
          state.coupon.exciseDuty = (coupondata.totalStake * 0) / 100;
          // console.log((coupondata.totalStake * 0) / 100, "calc")
          state.coupon.stake = coupondata.totalStake - coupondata.exciseDuty;
          // console.log(original(state.coupon), "the coup")

          //calculate Winnings
          const winnings = calculateWinnings(
            state.coupon,
            globalVars,
            bonusList
          );
          // console.log(winnings, "win");
          state.coupon.maxWin = winnings.maxWin;
          state.coupon.maxBonus = winnings.maxBonus;
          state.coupon.wthTax = winnings.wthTax;
          state.coupon.grossWin = winnings.grossWin;
        }
      }
    },
    updateCoupon(state, action: PayloadAction<any>) {
      const payload = action.payload;
      const bonusList = state.sportsbookBonusList;

      if (payload) {
        const coupon = { ...payload };
        const globalVars = payload.globalVars;

        if (coupon.totalOdd) {
          //group selections by match
          coupon.tournaments = groupTournament(coupon.selections);
          coupon.fixtures = groupSelections(coupon.selections);
          //check bet type
          coupon.bet_type = checkBetType(coupon.fixtures);
          coupon.totalOdds = calculateTotalOdds(coupon.selections).toFixed(2);
          coupon.totalStake = coupon.stake;
          const calculatedGroup = couponCalculation.calcCombinations(
            state.coupon
          );
          state.coupon.combos = calculatedGroup.Groups;
          const winnings = calculateWinnings(coupon, globalVars, bonusList);
          coupon.maxWin = winnings.maxWin;
          coupon.maxBonus = winnings.maxBonus;
          coupon.wthTax = winnings.wthTax;
          coupon.grossWin = winnings.grossWin;
        }
        state.coupon = coupon;
      }
    },
    updateStakeValues(state, action: PayloadAction<any>) {
      const value = action.payload;
      if (value) {
        state.coupon.stake = value;
        state.coupon.totalStake = value;
      }
    },
    setBetType(state, action: PayloadAction<any>) {
      const betslip_type = action.payload;
      state.coupon.betslip_type = betslip_type;
      state.coupon.bet_type = betslip_type;
      const selections = original(state.coupon.selections)!;
      state.coupon.stake = "";
      state.coupon.totalStake = "";
      state.coupon.minStake = "";
      state.coupon.minWin = "";
      state.coupon.minBonus = "";
      state.coupon.maxWin = "";
      state.coupon.maxBonus = "";
      const newSelections = selections.map((item: any) => {
        const newItem = Object.assign({}, item);
        newItem.stake = "";
        return newItem;
      });
      state.coupon.selections = newSelections;
    },
    updateSportsbookBonusList(state, action: PayloadAction<any>) {
      const data = action.payload;
      const newState = { ...state };
      newState.sportsbookBonusList = data;
      return newState;
    },
  },
});

export const {
  addToCoupon,
  removeFromCoupon,
  deleteAllFromCoupon,
  updateWinnings,
  updateCoupon,
  setBetType,
  updateSportsbookBonusList,
  updateStakeValues,
} = betSlipSlice.actions;
export default betSlipSlice.reducer;
