"use client";
import React, { useState } from "react";
import "./MyBetsModal.scss";
import { PlacedBets, SelectTab, SettledBets } from "@/_components";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";
import { HiMiniXMark } from "react-icons/hi2";

const tab = ["PLACED", "SETTLED"];

const MyBetsModal = () => {
  const [current, setCurrent] = useState<string>("PLACED");
  const Component = {
    PLACED: <PlacedBets />,
    SETTLED: <SettledBets />,
  }[current];
  const dispatch = useAppDispatch();
  return (
    <div className="mybets">
      <div
        className="mybets_close"
        onClick={() => dispatch(closeComponentModal())}
      >
        <HiMiniXMark />
      </div>
      <div className="mybets_wrap">
        <SelectTab
          tabs={tab}
          current={current}
          setCurrent={setCurrent}
          className="mybets_tabs"
        />
        {Component}
      </div>
    </div>
  );
};

export default MyBetsModal;
