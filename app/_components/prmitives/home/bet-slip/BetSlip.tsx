"use client";
import React, { useState, SetStateAction, Dispatch, useEffect } from "react";
import "./BetSlip.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";
import { BsCheck } from "react-icons/bs";
import { IoIosCheckmark } from "react-icons/io";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { MdOutlineStickyNote2 } from "react-icons/md";
import { BiChevronDown } from "react-icons/bi";
import { HiMiniXMark } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import {
  deleteAllFromCoupon,
  removeFromCoupon,
  setBetType,
  updateCoupon,
  updateWinnings,
} from "@/_redux/slices/betslip.slice";
import {
  useFindWithBetslipMutation,
  useFindWithCodeQuery,
} from "@/_services/bet.service";
import { BetMetreBar, Empty } from "@/_components";
import { formatNumber, multibetCombination } from "@/_utils/helpers";
import { rtkMutation, slugify } from "@/_utils";
import { modalStateFalse, openModal } from "@/_redux/slices/modal.slice";
import { SystemBet } from "./SystemBet";
import Link from "next/link";
import { PlaceBetModal } from "@/_components";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

interface BetSlipProp {
  setIsBetSlip: Dispatch<SetStateAction<boolean>>;
}

const BetSlip = () => {
  const [accept, setAccept] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFirstMount, setIsFirstMount] = useState(true);
  const [isChecked, setIsChecked] = useState(false);

  const { coupon, sportsbookBonusList } = useAppSelector(
    (state) => state.betslip
  );
  const { token, user } = useAppSelector((state) => state.user);
  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);
  const isPlaceBetModal = useAppSelector(
    (state) => state.modal?.globalModalState?.placebet
  );
  const dispatch = useAppDispatch();

  const currency = SportsbookGlobalVariable
    ? SportsbookGlobalVariable.Currency
    : process.env.NEXT_PUBLIC_CURRENCY;

  const [stake, setStake] = useState(coupon.stake);

  const slips = coupon.selections;

  // const shouldQueryFire =
  // search !== undefined && isClicked && search.length > 5;

  const [
    findWithBetSlip,
    {
      data: withBetslipData,
      isLoading: isLoadingFind,
      isSuccess: isSuccessFind,
    },
  ] = useFindWithBetslipMutation();

  const handleStakeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStake(e.target.value);
    dispatch(
      updateWinnings({
        stake: e.target.value,
        globalVars: SportsbookGlobalVariable,
        id: e.target.id,
      })
    );
  };

  useEffect(() => {
    !isFirstMount &&
      setTimeout(() => {
        withBetslipData?.status &&
          withBetslipData?.bet?.selections &&
          dispatch(
            updateCoupon({
              ...withBetslipData?.bet,
              globalVars: SportsbookGlobalVariable,
            })
          );
        withBetslipData?.status === false &&
          dispatch(
            openModal({
              title: "Not Found",
              message: withBetslipData?.message,
            })
          );
      }, 1500);
  }, [isSuccessFind]);

  useEffect(() => {
    if (!isFirstMount) {
      dispatch(updateWinnings({ stake, globalVars: SportsbookGlobalVariable }));
    }
    setIsFirstMount(false);
  }, [stake, dispatch]);

  return (
    <>
      <div className="bet_slip end">
        <div
          className="bet_slip_container"
          style={{ paddingBottom: slips?.length >= 1 ? "" : "0px" }}
        >
          <div
            className="bet_slip_wrap"
            style={{ paddingBottom: coupon.maxBonus > 0 ? "67px" : "50px" }}
          >
            {/* Header */}
            <div className="bet_slip_head between">
              <div className="bet_slip_head_text">BETSLIP</div>
              {slips?.length >= 1 ? (
                <div className="start">
                  <div
                    className="bet_slip_head_icon"
                    onClick={() => setIsSearchOpen(!isSearchOpen)}
                  >
                    <BiSearch />
                  </div>
                  <div
                    className="bet_slip_head_icon"
                    onClick={() => dispatch(deleteAllFromCoupon())}
                  >
                    <RiDeleteBin6Line />
                  </div>
                </div>
              ) : (
                <div style={{ width: "10%" }}></div>
              )}
            </div>
            {(slips?.length < 1 || isSearchOpen) && (
              <div className="search between">
                <div className="search_wrap">
                  <input
                    className="search_input"
                    placeholder="Booking code or betslip code"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div
                  className="search_input_text center"
                  onClick={() => {
                    rtkMutation(findWithBetSlip, search);
                  }}
                >
                  FIND
                </div>
              </div>
            )}
            {/* Accept Changes */}
            {slips?.length >= 1 && (
              <div className="accept between">
                <div className="accept_text">Accept Changes</div>
                <div
                  className={`inactive_switch ${accept && "active_switch"}`}
                  onClick={() => setAccept(!accept)}
                >
                  <div className="switch_tick center">
                    <IoIosCheckmark />
                  </div>
                </div>
              </div>
            )}
            {/* Bet Tabs */}
            {slips?.length > 1 && (
              <div className="bet_slip_tab between">
                {["Single", "Multiple", "Combo"].map((item) => (
                  <div
                    key={item}
                    className={`bet_slip_tab_item center ${
                      coupon.betslip_type === item && "active_tab"
                    }`}
                    onClick={() => {
                      dispatch(setBetType(item));
                      // setValueSingle(0);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
            {/* Multi bets */}
            {coupon.betslip_type !== "Combo" && slips?.length > 0 && (
              <div className="bet_slip_multi between">
                <div className="bet_slip_multi_text">
                  {coupon.bet_type === "Single"
                    ? `Stake per bet (${multibetCombination(slips)} bets)`
                    : multibetCombination(slips)}
                </div>
                <div className="input_stake start">
                  <div className="bet_slip_multi_text">
                    {coupon.bet_type === "Single" ? currency : coupon.totalOdds}
                  </div>
                  <div className="input_stake_wrap">
                    <input
                      className="input_stake"
                      placeholder="Stake"
                      value={coupon.stake}
                      type="number"
                      id="all"
                      onFocus={(e) => e.target.select()}
                      onChange={handleStakeChange}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* Combi bets */}
            {coupon.betslip_type === "Combo" && (
              <SystemBet
                coupon={coupon}
                dispatch={dispatch}
                SportsbookBonusList={sportsbookBonusList}
              />
            )}
            {/* Slip Items */}
            {slips?.length >= 1 ? (
              <div className="slip_item_wrap">
                <div className="slip_item_selection">
                  {slips.length + " selections"}
                </div>
                {slips?.map((item: any, idx: number) => (
                  <div className="slip_item" key={idx}>
                    <div className="slip_item_win_draw between">
                      <div className="slip_item_team start">
                        <div
                          className="slip_item_team_icon"
                          onClick={() =>
                            dispatch(
                              removeFromCoupon({
                                id: item.selectionId,
                                globalVars: SportsbookGlobalVariable,
                              })
                            )
                          }
                        >
                          <HiMiniXMark />
                        </div>
                        <div className="slip_item_team_name">
                          {item.outcomeName}
                        </div>
                      </div>
                      <div className="input_stake start">
                        <div className="input_stake_text">
                          {parseFloat(item.odds).toFixed(2)}
                        </div>
                        {coupon.betslip_type === "Single" && (
                          <div className="input_stake_wrap">
                            <input
                              className="input_stake"
                              placeholder="Stake"
                              value={item.stake}
                              id={item.selectionId}
                              onFocus={(e) => e.target.select()}
                              onChange={handleStakeChange}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="slip_item_odd">{item?.marketName}</div>
                    <div
                      // href={`/fixture/${slugify(item?.sport)}/${slugify(
                      //   item?.tournament
                      // )}/${slugify(item?.event_name)}/${item?.matchId}`}
                      className="slip_item_teams"
                      onClick={() => {
                        dispatch(
                          updateFixtures({
                            name: "single",
                            info: [item?.matchId],
                          })
                        );
                      }}
                    >
                      {item?.eventName?.replace("-", "vs")}
                    </div>
                    {coupon.betslip_type === "Combo" && (
                      <div className="slip_item_check_wrap start">
                        <div className="slip_item_check center">
                          <BsCheck />
                        </div>
                        <div className="slip_item_check_text">
                          BetSlip.Banker
                        </div>
                      </div>
                    )}
                    {/* {currentTab === "Combi" && (
                    <div className="slip_item_check_wrap start">
                      <div className="slip_item_check center">
                        <BsCheck />
                      </div>
                      <div className="slip_item_check_text">BetSlip.Banker</div>
                    </div>
                  )} */}
                  </div>
                ))}

                {coupon.bet_type !== "Single" && (
                  <div className="book_slip_info">
                    <div className=" between">
                      <div className="metre_bar_text">Total Odds</div>
                      <div className="metre_bar_text1">
                        {/* {coupon.minOdds &&
                          coupon.minOdds > 0 &&
                          `${coupon.minOdds} ~ `} */}
                        {coupon.totalOdds}
                      </div>
                    </div>
                    <div className="metre_bar_wrap_text between">
                      <div className="metre_bar_text">Total Bonus</div>
                      <div className="metre_bar_text1">
                        {coupon.betslip_type === "Combo"
                          ? `${formatNumber(coupon.minBonus)} /`
                          : ""}{" "}
                        {formatNumber(coupon.maxBonus)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty_slip">
                <Empty
                  title="Empty betslip"
                  subTitle="Click on add odd to select it"
                  icon={<MdOutlineStickyNote2 />}
                />
              </div>
            )}
          </div>
          {/* Book */}
          {slips?.length >= 1 && (
            <div className="book_slip_wrap end col">
              {coupon.maxBonus > 0 && (
                <div className="metre_bar_wrap" style={{ width: "100%" }}>
                  <BetMetreBar />
                </div>
              )}
              <div className="book_slip start">
                {/* Use bonus */}
                {slips.length > 1 && user?.sportBonusBalance > 0 && (
                  <div className="use_bonus center col">
                    <input
                      type="checkbox"
                      className="input_bonus"
                      checked={coupon.useBonus}
                      onChange={() => {
                        const payload = { ...coupon };
                        setIsChecked(!isChecked);
                        isChecked
                          ? (payload.useBonus = false)
                          : (payload.useBonus = true);
                        dispatch(updateCoupon(payload));
                      }}
                    />
                    <div className="use_bonus_text">Use Bonus</div>
                  </div>
                )}
                {coupon.totalStake > 0 ? (
                  <div
                    className="book_slip_value_wrap center col"
                    onClick={() => {
                      token
                        ? dispatch(openModal({ modalState: "placebet" }))
                        : dispatch(openModal({ component: "LoginModal" }));
                      // token && setShowLoading(true);
                    }}
                    style={{
                      borderLeft: user?.sportBonusBalance ? "" : "none",
                    }}
                  >
                    <div className="book_slip_value_bold">
                      {`PLACE BETS ${currency}${formatNumber(
                        coupon.totalStake
                      )}`}
                    </div>
                    <div className="book_slip_value_text">
                      Possible winnings{" "}
                      {coupon.betslip_type === "Single" &&
                        `${currency}${formatNumber(coupon.minWin)} ~ `}
                      {currency}
                      {formatNumber(coupon.maxWin)}
                    </div>
                  </div>
                ) : (
                  <div className="book_slip_text center">
                    {"Please set a stake"}
                  </div>
                )}
                <div
                  className="book_slip_book center col"
                  onClick={() =>
                    dispatch(openModal({ component: "BookBetslip" }))
                  }
                >
                  <div className="book_slip_icon">
                    <BsFillBookmarkCheckFill />
                  </div>
                  <div className="book_slip_book_text">Book</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {isPlaceBetModal && slips.length > 0 && <PlaceBetModal />}
    </>
  );
};

export default BetSlip;
