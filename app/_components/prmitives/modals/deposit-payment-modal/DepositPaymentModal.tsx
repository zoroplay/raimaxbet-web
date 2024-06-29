"use client";
import React, { useState, useEffect } from "react";
import "./DepositPaymentModal.scss";
import { GrFormClose } from "react-icons/gr";
import { AiOutlineDown } from "react-icons/ai";
import Image from "next/image";
import { Button } from "@/_components";
import { paystack, monnify, flutterwave, mgurush, sbengine } from "@/_assets";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { useInitiateDepositMutation } from "@/_services/deposit.service";
import { rtkMutation } from "@/_utils";
interface DepositModBonusProp {
  data: { data: { reference_no: string; payment_method: string }; url: string };
}

const DepositPaymentModal = ({ data }: DepositModBonusProp) => {
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const dispatch = useAppDispatch();

  const [initiateDeposit, { isLoading, isSuccess }] =
    useInitiateDepositMutation();
  const image: { [key in string]: string } = {
    paystack,
    monnify,
    flutterwave,
    mgurush,
    sbengine,
  };

  // console.log(data, "payment");

  return (
    <div className="deposit_modal_bonus">
      <div className="deposit_modal_title_wrap between">
        <div className="deposit_modal_title">MAKE DEPOSIT</div>
        <div
          className="deposit_modal_cancel"
          onClick={() => dispatch(closeComponentModal())}
        >
          <GrFormClose />
        </div>
      </div>
      <div className="deposit_modal_sub_wrap center col">
        <div className="deposit_modal_sub_text ">DEPOSIT AMOUNT</div>
        <div className="deposit_modal_sub_text">CURRENCY CONVERSION</div>
        <div className="deposit_modal_sub_text ">ACTIVE BONUSES</div>
        <div className="deposit_modal_sub_text main">PAYMENT</div>
      </div>

      <div className="deposit_modal_payment_wrap">
        <div className="deposit_modal_payment">
          <Image
            src={image[data?.data?.payment_method] || ""}
            alt="paypent"
            width={155}
            height={40}
          />
          <div className="paypent_text between">
            <div className="key">PROCESSING</div>
            <div className="value">INSTANT</div>
          </div>
          <div className="paypent_text between">
            <div className="key">RATE</div>
            <div className="value">NO COST</div>
          </div>
          <div className="paypent_text between">
            <div className="key">MIN</div>
            <div className="value">NGN 100</div>
          </div>
        </div>
      </div>
      <div className="pay_iframe">
        <div className="pay_iframe_text">
          Your Deposit pin is: {data?.data?.reference_no} Take to shop to
          complete deposit
        </div>
      </div>
    </div>
  );
};

export default DepositPaymentModal;
