import React from "react";
import "./BetMetreBar.scss";
import { useAppSelector } from "@/_hooks";

const BetMetreBar = () => {
  const { coupon } = useAppSelector((state) => state.betslip);
  const slips = coupon.selections;

  return (
    <div className="betmetre_read center">
      <span style={{ zIndex: 1 }}>Add more selections to boost your bonus</span>
      <div
        className="betmetre_read_bar"
        style={{ width: `${(slips.length / 50) * 100}%` }}
      />
    </div>
  );
};

export default BetMetreBar;
