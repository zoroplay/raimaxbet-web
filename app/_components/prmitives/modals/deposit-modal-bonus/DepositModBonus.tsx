"use client";
import React, { useState, useEffect } from "react";
import "./DepositModBonus.scss";
import { GrFormClose } from "react-icons/gr";
import { AiOutlineDown } from "react-icons/ai";
import { paystack, monnify, flutterwave, mgurush, sbengine } from "@/_assets";
import Image from "next/image";
import { Button } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { useInitiateDepositMutation } from "@/_services/deposit.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useRouter } from "next/navigation";
import { useCheckFirstDepositQuery } from "@/_services/bonus.service";
import { setBonus } from "@/_redux/slices/user.slice";
import { formatNumber } from "@/_utils/helpers";
interface DepositModBonusProp {
  data: { [key in string]: string | number };
}

const DepositModBonus = ({ data }: DepositModBonusProp) => {
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const { activeBonus, user } = useAppSelector<any>((state) => state.user);
  const {data: bonusData} = useCheckFirstDepositQuery(
    undefined,
    {refetchOnMountOrArgChange: true }
  );
  const dispatch = useAppDispatch();
  const router = useRouter();


  const [
    initiateDeposit,
    { data: depositData, isLoading, isSuccess, isError, error },
  ] = useInitiateDepositMutation();

  const image: { [key in string]: string } = {
    paystack,
    monnify,
    flutterwave,
    mgurush,
    sbengine,
  };

  const activateBonus = () => {
    let bonusAmount = data.amount;
    if (bonusData?.data.type === 'flat') {
      bonusAmount = bonusData?.data.value;
    } else {
      bonusAmount = parseFloat(data.amount.toString()) * bonusData?.data.value / 100;
    }
    const bonus = {
      bonusId: bonusData.data.bonusId,
      amount: bonusAmount,
      username: user.username
    }
    dispatch(setBonus(bonus));
  }
  // console.log(data, "mod")

  useEffect(() => {
    depositData && depositData.success && router.push(depositData?.data.link);

    isError ||
      (depositData?.success === false &&
        dispatch(
          openModal({
            message: `${
              formatErrorResponse(error) || depositData?.message || "An error occured please try again"
            }`,
            success: false,
          })
        ));
  }, [isError, depositData, dispatch, error]);

  // console.log(depositData, "payment");

  return (
    <div className="deposit_modal_bonus">
      <div className="deposit_modal_title_wrap between">
        <div className="deposit_modal_title">MAKE DEPOSIT</div>
        <div
          className="deposit_modal_cancel"
          onClick={() => {
            dispatch(closeComponentModal());
            dispatch(setBonus(null));
          }}
        >
          <GrFormClose />
        </div>
      </div>
      <div className="deposit_modal_sub_wrap center col">
        <div className="deposit_modal_sub_text ">DEPOSIT AMOUNT</div>
        <div className="deposit_modal_sub_text">CURRENCY CONVERSION</div>
        <div className="deposit_modal_sub_text main">ACTIVE BONUSES</div>
        <div className="deposit_modal_sub_text">PAYMENT</div>
      </div>

      <div className="deposit_modal_payment_wrap">
        <div className="deposit_modal_payment">
          <Image
            src={image[data?.payment_method] || ""}
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
      <div className="bonus_wrap">
        {bonusData?.success && !activeBonus ? (
          <div className="bonus">
            <div className="bonus_text">{bonusData?.data?.name}</div>
            <Button 
              text="ACTIVATE" className="deposit_modal_btn" 
              onClick={activateBonus}
            />
          </div>
        ) : (
          activeBonus ? 
            <div className="no_bonus_text">
              You have activated <strong>{bonusData?.data.name}</strong>. Complete payment to receive <strong>{formatNumber(activeBonus?.amount)}</strong> in your bonus account.
            </div>
          :
          <div className="no_bonus_text">
            There are no active bonuses at this moment. Please proceed to
            payment page.
          </div>
        )}
      </div>
      <Button
        text="BACK"
        className="deposit_modal_btn_back"
        onClick={() => dispatch(openModal({ component: "DepositModal" }))}
      />
      <Button
        text="PROCEED PAYMENT"
        className="deposit_modal_btn_proceed"
        onClick={() => {
          rtkMutation(initiateDeposit, data);
        }}
        loading={isLoading}
      />
    </div>
  );
};

export default DepositModBonus;
