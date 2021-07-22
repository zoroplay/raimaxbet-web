import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import {sportsData, sportsBook} from './sports'
import couponData from './coupon'
import userData from './user'
import login from './login'

const reducers = combineReducers({
    routing: routerReducer,
    sportsData,
    sportsBook,
    couponData,
    login,
    auth: userData
});

export default reducers;
