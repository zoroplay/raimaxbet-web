"use client";
import React, { useEffect, useState } from "react";
// import "../../../iconstwo.css";
import "./SingleFixture.scss";
import { CgSearchLoading } from "react-icons/cg";
import { AiOutlineStar } from "react-icons/ai";
import { BiStopwatch } from "react-icons/bi";
import { VscJersey } from "react-icons/vsc";
import { useGetSingleFixtureQuery } from "@/_services/sport.service";
import { createID, isSelected, sortArr } from "@/_utils/helpers";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { addToCoupon, removeFromCoupon } from "@/_redux/slices/betslip.slice";
import { Oval } from "react-loader-spinner";
import { Empty, GroupedMarket, Star } from "@/_components";
import { MdOutlineCancel } from "react-icons/md";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";
import { openModal } from "@/_redux/slices/modal.slice";

const SingleFixture = () => {
  const [pollingInterval, setPollingInterval] = useState(100000000);
  const [groupedMarketData, setGroupedMarketData] = useState<
    { [key in string]: unknown }[]
  >([]);
  //   const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const currentFixtureTab = useAppSelector(
    (state) => state.fixtures.currentFixtureTab
  );

  const { data, isLoading } = useGetSingleFixtureQuery(
    currentFixtureTab.info[0],
    {
      pollingInterval,
    }
  );

  const variables = useAppSelector((state) => state.sport);

  useEffect(() => {
    data?.statusCode && setPollingInterval(15000);
    if (data?.statusCode === 0) {
      const currentDate = Date.now();
      const eventDate = new Date(data?.date).getTime();
      currentDate > eventDate &&
        dispatch(openModal({ message: "Event is no longer active" }));
    }
  }, [data]);

  useEffect(() => {
    if (data?.markets) {
      const uniqueMarketId = new Set();
      data?.markets?.forEach((market: { [key in string]: unknown }) => {
        uniqueMarketId.add(market?.marketID);
      });
      const groupedMarket: { [key in string]: unknown }[] = [];
      uniqueMarketId.forEach((id) => {
        const grouped = data?.markets?.filter(
          (market: { [key in string]: unknown }) => {
            return id === market?.marketID;
          }
        );
        groupedMarket.push(grouped);
      });
      setGroupedMarketData(groupedMarket);
    }
  }, [data]);

  // console.log(variables, "variables");

  return (
    <div className="single_fixture">
      <div className="single_fix_header between">
        <div>{data?.sportName + " - " + data?.tournament}</div>
        <div
          className="single_fix_cancle"
          onClick={() => {
            dispatch(updateFixtures("return"));
          }}
        >
          <MdOutlineCancel />
        </div>
      </div>
      <div className="single_fixture_time between">
        {data?.statusCode ? (
          <div className="fixture_live_time">{data?.eventTime}</div>
        ) : (
          <div className="fixture_icon">
            <BiStopwatch />
          </div>
        )}
        {data?.statusCode ? (
          <div className="center">
            <div className="live_text">Live</div>
            <div className="live_icon" />
          </div>
        ) : (
          <div className="fixture_time_text">{data?.date}</div>
        )}
        <div className="fixture_icon_star">
          <Star data={data} />
        </div>
      </div>
      <div className="single_fixture_teams between">
        <div className="fixture_team center">
          <div className="fixture_team_name">{data?.competitor1}</div>
          {data?.statusCode ? (
            <div className="fixture_score_home">{data?.homeScore}</div>
          ) : (
            <div className="fixture_icon_team">
              <VscJersey />
            </div>
          )}
        </div>
        <div className="team_vs center">VS</div>
        <div className="fixture_team center">
          {data?.statusCode ? (
            <div className="fixture_score_away">{data?.awayScore}</div>
          ) : (
            <div className="fixture_icon_team_two">
              <VscJersey />
            </div>
          )}
          <div className="fixture_team_name">{data?.competitor2}</div>
        </div>
      </div>

      {isLoading ? (
        <div className="p_20 center">
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
      ) : data?.markets?.length < 1 || !data ? (
        <div className="p_20">
          <Empty title="No Fixtures" icon={<CgSearchLoading />} color="#fff" />
        </div>
      ) : (
        groupedMarketData?.map((item: any, idx: number) => (
          <div key={idx}>
            <GroupedMarket data={item} type={data?.statusCode} allData={data} />
          </div>
        ))
      )}
    </div>
  );
};

export default SingleFixture;
