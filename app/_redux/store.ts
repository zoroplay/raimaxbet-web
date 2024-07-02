"use client";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { user, modal, register, betslip, sport, fixtures } from "./slices";
import apiSlice from "@/_services/api/api";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { encryptTransform } from "redux-persist-transform-encrypt";
import storage from "redux-persist/lib/storage";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import { WebStorage, Transform } from "redux-persist";

const rootReducer = combineReducers({
  user,
  modal,
  register,
  betslip,
  sport,
  fixtures,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

// interface PersistConfig {
//   key: string;
//   storage: WebStorage;
//   version: number;
//   transform: Transform<unknown, string, any, any>[];
//   stateReconciler: StateReconciler;
//   blacklist: string;
// }

// interface EncryptTransform {
//   secretKey: string;
//   onError?: (error: Error) => void;
// }

// interface StateReconciler {
//   (inboundState: any, originalState: any): any;
// }

const persistConfig: any = {
  key: "root",
  storage,
  version: 1,
  transforms: [
    encryptTransform({
      secretKey: process.env.REACT_ENCRYPT_KEY
        ? process.env.REACT_ENCRYPT_KEY
        : "SecreteKey",
      onError: function (error) {
        // Handle the error.
      },
    }),
  ],
  stateReconciler: hardSet,
  blacklist: [apiSlice.reducerPath],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
});

const persistor = persistStore(store);

export default store;
export { persistor };
