"use client";
import React, { useState, useEffect } from "react";
import "./DepositModal.scss";
import { GrFormClose } from "react-icons/gr";
import { AiOutlineDown } from "react-icons/ai";
import Image from "next/image";
import { paystack, monnify, flutterwave, mgurush, sbengine } from "@/_assets";
import { Button } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { useGetAllPaymentQuery } from "@/_services/deposit.service";
import { useGetUserDetailsQuery } from "@/_services/auth.service";

const DepositModal = () => {
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [value, setValue] = useState<number>();
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.user);

  const { data } = useGetAllPaymentQuery("");
  const { data: userDetails } = useGetUserDetailsQuery("");

  const image: { [key in string]: string } = {
    paystack,
    monnify,
    flutterwave,
    mgurush,
    sbengine,
  };
  // console.log(isOpen, "payment");

  useEffect(() => {
    if (data?.data) {
      const booleanArray = new Array(data.data.length).fill(false);
      setIsOpen(booleanArray);
    }
  }, [data]);

  return (
    <div className="deposit_modal">
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
        <div className="deposit_modal_sub_text main">DEPOSIT AMOUNT</div>
        <div className="deposit_modal_sub_text">CURRENCY CONVERSION</div>
        <div className="deposit_modal_sub_text">ACTIVE BONUSES</div>
        <div className="deposit_modal_sub_text">PAYMENT</div>
      </div>
      <div className="deposit_modal_form_wrap ">
        <div className="deposit_modal_form_text">
          PLEASE ENTER THE DEPOSIT AMOUNT
        </div>
        <div className="deposit_modal_input_wrap between">
          <div className="deposit_modal_ngn center">NGN</div>
          <div className="deposit_modal_input_con">
            {" "}
            <input
              className="deposit_modal_input"
              placeholder="Amount"
              value={value}
              type="number"
              onChange={(e) => {
                setValue(parseInt(e.target.value));
                setError(null);
              }}
            />
          </div>
          <div className="deposit_modal_dec center">.00</div>
        </div>
        <div className="deposit_modal_error">{error && error}</div>
      </div>
      {data?.data?.map((item: any, idx: number) => (
        <div className="deposit_modal_payment_wrap" key={idx}>
          <div className="deposit_modal_payment">
            <Image
              src={image[item?.provider || ""] || ""}
              alt="paypent"
              width={155}
              height={40}
              className="deposit_modal_payment_img"
            />
            <div className="paypent_text between">
              <div className="key">COST</div>
              <div className="value">NO COST</div>
            </div>
            <div className="paypent_text between">
              <div className="key">MIN</div>
              <div className="value">NGN 100.00</div>
            </div>
            <div className="paypent_text between">
              <div className="key">MAX</div>
              <div className="value">NGN 1,000,000.00</div>
            </div>
          </div>
          <div className="deposit_modal_btns">
            <Button
              text="DEPOSIT"
              className="deposit_modal_btn"
              onClick={() => {
                // if (userDetails?.data?.email) {
                value
                  ? dispatch(
                      openModal({
                        component: "DepositModBonus",
                        data: {
                          amount: value,
                          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                          paymentMethod: item?.provider,
                        },
                      })
                    )
                  : setError("Amount field is required");
                // } else {
                //   dispatch(openModal({ component: "UpdateProfile" }));
                // }
              }}
            />
            <div className={`deposit_modal_acc ${isOpen[idx] && "active"}`}>
              <div
                className="deposit_modal_acc_icon center"
                onClick={() => {
                  const newIsOpen = [...isOpen];
                  newIsOpen[idx] = !newIsOpen[idx];
                  setIsOpen(newIsOpen);
                }}
              >
                <AiOutlineDown />
              </div>
              <div className="deposit_modal_acc_method start">
                {item?.title}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DepositModal;
