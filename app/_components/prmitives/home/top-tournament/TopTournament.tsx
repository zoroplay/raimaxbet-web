"use client";
import React from "react";
import "./TopTournament.scss";
import { useGetFixturesByTournamentQuery } from "@/_services/sport.service";
import { useAppSelector } from "@/_hooks";
import { Matches } from "../..";


const TopTournament = () => {
  const { currentFixtureTab } = useAppSelector(
    (store) => store.fixtures
  );


  const {
    data,
    isLoading: loading,
    isSuccess,
    isFetching,
  } = useGetFixturesByTournamentQuery({
    tid: currentFixtureTab.info[1],
    sid: currentFixtureTab.info[0],
  });

  return (
    <>
      <div className="top_tour">
        <Matches fixturesData={data} />
      </div>
    </>
  );
};

export default TopTournament;
