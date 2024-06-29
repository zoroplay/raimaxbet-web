"use client";
import React, { useEffect } from "react";
import "./BookBetslip.scss";
import { HiMiniXMark } from "react-icons/hi2";
import { Button } from "@/_components";
import { usePlaceBetMutation } from "@/_services/bet.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { TailSpin } from "react-loader-spinner";
import { deleteAllFromCoupon } from "@/_redux/slices/betslip.slice";

const BookBetslip = () => {
  const dispatch = useAppDispatch();
  const { coupon } = useAppSelector((state) => state.betslip);

  const [
    bookBet,
    {
      data: bookBetData,
      isLoading: bookBetLoading,
      isError: isErrorBookBet,
      isSuccess: isSuccessBookBet,
      error: errorBookBet,
    },
  ] = usePlaceBetMutation();
  // const [
  //   placeBet,
  //   {
  //     data: placeBetData,
  //     isLoading: placeBetLoading,
  //     isError: placeBetIsError,
  //   },
  // ] = useBookBetMutation();

  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
      // console.log("Text copied to clipboard");
    } catch (err) {
      // console.log("Failed to copy text");
    }
  };

  useEffect(() => {
    rtkMutation(bookBet, {data: coupon, param: 1});
  }, []);

  useEffect(() => {
    isErrorBookBet &&
      dispatch(
        openModal({
          title: "BOOK BET PLACEMENT FAILED",
          message: `${formatErrorResponse(errorBookBet) || "An error occured"}`,
        })
      );
  }, [isErrorBookBet, errorBookBet, dispatch]);

  return (
    <div className="book_bet_slip center col">
      {bookBetLoading ? (
        <div className="book_bet_slip_load">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="tail-spin-loading"
            radius="1"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        </div>
      ) : bookBetData?.success === false || isErrorBookBet ? (
        <>
          {" "}
          <div className="book_slip_title_wrap between">
            <div className="book_slip_title">BOOK BETSLIP</div>
            <div
              className="book_slip_icon"
              onClick={() => dispatch(closeComponentModal())}
            >
              <HiMiniXMark />
            </div>
          </div>
          <div className="book_bet_slip_texts">
            <div className="book_bet_slip_text1">
              You can place the booked bet in a bestshop or share it with a
              friend.
            </div>
            <div className="book_bet_slip_text2">Selection not saved</div>
            <div className="book_bet_slip_text3">
              {bookBetData?.data?.betslipId}
            </div>
            <div
              className="book_bet_slip_text4"
              onClick={() => copyTextToClipboard(bookBetData?.data?.betslipId)}
            >
              {bookBetData?.message || "An error occured"}
            </div>
          </div>
          <div className="book_slip_btn_wrap end">
            <Button
              text="NEW BET"
              className="book_slip_btn"
              onClick={() => {
                dispatch(deleteAllFromCoupon());
                dispatch(closeComponentModal());
              }}
            />
          </div>
        </>
      ) : (
        <>
          {" "}
          <div className="book_slip_title_wrap between">
            <div className="book_slip_title">BOOK BETSLIP</div>
            <div
              className="book_slip_icon"
              onClick={() => dispatch(closeComponentModal())}
            >
              <HiMiniXMark />
            </div>
          </div>
          <div className="book_bet_slip_texts">
            <div className="book_bet_slip_text1">
              You can place the booked bet in a bestshop or share it with a
              friend.
            </div>
            <div className="book_bet_slip_text2">
              Selection saved successfuly your code is:
            </div>
            <div className="book_bet_slip_text3">
              {bookBetData?.data?.betslipId}
            </div>
            <div
              className="book_bet_slip_text4"
              onClick={() => copyTextToClipboard(bookBetData?.data?.betslipId)}
            >
              COPY BOOKING CODE
            </div>
          </div>
          <div className="book_slip_btn_wrap end">
            <Button
              text="NEW BET"
              className="book_slip_btn"
              onClick={() => {
                dispatch(deleteAllFromCoupon());
                dispatch(closeComponentModal());
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default BookBetslip;
