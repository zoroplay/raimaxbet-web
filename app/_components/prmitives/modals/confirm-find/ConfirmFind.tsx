"use client";
import React, { useEffect } from "react";
import "./ConfirmFind.scss";
import { HiMiniXMark } from "react-icons/hi2";
import { Button } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import {
  deleteAllFromCoupon,
  updateCoupon,
} from "@/_redux/slices/betslip.slice";

const ConfirmFind = ({ data }: { [key in string]: any }) => {
  const dispatch = useAppDispatch();
  // console.log(data, "data");

  return (
    <div className="confirm_bet_coupon center col">
      <div className="confirm_coupon_title_wrap between">
        <div className="confirm_coupon_title">BOOK BETSLIP</div>
        <div
          className="confirm_coupon_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <div className="confirm_bet_coupon_texts">
        <div className="confirm_bet_coupon_text1">
          Your betslip already contains selections. Do you want to overwite them
          with Rebet?
        </div>
      </div>
      <div className="confirm_coupon_btn_wrap end">
        <Button
          text="OVERWRITE"
          className="confirm_coupon_btn"
          onClick={() => {
            dispatch(closeComponentModal());
            dispatch(updateCoupon(data?.withBetslipData || data?.withCodeData));
            dispatch(openModal({ modalState: "betslip" }));
          }}
        />
      </div>
    </div>
  );
};

export default ConfirmFind;
