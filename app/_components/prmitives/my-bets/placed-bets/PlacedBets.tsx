"use client";
import { BetAccordion, Empty } from "@/_components";
import React, { useEffect } from "react";
import { useBetListMutation } from "@/_services/bet.service";
import { rtkMutation } from "@/_utils";
import { Oval } from "react-loader-spinner";
import { BiSearch } from "react-icons/bi";
import { useAppSelector } from "@/_hooks";

const PlacedBets = () => {
  const { user } = useAppSelector((state) => state.user);
  const [betList, { data, isLoading }] = useBetListMutation();

  // console.log(data?.bets?.data, "data")

  useEffect(() => {
    const body = {
      status: 0,
      date: "",
      userId: user?.id,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    };
    rtkMutation(betList, body);
  }, [user]);

  return (
    <div className="placed_bets">
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
  );
};

export default PlacedBets;
