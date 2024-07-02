"use client";
import React, { useEffect, useState } from "react";
import "./Tournaments.scss";
import { useGetFixturesByTournamentQuery } from "@/_services/sport.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { Matches } from "../..";
import { addToFixtures, updateFixtures } from "@/_redux/slices/fixtures.slice";
import { Oval } from "react-loader-spinner";

const Tournaments = () => {
  const { currentFixtureTab, fixtures, currentTournament } = useAppSelector(
    (store) => store.fixtures
  );

  const dispatch = useAppDispatch();

  const {
    data,
    isLoading: loading,
    isSuccess,
    refetch,
    isFetching,
  } = useGetFixturesByTournamentQuery({
    tid: currentFixtureTab.info[1],
    sid: currentFixtureTab.info[0],
  });

  useEffect(() => {
    isSuccess && dispatch(addToFixtures(data));
  }, [data, isSuccess]);

  // This handles the checkbox for tournament, when the checkbox is checked refetch fixtures
  useEffect(() => {
    // check if tournament is checked
    if (currentTournament[currentFixtureTab.info[1]]) {
      refetch();
      isSuccess && dispatch(addToFixtures(data));
    }
  }, [currentTournament]);

  // if no fixtures to display, change view to Todays matches
  useEffect(() => {
    console.log(fixtures.length, "*len");
  }, [fixtures]);

  return (
    <>
      <div className="tournament">
        {fixtures.map((fixData, idx) => (
          <Matches key={idx} fixturesData={fixData} />
        ))}
        {isFetching && (
          <div
            className="tour_load p_20 center"
            style={{
              width: "100%",
              height: fixtures.length < 1 ? "200px" : "",
            }}
          >
            <Oval
              height={50}
              width={50}
              color="#4fa94d"
              wrapperClass=""
              visible={true}
              ariaLabel="oval-loading"
              secondaryColor="#4fa94d"
              strokeWidth={2}
              strokeWidthSecondary={2}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Tournaments;
