import {
    SET_SPORT,
    SET_FIXTURE,
    SET_FIXTURES,
    SET_SPORTS,
    SET_CATEGORIES,
    SET_TOURNAMENTS,
    SET_ACTIVE_PERIOD,
    SET_BONUS_LIST,
    SET_GLOBAL_VAR,
    SHOW_MODAL,
    SHOW_DEPOSIT_MODAL,
    SHOW_PASSWORD_MODAL,
    SHOW_LOGIN_MODAL,
    SHOW_TIPSTER_MODAL, SHOW_TIPSTER_BET, SHOW_BONUS_CONFIRM,
} from '../types'
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";

const initialState = {
    sport: null,
    sports: [],
    categories: [],
    tournaments: [],
    fixtures: [],
    fixture: null,
    activePeriod: 'all',
    SportsbookBonusList: [],
    SportsbookGlobalVariable: {},
    modal: {},
    depositModal: false,
    bonusModal: {
        show: false,
        amount: 0,
    },
    loginModal: false,
    tipsterBet: false,
    tipsterModal: {
        show: false,
        coupon: null,
    },
    passwordModal: {
        open: false,
        user_id: null
    },
}

export const sportsBook = persistReducer(
    { storage, key: "config", whitelist: ["SportsbookBonusList", "SportsbookGlobalVariable"] },
    (state = initialState, action) => {
        switch (action.type) {
            case SET_BONUS_LIST: {
                return {...state, SportsbookBonusList: action.payload };
            }
            case SET_GLOBAL_VAR: {
                return {...state, SportsbookGlobalVariable: action.payload };
            }
            default:
                return state;
        }
    }
);

export const sportsData = (state = initialState, action) => {
    switch (action.type) {
        case SET_SPORT:
            return { ...state, sport: action.payload };

        case SET_SPORTS:
            return { ...state, sports: action.payload };

        case SET_ACTIVE_PERIOD:
            return { ...state, activePeriod: action.payload };

        case SET_CATEGORIES:
            return { ...state, categories: action.payload };

        case SET_TOURNAMENTS:
            return { ...state, tournaments: action.payload };

        case SET_FIXTURES:
            return { ...state, fixtures: action.payload };

        case SET_FIXTURE:
            return { ...state, fixture: action.payload };

        case SHOW_MODAL:
            return { ...state, modal: action.payload };

        case SHOW_DEPOSIT_MODAL:
            return {...state, depositModal: !state.depositModal};

        case SHOW_LOGIN_MODAL:
            return {...state, loginModal: !state.loginModal};

        case SHOW_TIPSTER_BET:
            return {...state, tipsterBet: !state.tipsterBet};

        case SHOW_PASSWORD_MODAL:
            return {...state, passwordModal: action.payload};

        case SHOW_BONUS_CONFIRM:
            return {...state, bonusModal: action.payload};

        case SHOW_TIPSTER_MODAL:
            return {
                ...state,
                tipsterModal: {
                    ...state.tipsterModal,
                    show: !state.tipsterModal.show,
                    coupon: action.payload
                }
            };

        default:
            return state;
    }
}
