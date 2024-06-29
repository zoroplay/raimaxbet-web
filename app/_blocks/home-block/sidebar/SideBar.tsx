"use client";
import React, { useState } from "react";
import "./SideBar.scss";
import { Favourites, Search, SelectTab, Sports } from "@/_components";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface SideBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const tabs = ["BETTING", "LIVE BETTING"];
const SideBar = ({ setIsOpen, isOpen }: SideBarProps) => {
  const [current, setCurrent] = useState("BETTING");
  return (
    <div className="side_bar">
      <div className="start side_bar_tabs">
        <SelectTab
          setCurrent={setCurrent}
          current={current}
          tabs={tabs}
          className="side_bar_tab"
        />
        <div
          className={`home_side_toggle center ${false && "home_toggle_full"}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <div>
              <IoIosArrowForward />
            </div>
          ) : (
            <div>
              <IoIosArrowBack />
            </div>
          )}
        </div>
      </div>
      <div className="side_bar_search">
        <Search />
      </div>
      <div>
        <Favourites />
      </div>
      <div>
        <Sports />
      </div>
    </div>
  );
};

export default SideBar;
