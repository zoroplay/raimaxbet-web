"use client";
import React, { useState, useEffect } from "react";
import "../../../iconstwo.css";
import "./BetAccordion.scss";
import { BiChevronDown } from "react-icons/bi";
import {
  formatNumber,
  getPlacedBetStatus,
  multibetCombination,
} from "@/_utils/helpers";
import { dayMonthTime, rtkMutation } from "@/_utils";
import { Button } from "..";
import { useReBetQuery } from "@/_services/bet.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";
import { updateCoupon } from "@/_redux/slices/betslip.slice";
import dayjs from 'dayjs';

const BetAccordion = ({ data }: any) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [skip, setSkip] = useState(true);

  const dispatch = useAppDispatch();
  const { coupon } = useAppSelector((state) => state.betslip);
  const selections = coupon.selections;

  // const [isQueryRefetched, setIsQueryRefetched] = useState(true);

  const {
    data: newData,
    isSuccess,
    isLoading,
    isError,
  } = useReBetQuery(data?.betslip_id, {
    // skip,
  });


  const handleClick = () => {
    // setTimeout(() => {
    if (newData?.message === "found") {
      if (selections.length >= 1) {
        dispatch(
          openModal({
            component: "ConfirmFind",
            data: {
              withBetslipData: newData?.coupon,
            },
          })
        );
      } else if (newData?.coupon?.selections?.length >= 1) {
        dispatch(updateCoupon(newData?.coupon));
        dispatch(openModal({ modalState: "betslip" }));
      } else if (newData?.coupon?.selections?.length < 1) {
        dispatch(
          openModal({
            title: "Selection Is Empty",
            message: "Event is no longer active",
          })
        );
      }
    } else {
      dispatch(
        openModal({
          title: "An Error Occured",
          message: "Please try again",
        })
      );
    }
    // }, 2000);
  };

  return (
    <div className="bet_acc">
      <div className="bet_acc_stake" onClick={() => setIsOpen(!isOpen)}>
        <div className="bet_acc_texts between">
          <div className="icon_text center">
            <div className={`icon ${isOpen && "active"}`}>
              <BiChevronDown />
            </div>
            <div className="bet_acc_title">
              {"NGN " + data?.stake}{" "}
              {data?.selections?.length > 1 ? "Multiway" : "Single"}
            </div>
          </div>
          <div className="bet_acc_text">{dayMonthTime(data?.created)}</div>
        </div>
        <div className="bet_acc_stake_status between">
          <div className="bet_acc_status_text1">{data?.betslipId}</div>
          <div
            className="bet_acc_status_text2"
            style={{
              color:
                data?.statusCode === 1
                  ? "green"
                  : data?.statusCode === 2 || data?.statusCode === 3
                  ? "red"
                  : "",
            }}
          >
            {data?.statusDescription}
          </div>
        </div>
      </div>
      {isOpen && data?.selections && (
        <>
          {data?.selections?.map((item: any, idx: number) => (
            <div className="bet_acc_market" key={idx}>
              <div className="bet_acc_market_texts between">
                <div className="icon_text center">
                  <div
                    className="status_indicator"
                    style={{
                      backgroundColor:
                        data?.status == 1
                          ? "green"
                          : data?.status == 2 || data?.status == 3
                          ? "red"
                          : "",
                    }}
                  />
                  <div className="bet_acc_market_title">
                    {" "}
                    {/* {item?.event?.split("-")[item?.status]} */}
                    {item?.outcomeName}
                  </div>
                </div>
                <div className="bet_acc_market_odd">{item?.odds.toFixed(2) || "--"}</div>
              </div>
              <div className="bet_acc_market_textwrap between">
                <div className="bet_acc_market_text">{`${item?.marketName} : ${item?.outcomeName}`}</div>
              </div>
              <div className="bet_acc_teamscore_wrap between">
                <div className="bet_acc_teamscore">
                  <span
                    style={{
                      color:
                        item?.status == 1
                          ? "green"
                          : item?.status == 2 || item?.status == 3
                          ? "red"
                          : "",
                    }}
                  >
                    {data?.status &&
                      item?.score}
                  </span>{" "}
                  {`${item?.eventName && item?.eventName?.replace("-", "vs")} 
                  ${
                    data?.statusDescription !== "Pending"
                      ? `(90) - ${item?.score}`
                      : "(..)"
                  }`}
                </div>
                <div
                  className="bet_acc_teamscore_text"
                  style={{
                    color:
                      data?.statusDescription === "Pending"
                        ? "#8a8a8a"
                        : item?.status == 1
                        ? "green"
                        : item?.status == 2 || item?.status == 3
                        ? "red"
                        : "",
                  }}
                >
                  {data?.statusDescription !== "Pending"
                    ? item?.statusDescription
                    : dayMonthTime(item?.eventDate)}
                </div>
              </div>
              <div className="bet_acc_market_stake_icons">
                <span className="sbe-sb-mb-event-cashout">
                  <i className="sbe-app-cash"></i>
                </span>
                <span
                  className="sbe-sb-mb-event-statistics"
                  onClick={() =>
                    window.open(
                      `https://s5.sir.sportradar.com/betradar/en/match/${item?.matchId}`,
                      "stats",
                      "width=1078,height=768"
                    )
                  }
                >
                  <i className="sbe-app-statistics"></i>
                </span>
              </div>
            </div>
          ))}
          <div className="bet_acc_stake_detail_wrap">
          {data?.betType && data?.betType === 'Combo' &&
            <div className="bet_acc_stake_detail bottom between">
              <div className="bet_acc_stake_text">
                1 X NGN {data?.stake} {multibetCombination(data?.selections)}
              </div>
              <div className="bet_acc_stake_text">NGN {data?.stake}</div>
            </div>}
            <div className="bet_acc_stake_detail between">
              <div className="bet_acc_stake_text">Odds</div>
              <div className="bet_acc_stake_text">{data?.totalOdd.toFixed(2)}</div>
            </div>
            <div className="bet_acc_stake_detail between">
              <div className="bet_acc_stake_text">Total Stake</div>
              <div className="bet_acc_stake_text">{"NGN " + data?.stake}</div>
            </div>
            <div className="bet_acc_stake_detail between">
              <div className="bet_acc_stake_pow">Possible Wins</div>
              <div className="bet_acc_stake_pow">
                {"NGN " + formatNumber(data?.possibleWin)}
              </div>
            </div>
            {data?.statusDescription === "Pending" && (
              <div className="bet_acc_btn_wrap">
                <Button
                  className="bet_acc_btn"
                  text="REBET"
                  loading={isLoading}
                  onClick={() => {
                    setSkip(false);
                    handleClick();
                  }}
                />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BetAccordion;
