"use client";
import React from "react";
import {
  TopGames,
  Tabs,
  Banner,
  Today,
  Tournaments,
  Highlights,
  TopTournament,
  SingleFixture,
  Live,
  AllLeagues,
  CategoryMatches,
} from "@/_components";

import { useAppSelector, useHash } from "@/_hooks";

const Center = () => {
  const { currentFixtureTab } = useAppSelector((store) => store.fixtures);

  const current = {
    today: <Today />,
    tournaments: <Tournaments />,
    top: <TopTournament />,
    highlights: <Highlights />,
    single: <SingleFixture />,
    live: <Live />,
    sport: <AllLeagues />,
    "category-matches": <CategoryMatches />,
  }[currentFixtureTab.name as string];

  console.log(currentFixtureTab.name, "name");

  return (
    <div className="center center col">
      <TopGames />
      <Tabs />
      <Banner />
      {current}
    </div>
  );
};

export default Center;
