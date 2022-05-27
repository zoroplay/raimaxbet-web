import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import * as types from "../types";
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'

const initialState = {
    betPlaced: null,
    loadedCoupon: null,
    confirm: false,
    coupon:{
        selections: [],
        combos:[],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        grossWin: 0,
        maxWin: 0,
        minWin: 0,
        stake: 0,
        totalStake: 0,
        minOdds: 1,
        maxOdds: 1,
        wthTax: 0,
        exciseDuty: 0,
        useBonus: false,
    },
    weeklyCoupon:{
        selections: [],
        totalOdds: 1,
        maxWin: 0,
        stake: 0,
    },
    poolCoupon: {
        selections:[],
        stake: 0,
        gameType: 'PERM3',
        gameWeek: '',
        odd: '100-1'
    },
    betslip: null,
    todaysBets: [],
    couponModal: {
        show: false,
        betslip: null
    },
    cashoutModal: {
        show: false,
        betslip: null
    },
}

const couponData = persistReducer(
    { storage, key: "couponData", whitelist: ["coupon"], stateReconciler: autoMergeLevel2 },
    (state = initialState, action) => {
        switch (action.type) {
            case types.SET_COUPON_DATA:
                return { ...state, coupon: action.payload };

            case types.SET_POOL_COUPON_DATA:
                return { ...state, poolCoupon: action.payload };

            case types.SET_WEEKLY_COUPON_DATA:
                return { ...state, weeklyCoupon: action.payload };

            case types.SET_BET_PLACED:
                return { ...state, betPlaced: action.payload };

            case types.SET_USE_BONUS:
                return {
                    ...state,
                    coupon: {
                        ...state.coupon,
                        useBonus: true
                    }
                };

            case types.SET_LOADED_DATA:
                return { ...state, loadedCoupon: action.payload };

            case types.CONFIRM_BET:
                return { ...state, confirm: action.payload };

            case types.SET_BETSLIP_DATA:
                return { ...state, betslip: action.payload };

            case types.SET_TODAYS_BET:
                return { ...state, todaysBets: [...state.todaysBets, action.payload] };

            case types.CANCEL_BET:
                let coupon = {
                    selections: [],
                    combos:[],
                    totalOdds: 1,
                    minWin: 0,
                    maxWin: 0,
                    maxBonus: 0,
                    minBonus: 0,
                    stake: 0,
                    totalStake: 0,
                    useBonus: false
                };
                let poolCoupon = {
                    selections:[],
                    stake: 0,
                    gameType: 'PERM3',
                    gameWeek: '',
                    odd: '100-1'
                };
                let weeklyCoupon = {
                    selections: [],
                    totalOdds: 1,
                    maxWin: 0,
                    stake: 0,
                };
                return {...state, coupon, poolCoupon, weeklyCoupon};

            case types.RESET_COUPON_AMOUNT:
                return {
                    ...state,
                    coupon: {
                        ...state.coupon,
                        stake: 0,
                        totalStake: 0,
                        maxWin: 0,
                        bonus: 0,
                    }
                };
                break;
            case types.SET_COUPON_TYPE:
                return {
                    ...state,
                    coupon: {
                        ...state.coupon,
                        bet_type: action.payload
                    }
                };
                break;
            default:
                return state;
        }
    }
);


export default couponData;
