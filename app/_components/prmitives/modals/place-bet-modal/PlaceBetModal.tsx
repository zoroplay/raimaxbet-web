"use client";
import React, { useEffect, useState } from "react";
import "./PlaceBetModal.scss";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { MdDoneOutline } from "react-icons/md";
import { MdRemoveDone } from "react-icons/md";
import { BsFillShareFill } from "react-icons/bs";
import { FaRegCopy } from "react-icons/fa";
import { formatNumber } from "@/_utils/helpers";
import { AnimatePresence } from "framer-motion";
import {
  usePlaceBetMutation,
  useBookBetMutation,
} from "@/_services/bet.service";
import { modalStateFalse } from "@/_redux/slices/modal.slice";
import { Oval } from "react-loader-spinner";
import { RWebShare } from "react-web-share";
import { rtkMutation } from "@/_utils";
import {
  deleteAllFromCoupon,
  updateCoupon,
} from "@/_redux/slices/betslip.slice";

const PlaceBetModal = () => {
  const [confirm, setConfirm] = useState(true);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const { coupon } = useAppSelector((state) => state.betslip);
  const { user } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const [
    bookBet,
    {
      data: bookBetData,
      isLoading: bookBetLoading,
      isError: isErrorBookBet,
      isSuccess: isSuccessBookBet,
      error: errorBookBet,
    },
  ] = useBookBetMutation();

  const copyTextToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied");
      // console.log("Text copied to clipboard");
    } catch (err) {
      // console.log("Failed to copy text");
    }
  };

  const [
    placeBet,
    {
      isLoading: isLoadingPlaceBet,
      isError: isErrorPlaceBet,
      isSuccess: isSuccessPlaceBet,
      data: dataPlaceBet,
      error: errorPlaceBet,
    },
  ] = usePlaceBetMutation();

  useEffect(() => {
    if (user) {
      const payload = { ...coupon };
      payload.userId = user.id;
      payload.username = user.username;
      dispatch(updateCoupon(payload));
    }
  }, [user]);

  return (
    <AnimatePresence>
      <div className="plbet end">
        <div className="plbet_wrap">
          {confirm ? (
            <div className="plbet_stake center col">
              <div className="plbet_stake_title">Confirm to pay</div>
              <div className="plbet_stake_amount">
                NGN{formatNumber(coupon.totalStake)}
              </div>
            </div>
          ) : (
            <div className="plbet_status">
              {isLoadingPlaceBet ? (
                <div className="p_20 center" style={{ width: "100%" }}>
                  <Oval
                    height={50}
                    width={50}
                    color="#4fa94d"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#4fa94d"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                </div>
              ) : (
                <div className="plbet_status_wrap center col">
                  {dataPlaceBet?.success === true ? (
                    <div className="plbet_status_icon center">
                      <MdDoneOutline />
                    </div>
                  ) : (
                    <div
                      className="plbet_status_icon center"
                      style={{ background: "red" }}
                    >
                      <MdRemoveDone />
                    </div>
                  )}
                  {dataPlaceBet?.success === true ? (
                    <div className="plbet_status_text">Bet Successful</div>
                  ) : (
                    <div className="plbet_status_text">Bet Failed</div>
                  )}
                  <div className="mt_10 plbet_status_error">
                    {dataPlaceBet?.success === false && (
                      <div className="plbet_status_error_text">
                        {dataPlaceBet?.message}
                      </div>
                    )}
                  </div>
                  <div className="plbet_status_info">
                    <div className="between plbet_status_info_wrap">
                      <div className="plbet_status_info_text">Total Stake</div>
                      <div className="plbet_status_info_text bold">
                        {formatNumber(coupon.totalStake)}
                      </div>
                    </div>
                    <div className="between plbet_status_info_wrap">
                      <div className="plbet_status_info_text">
                        Potential win
                      </div>
                      <div className="plbet_status_info_text bold">
                        {formatNumber(coupon.maxWin)}
                      </div>
                    </div>

                    {dataPlaceBet?.success === true && (
                      <div className="between plbet_status_info_wrap">
                        <div className="plbet_status_info_text">
                          Booking Code
                        </div>
                        <div className="plbet_status_info_text start">
                          <RWebShare
                            data={{
                              text: "Hi!, check out the bet i just placed on @RaimaxBet",
                              url: `https://web.raimax.bet/?shareCode=${dataPlaceBet?.data?.betslipId}`,
                              title: "RaimaxBet",
                            }}
                            onClick={() => console.log("shared successfully!")}
                          >
                            <div className="plbet_status_share_icon">
                              <BsFillShareFill />
                            </div>
                          </RWebShare>
                          <div
                            onClick={() =>
                              copyTextToClipboard(dataPlaceBet?.data?.betslipId)
                            }
                            className="start plbet_status_copy"
                          >
                            <span className="plbet_status_copy_icon">
                              <FaRegCopy />
                            </span>
                            <span className="plbet_status_copy_code bold">
                              {dataPlaceBet?.data?.betslipId}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="plbet_footer">
            {isLoadingPlaceBet ? (
              <div
                className="p_20 center"
                style={{ width: "100%", background: "#096b27", color: "#fff" }}
              >
                <span>Submitting</span>
              </div>
            ) : bookBetLoading ? (
              <div
                className="p_20 center"
                style={{ width: "100%", background: "#096b27", color: "#fff" }}
              >
                <span>Booking</span>
              </div>
            ) : confirm || dataPlaceBet?.success === false ? (
              <div className="plbet_confirm start">
                <div
                  className="plbet_confirm_text center"
                  onClick={() => dispatch(modalStateFalse("placebet"))}
                >
                  Cancel
                </div>
                <div
                  className="plbet_confirm_text text_bg center"
                  onClick={() => {
                    setConfirm(false);
                    rtkMutation(placeBet, { data: coupon });
                    const payload = { ...coupon };
                    payload.useBonus = false;
                    dispatch(updateCoupon(payload));
                  }}
                >
                  Confirm
                </div>
              </div>
            ) : (
              <div className="plbet_confirm start">
                <div
                  className="plbet_confirm_text center"
                  onClick={() => dispatch(modalStateFalse("placebet"))}
                >
                  Rebet
                </div>
                <div
                  className="plbet_confirm_text text_bg center"
                  onClick={() => {
                    setConfirm(false);
                    dispatch(modalStateFalse("placebet"));
                    dispatch(modalStateFalse("betslip"));
                    dispatch(deleteAllFromCoupon());
                  }}
                >
                  OK
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default PlaceBetModal;
