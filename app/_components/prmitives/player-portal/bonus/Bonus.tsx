"use client";
import React, { useEffect, useState } from "react";
import "./Bonus.scss";
import { PortTableBonus } from "../..";
import { BetBonusAccordion } from "@/_components";
import { useGetUserBonusQuery } from "@/_services/bonus.service";
import { useAppSelector } from "@/_hooks";
import { formatNumber } from "@/_utils/helpers";

const Bonus = () => {
  const [current, setCurrent] = useState("active");
  const [pendingBalance, setPendingBalance] = useState(0);
  const [activeBonus, setActiveBonus] = useState<any>(null);
  const [bonusHistory, setBonusHistory] = useState<any>([]);

  const user = useAppSelector((state) => state.user.user);

  const { data } = useGetUserBonusQuery({ userId: user?.id });

  useEffect(() => {
    if (data && data?.bonus) {
      // find active bonus
      const active = data?.bonus?.find((item: any) => item.status === 1);
      setActiveBonus(active);
      // find non active
      const bHistory = data?.bonus?.filter((item: any) => item.status === 2);
      bHistory && setBonusHistory(bHistory);
    }
  }, [data]);

  return (
    <>
      <div className="bonus_text">
        Available Bonus Fund: {formatNumber(user?.sportBonusBalance)} NGN
      </div>
      <div className="bonus_text">
        Pending Bonus Fund: {formatNumber(pendingBalance)} NGN
      </div>
      <div className="bonus_tab between">
        <div
          className={`bonus_tab_item ${
            current === "active" && "active"
          } center`}
          onClick={() => setCurrent("active")}
        >
          Active
        </div>
        <div
          className={`bonus_tab_item ${
            current !== "active" && "active"
          } center`}
          onClick={() => setCurrent("history")}
        >
          History
        </div>
      </div>
      {current === "active" ? (
        activeBonus ? (
          <div className="bonus">
            <div className="turnover_text center">{`${activeBonus.rolledAmount}/${activeBonus.pendingAmount}`}</div>
            <div className="bonus_read center">
              <span style={{ zIndex: 1 }}>{activeBonus.rolledAmount/activeBonus.pendingAmount * 100}%</span>

              <div
                className="bonus_read_bar"
                style={{ width: `${(activeBonus.rolledAmount / activeBonus.pendingAmount) * 100}%` }}
              />
            </div>
            <PortTableBonus transactions={activeBonus?.transactions} />
          </div>
        ) : (
          <h4 className="center b_text">No active bonus</h4>
        )
      ) : (
        <div>
          {bonusHistory.length > 0 ? (
            bonusHistory.map((data: any, idx: number) => (
              <BetBonusAccordion key={`bonus-history-${idx}`} data={data} />
            ))
          ) : (
            <h4 className="center b_text">No record found</h4>
          )}
        </div>
      )}
    </>
  );
};

export default Bonus;
