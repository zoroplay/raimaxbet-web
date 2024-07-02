"use client";
import React, { useState } from "react";
import "./BetBonusAccordion.scss";
import { PortTableBonus } from "@/_components";
import { BiChevronDown } from "react-icons/bi";

interface BonusHistoryProps {
  data?: any;
}

const BetBonusAccordion = ({ data }: BonusHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(data, "dt");
  return (
    <div className={`acc_bb_wrap ${isOpen && "active_b_acc"}`}>
      <div className="acc_bb_top between" onClick={() => setIsOpen(!isOpen)}>
        <div className="acc_bb_title center">
          <div className={`acc_bb_title_icon ${isOpen && "active_icon"}`}>
            <BiChevronDown />
          </div>
          <div>Sport Bonus</div>
        </div>
        <div className="acc_bb_title">Finished</div>
      </div>
      <div className="acc_bb_bold">Bonus Sport Withdrawal</div>
      <div className="acc_bb_text">
        Bets must be placed on events that will be settled BEFORE the bonus
        expires. Once the wagering has been completed, please ensure to redeem
        your bonus balance before the expiry date
      </div>
      <div className="turnover_text center">
        {data?.rolledAmount}/{data?.pendingAmount}
      </div>
      <div className="bonus_read center">
        <span style={{ zIndex: 1 }}>
          {(data?.rolledAmount / data?.pendingAmount) * 100}%
        </span>

        <div
          className="bonus_read_bar"
          style={{
            width: `${(data?.rolledAmount / data?.pendingAmount) * 100}%`,
          }}
        />
      </div>
      <PortTableBonus transactions={data.transactions} />
    </div>
  );
};

export default BetBonusAccordion;
