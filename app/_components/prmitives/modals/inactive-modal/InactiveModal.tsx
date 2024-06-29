"use client";
import React, { useEffect, useState } from "react";
import "./InactiveModal.scss";
import { Button } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";
import { logoutUser } from "@/_redux/slices/user.slice";

const InactiveModal = () => {
  const [counter, setCounter] = useState(60);

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!token) {
      return;
    }
    const interval = setInterval(() => {
      if (counter < 1) {
        token && dispatch(logoutUser());
        // dispatch(closeComponentModal());
      }
      setCounter((prev) => (prev >= 1 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [counter, token, dispatch]);

  return (
    <div className="inac_mod center col">
      <div className="inac_mod_text">
        {counter > 0
          ? "You are about to be logged out in:"
          : "You have been logged out, login to continue"}
      </div>
      <div className="inac_mod_count">{counter > 0 ? counter + "s" : ""}</div>
      <Button
        text={counter > 0 ? "Cancel" : "Close"}
        onClick={() => dispatch(closeComponentModal())}
      />
    </div>
  );
};

export default InactiveModal;
