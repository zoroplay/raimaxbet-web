import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {sportsData, sportsBook} from './sports'
import couponData from './coupon'
import userData from './user'
import login from './login'
import {expenseReducer} from "./expenses";

const reducers = combineReducers({
    routing: routerReducer,
    sportsData,
    sportsBook,
    couponData,
    login,
    auth: userData,
    expenses: expenseReducer
});

export default reducers;
