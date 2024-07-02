"use client";
import React from "react";
import "./ToDepositModal.scss";
import { Button } from "@/_components";
import { PiWarningOctagonThin } from "react-icons/pi";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";

const ToDepositModal = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="to_deposit center col">
      <div className="to_deposit_icon">
        <PiWarningOctagonThin />
      </div>
      <div className="to_deposit_text">
        Your balance is low, you can deposit more funds using our deposit
        options
      </div>
      <div className="between">
        <Button
          text="Cancel"
          className="to_deposit_btn1"
          onClick={() => dispatch(closeComponentModal())}
        />
        <Button
          text="Deposit"
          className="to_deposit_btn2"
          onClick={() => dispatch(openModal({ component: "DepositModal" }))}
        />
      </div>
    </div>
  );
};

export default ToDepositModal;
