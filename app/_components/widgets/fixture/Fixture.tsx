"use client";
import React, { useState, useEffect, useRef } from "react";
import "./Fixture.scss";
import "../../../iconstwo.css";
import {
  useFavouriteMutation,
  useGetUpcomingQuery,
} from "@/_services/sport.service";
import { useAppDispatch, useAppSelector, useTimer } from "@/_hooks";
import { createID, isSelected, sortArr } from "@/_utils/helpers";
import { AiOutlineStar, AiOutlineRight } from "react-icons/ai";
import Link from "next/link";
import { dayMonth, rtkMutation, slugify } from "@/_utils";
import { addToCoupon, removeFromCoupon } from "@/_redux/slices/betslip.slice";
import { MdOutlineStar } from "react-icons/md";
import { BiChevronDown } from "react-icons/bi";
import { FaLock } from "react-icons/fa";
import Image from "next/image";
import { badge } from "@/_assets";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

const Fixture = ({
  data,
  market,
  specifiers,
  specifier,
  type,
  marketSingle,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [homeUrl, setHomeUrl] = useState(
    `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/teams%2F${encodeURIComponent(
      data?.homeTeam?.toUpperCase()
    )}.png?alt=media&token=cf18d76b-5a82-486b-9b99-7ddee49c25f9`
  );
  const [awayUrl, setAwayUrl] = useState(
    `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/teams%2F${encodeURIComponent(
      data?.awayTeam?.toUpperCase()
    )}.png?alt=media&token=cf18d76b-5a82-486b-9b99-7ddee49c25f9`
  );

  const number = data?.outcomes?.length;
  const itemList = Array.from({ length: number }, (_, index) => index + 1);
  const [outcomes, setOutcomes] = useState<any>([]);
  const [outcomesSingle, setOutcomesSingle] = useState<any>([]);
  const [isFav, setIsFav] = useState<boolean>(false);
  const [activeSpecifier, setActiveSpecifier] = useState<any>(1.5);
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const { user, token } = useAppSelector((state) => state.user);
  const variables = useAppSelector((state) => state.sport);

  const dropRef = useRef<HTMLDivElement>(null);

  const [favourite, { isLoading, isSuccess, isError }] = useFavouriteMutation();

  const { data: favouriteData } = useGetUpcomingQuery({
    sid: 1,
    type: "upcoming",
    page: 1,
    favourite: 1,
    userId: user?.id,
  });

  useEffect(() => {
    favouriteData?.fixtures?.forEach((fixture: any) => {
      if (fixture?.homeTeam === data?.homeTeam) {
        setIsFav(true);
      } else if (fixture?.awayTeam === data?.awayTeam) {
        setIsFav(true);
      }
    });
  }, [favouriteData]);

  useEffect(() => {
    setHomeUrl(
      `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/teams%2F${encodeURIComponent(
        data?.homeTeam?.toUpperCase()
      )}.png?alt=media&token=cf18d76b-5a82-486b-9b99-7ddee49c25f9`
    );
    setAwayUrl(
      `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/teams%2F${encodeURIComponent(
        data?.awayTeam?.toUpperCase()
      )}.png?alt=media&token=cf18d76b-5a82-486b-9b99-7ddee49c25f9`
    );
  }, [data]);

  const handleError = (type: string) => {
    type === "home" ? setHomeUrl(badge) : setAwayUrl(badge);
  };

  // console.log(
  //   marketSingle?.outcomes?.length,
  //   market?.outcomes?.length,
  //   "single"
  // );

  useEffect(() => {
    // find outcomes for selected market
    if ((market || marketSingle) && data?.activeMarkets > 0) {
      setOutcomes([]);
      if (data.outcomes) {
        const odds = data.outcomes;
        let filtered =
          market &&
          odds.filter(
            (item: any) => item.marketID === parseInt(market.marketID)
          );
        let filteredSingle =
          marketSingle &&
          odds.filter(
            (item: any) => item.marketID === parseInt(marketSingle.marketID)
          );
        if (market?.specifier && market?.specifier !== "") {
          let defaultSpecifier = filtered[0]?.specifier;
          if (defaultSpecifier) {
            filtered = filtered.filter(
              (item: any) => item.specifier === defaultSpecifier
            );
            setActiveSpecifier(defaultSpecifier.split("=")[1]);
          }
        }
        if (filtered?.length) {
          setOutcomes(sortArr(filtered, "outcomeID"));
        }
        if (filteredSingle?.length) {
          setOutcomesSingle(sortArr(filteredSingle, "outcomeID"));
        }
      }
    }
  }, [data, market, marketSingle]);

  // console.log(marketSingle, "single");

  useEffect(() => {
    if (specifier !== "") changeSpecifier(specifier);
  }, [specifier]);

  const changeSpecifier = (spec: any) => {
    setIsOpen(false);
    setActiveSpecifier(spec.value);

    if (data.outcomes) {
      const odds = data.outcomes;
      let filtered = odds.filter(
        (item: any) => item.marketID === parseInt(market.marketID)
      );
      filtered = filtered.filter(
        (item: any) => item.specifier === spec.specifier
      );
      setOutcomes(filtered);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // console.log(outcomes, "out");
  return (
    <div className="fixture start">
      <div className="fixture_timeevent_wrap between">
        <div className="fixture_time_wrap center col">
          <div
            className={` ${
              type === "live" ? "fixture_time_live" : "fixture_time_txt"
            }`}
          >
            {type === "live"
              ? data?.eventTime === "--:--"
                ? ""
                : data?.eventTime
              : dayMonth(data?.date)}
          </div>
          <div
            className={` center
                  ${
                    type === "live"
                      ? "fixture_time_live_status"
                      : "fixture_time_txt"
                  }
              `}
          >
            {type === "live" ? data?.matchStatus : data?.eventTime}
          </div>
        </div>
        <div
          className="fixture_event_wrap start"
          onClick={() => {
            dispatch(updateFixtures({ name: "single", info: [data?.matchID] }));
          }}
        >
          <div className="center">
            <div className="fixture_event">{data?.homeTeam?.toUpperCase()}</div>
            {type !== "live" && (
              <div className="team_logo_wrap">
                <Image
                  src={homeUrl}
                  alt="logo"
                  fill
                  className="team_logo"
                  onError={() => handleError("home")}
                />
              </div>
            )}
            {type === "live" && (
              <div className="fixture_score center">{data?.homeScore}</div>
            )}
          </div>
          <div
            className="vs center"
            style={{ color: type === "live" ? "black" : "" }}
          >
            VS
          </div>
          <div className="center">
            {type !== "live" && (
              <div className="team_logo_wrap">
                <Image
                  src={awayUrl}
                  alt="logo"
                  fill
                  className="team_logo"
                  onError={() => handleError("away")}
                />
              </div>
            )}
            {type === "live" && (
              <div className="fixture_score center">{data?.awayScore}</div>
            )}
            <div className="fixture_event_right">
              {data?.awayTeam?.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="fixture_sta_wrap between">
          <div
            className="fixture_sta_icon center"
            onClick={() => {
              setIsFav(!isFav);
              !isFav
                ? rtkMutation(favourite, {
                    userId: user?.id,
                    competitor1: data?.homeTeamID,
                    competitor2: data?.awayTeamID,
                  })
                : rtkMutation(favourite, {
                    userId: user?.id,
                    competitor1: data?.homeTeamID,
                    competitor2: data?.awayTeamID,
                    action: "remove",
                  });
            }}
          >
            {!isFav ? (
              <AiOutlineStar />
            ) : (
              <div className="star_wrap">
                <div className="star_wrap_item">
                  <MdOutlineStar />
                </div>
                <div
                  className={`star_wrap_item ${isFav && "star_wrap_item_anim"}`}
                >
                  <MdOutlineStar />
                </div>
              </div>
            )}
          </div>
          <div
            className="fixture_btm_icon center"
            onClick={() =>
              window.open(
                `https://s5.sir.sportradar.com/betradar/en/match/${data?.matchID}`,
                "stats",
                "width=1078,height=768"
              )
            }
            style={{ zIndex: 2 }}
          >
            <span className="sbe-sb-mb-event-statistics">
              <a className="sbe-app-statistics" style={{ zIndex: 2 }}></a>
            </span>
          </div>
        </div>
      </div>

      {/* Odds */}

      <div className="fixture_odds_wrap start">
        <div
          className="odds_wrap start"
          style={{ width: !market ? "90%" : "" }}
        >
          <div className="start odds_con_itm">
            {outcomesSingle?.length > 1 ? (
              outcomesSingle?.map((odd: any, idx: number) => {
                const id = createID(
                  data?.gameID,
                  data?.matchID,
                  odd?.outcomeName,
                  odd?.oddID,
                  odd?.marketID
                );
                return (
                  <div
                    key={idx}
                    className={`odds_item center ${
                      isSelected(slips, id) && "acive_odd_item"
                    }
                      ${odd.oddsChangeUp ? "oddsIncrease" : ""} ${
                      odd.oddsChangeDown ? "oddsDecrease" : ""
                    }
                      `}
                    style={{
                      width: `${100 / marketSingle?.outcomes?.length}%`,
                      fontSize:
                        market?.specifier !== "" || data?.odds?.length > 3
                          ? "12px"
                          : "",
                    }}
                    onClick={() => {
                      isSelected(slips, id)
                        ? dispatch(
                            removeFromCoupon({
                              id,
                              globalVars: variables.SportsbookGlobalVariable,
                            })
                          )
                        : odd?.odds > 1 &&
                          dispatch(
                            addToCoupon({
                              fixture: data,
                              market_name: marketSingle.marketName,
                              market_id: marketSingle.marketID,
                              id,
                              outcome: odd,
                              type,
                              specifier: odd.specifier,
                              sport: variables.SportsbookGlobalVariable,
                            })
                          );
                    }}
                  >
                    {odd?.odds > 0 && odd?.odds !== 1 && odd?.active === 1 ? (
                      odd?.odds.toFixed(2)
                    ) : (
                      <div className="odds_item_lock">
                        <FaLock />
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="start odds_con_itm">
                {marketSingle?.outcomes?.map((item: any, idx: number) => (
                  <div
                    key={idx}
                    className="odds_item center"
                    style={{
                      width: `${100 / marketSingle?.outcomes?.length}%`,
                      height: "35px",
                    }}
                  >
                    <div className="odds_item_lock">
                      <FaLock />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {market && (
          <div
            className="odds_wrap start"
            style={{ borderLeft: "4px solid #f3f1f1" }}
          >
            <div className="start odds_con_itm">
              {market?.specifier && market?.specifier !== "" && (
                <div
                  className="center selector_wrap"
                  style={{
                    width: `${
                      outcomes?.length < 1
                        ? 100 / market?.outcomes?.length
                        : 100 / (market?.outcomes?.length + 1)
                    }%`,
                    fontSize: market?.specifier !== "" ? "12px" : "",
                  }}
                >
                  <div
                    className="center selected"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>{activeSpecifier}</span>
                    <span>
                      <BiChevronDown />
                    </span>
                  </div>
                  {isOpen && (
                    <div className="selector_items" ref={dropRef}>
                      {specifiers.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={`selector_item center ${
                            activeSpecifier === item.value && "activ"
                          }`}
                          onClick={() => changeSpecifier(item)}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {outcomes?.length > 1 ? (
                outcomes?.map((odd: any, idx: number) => {
                  const id = createID(
                    data?.gameID,
                    data?.matchID,
                    odd?.outcomeName,
                    odd?.oddID,
                    odd?.marketID
                  );
                  return (
                    <div
                      key={idx}
                      className={`odds_item center ${
                        isSelected(slips, id) && "acive_odd_item"
                      }
                      ${odd.oddsChangeUp ? "oddsIncrease" : ""} ${
                        odd.oddsChangeDown ? "oddsDecrease" : ""
                      }
                      `}
                      style={{
                        border:
                          idx === market?.outcomes?.length - 1 ? "none" : "",
                        width: `${
                          100 /
                          (market?.outcomes?.length +
                            parseInt(market?.specifier !== "" ? "1" : "0"))
                        }%`,
                        fontSize:
                          market?.specifier !== "" || data?.odds?.length > 3
                            ? "12px"
                            : "",
                      }}
                      onClick={() => {
                        isSelected(slips, id)
                          ? dispatch(
                              removeFromCoupon({
                                id,
                                globalVars: variables.SportsbookGlobalVariable,
                              })
                            )
                          : odd?.odds > 1 &&
                            dispatch(
                              addToCoupon({
                                fixture: data,
                                market_name: market.marketName,
                                market_id: market.marketID,
                                id,
                                outcome: odd,
                                type,
                                specifier: odd.specifier,
                                sport: variables.SportsbookGlobalVariable,
                              })
                            );
                      }}
                    >
                      {odd?.odds > 0 && odd?.odds !== 1 && odd?.active === 1 ? (
                        odd?.odds.toFixed(2)
                      ) : (
                        <div className="odds_item_lock">
                          <FaLock />
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="start odds_con_itm">
                  {market?.outcomes?.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="odds_item center"
                      style={{
                        width: `${100 / market?.outcomes?.length}%`,
                        border:
                          idx === market?.outcomes?.length - 1 ? "none" : "",
                        height: "35px",
                      }}
                    >
                      <div className="odds_item_lock">
                        <FaLock />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className="odds_market center col"
          onClick={() => {
            dispatch(updateFixtures({ name: "single", info: [data?.matchID] }));
          }}
        >
          <div className="odds_market_txt">+{data?.activeMarkets}</div>
          <div className="odds_market_icon center">
            <span className="sbe-sb-mb-event-cashout">
              <i className="sbe-app-cash"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fixture;
