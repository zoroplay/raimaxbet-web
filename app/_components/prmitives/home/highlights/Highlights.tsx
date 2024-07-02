"use client";
import React, { useState } from "react";
import "./Highlights.scss";
import { Matches } from "@/_components";
import { useGetUpcomingQuery } from "@/_services/sport.service";
import { getDaysBeforeAndAhead } from "@/_utils";

const Highlights = () => {
  const [marketIndex, setMarketIndex] = useState<number>(1);
  const [sidIndex, setSidIndex] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();

  const {
    data: fixturesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetUpcomingQuery({
    start: todaysDate,
    end: threeWeeksLaterDate,
    type: "upcoming",
    sid: sidIndex,
    market: marketIndex,
    page,
  });

  const handleFetchMore = () => {
    if (page < fixturesData?.lastPage) setPage((prevPage) => prevPage + 1);
    if (fixturesData?.lastPage === page) setHasMore(false);
  };
  return (
    <div className="highlight">
      <Matches
        fixturesData={fixturesData}
        setSidIndex={setSidIndex}
        isFetching={isFetching}
        page={page}
        setPage={setPage}
        hasMore={hasMore}
        handleFetchMore={handleFetchMore}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Highlights;
