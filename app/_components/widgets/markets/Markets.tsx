"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Markets.scss";
import { BiChevronDown } from "react-icons/bi";

interface MarketsProps {
  outcomes?: any;
  outcomesSingle: any;
  marketSpecifier: string;
  activeSpecifier: any;
  specifiers: string[];
  changeSpecifier: (specifier: string) => void;
}

const Markets = ({
  outcomes,
  outcomesSingle,
  marketSpecifier,
  activeSpecifier,
  specifiers,
  changeSpecifier,
}: MarketsProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="pre_market start">
      <div className="start pre_market_texts">
        {/* <div className="pre_market_text">MATCH CODE</div> */}
        <div className="pre_market_text">TIME</div>
        <div className="pre_market_text">EVENT</div>
      </div>
      <div className="pre_market_items start">
        <div
          className="pre_market_item center"
          style={{ width: !outcomes ? "90%" : "" }}
        >
          {outcomesSingle?.map((item: any, idx: number) => (
            <div
              className="pre_market_name center"
              key={idx}
              style={{
                width: 100 / outcomes?.length + "%",
              }}
            >
              {item?.outcomeName}
            </div>
          ))}
        </div>
        {outcomes && (
          <div className="pre_market_item center">
            <div className="pre_market_name center">
              {marketSpecifier === "total" ? (
                <div
                  className="center selector_pre_wrap"
                  style={{
                    width: `${100 / (outcomes?.length + 1)}%`,
                  }}
                >
                  <div
                    className="center selected"
                    onClick={() => setIsOpen(true)}
                  >
                    <span>{activeSpecifier.value || "Goals"}</span>
                    <span>
                      <BiChevronDown />
                    </span>
                  </div>
                  {isOpen && (
                    <div className="selector_pre_items" ref={dropdownRef}>
                      {specifiers.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className={`selector_pre_item center ${
                            activeSpecifier.specifier === item.specifier &&
                            "activ"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            changeSpecifier(item);
                          }}
                        >
                          {item.value}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : marketSpecifier === "hcp" ? (
                <div
                  className="pre_market_name center"
                  style={{
                    width: `${100 / (outcomes?.length + 1)}%`,
                  }}
                >
                  HC
                </div>
              ) : (
                <></>
              )}

              {outcomes?.map((item: any, idx: number) => (
                <div
                  className="pre_market_name center"
                  key={idx}
                  style={{
                    width:
                      marketSpecifier !== ""
                        ? `${100 / (outcomes?.length + 1)}%`
                        : `${100 / outcomes?.length}%`,
                  }}
                >
                  {item?.outcomeName}
                </div>
              ))}
            </div>
            {/* </div> */}
          </div>
        )}
        <div className="more">MORE</div>
      </div>
    </div>
  );
};

export default Markets;
