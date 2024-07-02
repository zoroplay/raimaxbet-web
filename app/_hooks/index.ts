import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch, RootState } from "../_types/index";
import type { TypedUseSelectorHook } from "react-redux";

// Use throughout the app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from "./use-auth";
export { default as useDebounce } from "./use-debounce";
export { default as useSticky } from "./use-sticky";
export { default as useTimer } from "./use-timer";
export { default as useHash } from "./use-hash";
export { default as useIsInactive } from "./use-is-inactive";
