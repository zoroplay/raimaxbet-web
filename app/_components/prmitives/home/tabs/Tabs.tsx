"use client";
import React, { useState } from "react";
import "./Tabs.scss";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

const list = ["LIVE MATCHES", "HIGHLIGHTS", "TODAY'S MATCHES"];

const Tabs = () => {
  const [active, setActive] = useState("TODAY'S MATCHES");
  const dispatch = useAppDispatch();
  const { currentFixtureTab } = useAppSelector((state) => state.fixtures);
  const returnItem = (item: string) => {
    return item === "LIVE MATCHES"
      ? "live"
      : item === "HIGHLIGHTS"
      ? "highlights"
      : "today";
  };
  return (
    <div className="tabs between">
      <div className="tabs_items start">
        {list.map((item: string, idx: number) => (
          <div
            key={idx}
            className={`tabs_item ${
              currentFixtureTab.name === returnItem(item) && "active"
            }`}
            onClick={() => {
              setActive(item);
              item === "HIGHLIGHTS"
                ? dispatch(updateFixtures({ name: "highlights" }))
                : item === "TODAY'S MATCHES"
                ? dispatch(updateFixtures({ name: "today" }))
                : dispatch(updateFixtures({ name: "live" }));
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <div className="tabs_option">
        <select className="tabs_select">
          <option className="tabs_select_item" value="">
            Decimal
          </option>
          <option className="tabs_select_item" value="">
            Fractional
          </option>
          <option className="tabs_select_item" value="">
            American
          </option>
        </select>
      </div>
    </div>
  );
};

export default Tabs;
