"use client";
import React, { useState, useEffect } from "react";
import "./SettledBets.scss";
import { BetAccordion, Empty } from "@/_components";
import { useBetListMutation } from "@/_services/bet.service";
import { rtkMutation } from "@/_utils";
import { getDaysBeforeAndAhead } from "@/_utils";
import { Oval } from "react-loader-spinner";
import { BiSearch } from "react-icons/bi";
import { useAppSelector } from "@/_hooks";
import dayjs from "dayjs";

const dates = [
  {
    name: "All",
    value: "settled",
  },
  {
    name: "Won",
    value: 2,
  },
  {
    name: "Lost",
    value: 1,
  },
  {
    name: "Rejected",
    value: 3,
  },
  {
    name: "Cashed Out",
    value: 5,
  },
];

const SettledBets = () => {
  const [current, setCurrent] = useState<{
    name: string;
    value: string | number;
  }>(dates[0]);
  const { user } = useAppSelector((state) => state.user);
  const [betList, { data, isLoading }] = useBetListMutation();

  const { todaysDate, sevenDaysAgoDate } = getDaysBeforeAndAhead();

  const body = {
    status: current.value,
    from: dayjs().subtract(7, "days").startOf("day").format("YYYY-MM-DD HH:mm"),
    to: dayjs().endOf("day").format("YYYY-MM-DD HH:mm"),
    page: 1,
    userId: user?.id,
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
  };

  useEffect(() => {
    rtkMutation(betList, body);
  }, [current]);

  return (
    <div className="settled_bet">
      <div className="date_tab between">
        {dates.map((item, idx) => (
          <div
            className={`date_tab_item center ${
              current.name === item.name && "active"
            }`}
            key={idx}
            onClick={() => setCurrent(item)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="settled_bet_items">
        {isLoading ? (
          <div className="p_20 center" style={{ width: "100%" }}>
            <Oval
              height={50}
              width={50}
              color="#4fa94d"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        ) : data?.bets?.length < 1 || !data?.bets ? (
          <div className="p_20">
            <Empty title="No tickets to display" icon={<BiSearch />} />
          </div>
        ) : (
          data?.bets?.map((item: any, idx: number) => (
            <div key={idx}>
              <BetAccordion data={item} />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SettledBets;
