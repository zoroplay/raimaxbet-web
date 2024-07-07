"use client";
import React, { useState } from "react";
import "./GroupedMarket.scss";
import { createID, isSelected } from "@/_utils/helpers";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { addToCoupon, removeFromCoupon } from "@/_redux/slices/betslip.slice";
import { FaLock } from "react-icons/fa";
import { FaCaretDown } from "react-icons/fa";

interface GroupedMarketProp {
  data: any;
  allData: any;
  type: number;
}

const GroupedMarket: React.FC<GroupedMarketProp> = ({
  data,
  type,
  allData,
}): React.JSX.Element => {
  const [open, setIsOpen] = useState(true);
  const slips = useAppSelector((state) => state.betslip);
  const variables = useAppSelector((state) => state.sport);
  const dispatch = useAppDispatch();

  return (
    <div className="single_mark_wrap">
      <div className="market_name_sing left" onClick={() => setIsOpen(!open)}>
        <span>
          <FaCaretDown
            style={{ transform: open ? "rotate(0deg)" : "rotate(180deg)" }}
          />
        </span>
        <span>{data[0]?.marketName}</span>
      </div>
      {open &&
        data?.map((item: any, idx: number) => (
          <div key={idx + item?.marketName} className={`table_item_single`}>
            <div className="table_odd_wrap">
              <div className="odds_wrap">
                <div
                  className={`start ${
                    item?.outcomes?.length > 3 ? "grid" : "odds_con_itm"
                  }`}
                >
                  {item?.specifier && item?.specifier !== "" && (
                    <div
                      className="center selector_wrap"
                      style={{
                        width: `${
                          item?.outcomes?.length > 3
                            ? "100px"
                            : 100 / (item?.outcomes?.length + 1)
                        }%`,

                        fontSize: item?.specifier !== "" ? "12px" : "",
                      }}
                    >
                      <div
                        className="center selected"
                        // onClick={() => setIsOpen(true)}
                      >
                        <span>{item?.specifier.split("=")[1]}</span>
                        {/* <span>
                      <BiChevronDown />
                    </span> */}
                      </div>
                      {/* {isOpen && (
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
                  )} */}
                    </div>
                  )}
                  {item?.outcomes?.length > 1 ? (
                    item?.outcomes?.map((odd: any, idx: number) => {
                      const id = createID(
                        allData?.gameID,
                        allData?.matchID,
                        odd?.outcomeName,
                        odd?.oddID,
                        odd?.marketID
                      );
                      return (
                        <div
                          key={idx}
                          className={`odds_item center ${
                            isSelected(slips, id) &&
                            item?.outcomes?.length - 1 === idx
                              ? "acive_odd_item2"
                              : isSelected(slips, id) &&
                                0 === idx &&
                                item?.specifier !== ""
                              ? "acive_odd_item"
                              : isSelected(slips, id) && 0 === idx
                              ? "acive_odd_item1"
                              : isSelected(slips, id)
                              ? "acive_odd_item"
                              : ""
                          }
                      ${odd.oddsChangeUp ? "oddsIncrease" : ""} ${
                            odd.oddsChangeDown ? "oddsDecrease" : ""
                          }
                      `}
                          style={{
                            border:
                              idx === item?.outcomes?.length - 1 ? "none" : "",
                            width: `${
                              item?.outcomes?.length > 3
                                ? "100px"
                                : 100 /
                                  (item?.outcomes?.length +
                                    parseInt(
                                      item?.specifier !== "" ? "1" : "0"
                                    ))
                            }%`,
                            fontSize:
                              item?.specifier !== "" || data?.odds?.length > 3
                                ? "12px"
                                : "",
                          }}
                          onClick={() => {
                            isSelected(slips, id)
                              ? dispatch(
                                  removeFromCoupon({
                                    id,
                                    globalVars:
                                      variables.SportsbookGlobalVariable,
                                  })
                                )
                              : odd?.odds > 1 &&
                                dispatch(
                                  addToCoupon({
                                    fixture: allData,
                                    market_name: item?.marketName,
                                    market_id: item?.marketID,
                                    id,
                                    outcome: odd,
                                    type,
                                    specifier: item.specifier,
                                    sport: variables.SportsbookGlobalVariable,
                                  })
                                );
                          }}
                        >
                          {odd?.odds > 0 && odd?.odds !== 1 ? (
                            <div className="center col">
                              <div className="market_item_odd_valueText">
                                {odd?.outcomeName}
                              </div>
                              <div>{odd?.odds.toFixed(2)}</div>
                            </div>
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
                      {item?.outcomes?.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="odds_item center"
                          style={{
                            width: `${100 / item?.outcomes?.length}%`,
                            border:
                              idx === item?.outcomes?.length - 1 ? "none" : "",
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default GroupedMarket;
