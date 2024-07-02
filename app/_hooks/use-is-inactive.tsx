"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from ".";
import { openModal } from "@/_redux/slices/modal.slice";

const useIsInactive = () => {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!token) {
      return;
    }

    let timeout: NodeJS.Timeout | null = null;

    const resetTimeOut = () => {
      timeout && clearTimeout(timeout);
      timeout = setTimeout(() => {
        dispatch(openModal({ component: "InactiveModal" }));
      }, 120000);
    };

    window.addEventListener("mousemove", resetTimeOut);
    window.addEventListener("keydown", resetTimeOut);
    window.addEventListener("touchmove", resetTimeOut);

    resetTimeOut();

    return () => {
      timeout && clearTimeout(timeout);
      window.removeEventListener("mousemove", resetTimeOut);
      window.removeEventListener("keydown", resetTimeOut);
      window.addEventListener("touchmove", resetTimeOut);
    };
  }, [token, dispatch]);
  return null;
};

export default useIsInactive;
