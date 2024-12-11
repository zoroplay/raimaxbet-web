"use client";
import React, { useEffect } from "react";
import "./ConfirmTransfer.scss";
import { HiMiniXMark } from "react-icons/hi2";
import { Button } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import {
  deleteAllFromCoupon,
  updateCoupon,
} from "@/_redux/slices/betslip.slice";
import { rtkMutation } from "@/_utils";
import { useInitiateTransferMutation } from "@/_services/deposit.service";

const ConfirmTransfer = ({ data }: { [key in string]: any }) => {
  const dispatch = useAppDispatch();
  // console.log(data, "data");
  const [transferMutation, { isLoading, isError, isSuccess, error }] =
    useInitiateTransferMutation();
  return (
    <div className="confirm_bet_coupon center col">
      <div className="confirm_coupon_title_wrap between">
        <div className="confirm_coupon_title">Confirm Transfer</div>
        <div
          className="confirm_coupon_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <div className="confirm_bet_coupon_texts">
        <div className="confirm_bet_coupon_text1">
          Do you wish to proceed with the transfer?
        </div>
      </div>
      <div className="confirm_coupon_btn_wrap center">
        <Button
          text="Transfer"
          className="confirm_coupon_btn"
          onClick={() => {
            if (!data.amount || !data.pin || !data.toUsername) return;
            dispatch(closeComponentModal());
            rtkMutation(transferMutation, {
              amount: data.amount,
              pin: data.pin,
              toUsername: data.toUsername,
            });
          }}
        />
      </div>
    </div>
  );
};

export default ConfirmTransfer;
