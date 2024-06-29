"use client";
import React, { useState, useEffect } from "react";
import "./MyBetsBlock.scss";
import { PlacedBets, SelectTab, SettledBets } from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";

const tab = ["PLACED", "SETTLED"];

const MyBetsBlock = () => {
  const [current, setCurrent] = useState<string>("PLACED");

  const { token } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const Component = {
    PLACED: <PlacedBets />,
    SETTLED: <SettledBets />,
  }[current];

  useEffect(() => {
    token === null && dispatch(closeComponentModal());
  }, [token]);

  return (
    <div className="mybets">
      {/* <BreadCrumb title="My bets" /> */}
      <SelectTab
        tabs={tab}
        current={current}
        setCurrent={setCurrent}
        className="mybets_tabs"
      />
      {Component}
    </div>
  );
};

export default MyBetsBlock;
