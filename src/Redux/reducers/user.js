import * as Actions from '../types';
import {persistReducer} from "redux-persist";
import storage from "redux-persist/lib/storage";
import * as types from "../types";

const initialState = {
    role: [],//guest
    user: {},
    isAuthenticated: false,
    access_token: null,
    username: null,
};

const userData = persistReducer(
    { storage, key: "auth", whitelist: ["user", 'access_token', 'isAuthenticated'] },
    (state = initialState, action) => {
        switch ( action.type )
        {
            case Actions.SET_USER_DATA:
            {
                return {
                    ...state,
                    ...action.payload
                };
            }
            case Actions.UPDATE_USER_DATA:
            {
                return {
                    ...state,
                    user: action.payload
                };
            }
            case types.UPDATE_USERNAME:
            {
                return {
                    ...state,
                    username: action.payload
                };
            }
            case Actions.REMOVE_USER_DATA:
            {
                return {
                    ...initialState
                };
            }
            case types.UPDATE_USER_BALANCE: {
                return {
                    ...state,
                    user: {
                        ...state.user,
                        available_balance: action.payload,
                        balance: action.payload
                    }
                }
            }
            case Actions.USER_LOGGED_OUT:
            {
                return initialState;
            }
            default:
            {
                return state
            }
        }
    }
);

export default userData;
