// app/providers/redux-provider.tsx
"use client";
import { PropsWithChildren } from "react";
import { Provider } from "react-redux";
import store, { persistor } from "@/_redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function ReduxProvider({ children }: PropsWithChildren) {
  return (
    <PersistGate loading={null} persistor={persistor}>
      <Provider store={store}>{children}</Provider>
    </PersistGate>
  );
}
