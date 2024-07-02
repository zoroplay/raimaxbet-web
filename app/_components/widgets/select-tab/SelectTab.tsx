"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import "./SelectTab.scss";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/_hooks";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

interface SelectTabProps {
  tabs: string[];
  className?: string;
  current: string | null;
  setCurrent: Dispatch<SetStateAction<string>>;
}

const SelectTab = ({
  tabs,
  className,
  current,
  setCurrent,
}: SelectTabProps) => {
  const dispatch = useAppDispatch();
  return (
    <div className={`select_tab between ${className}`}>
      {tabs.map((item, idx) => (
        <div
          className={`select_tab_item center  ${current === item && "active"}`}
          key={idx}
          onClick={() => {
            setCurrent(item);
            item === "LIVE BETTING" &&
              dispatch(updateFixtures({ name: "live" }));
            item === "BETTING" &&
              dispatch(updateFixtures({ name: "highlights" }));
          }}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default SelectTab;
