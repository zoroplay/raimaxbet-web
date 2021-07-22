/* eslint eqeqeq: 0 */
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import {persistStore} from "redux-persist";

import reducers from './reducers';
import history from '../Services/history';

let middlewares = [thunk];

if (process.env.NODE_ENV == 'development') {
	const logger = createLogger({
		collapsed: true,
	});
	middlewares = [...middlewares, logger];
}
middlewares = [...middlewares, routerMiddleware(history)];

const store = createStore(reducers, applyMiddleware(...middlewares));

export const persistor = persistStore(store);

export default store;

