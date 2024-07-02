"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Matches.scss";
import {
  // useGroupBySportsQuery,
  useGetUpcomingQuery,
} from "@/_services/sport.service";
import { getDaysBeforeAndAhead, slugify } from "@/_utils";
import { Fixtures, MatchRangeTab } from "../..";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";
import { useInView } from "react-intersection-observer";
import { Watch, Oval } from "react-loader-spinner";
import { Empty } from "@/_components";
import { CgSearchLoading } from "react-icons/cg";

interface MatchesProps {
  fixturesData: any;
  setSidIndex?: React.Dispatch<React.SetStateAction<number>>;
  page?: number;
  hasMore?: boolean;
  // setHasMore?: React.Dispatch<React.SetStateAction<boolean>>;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  isFetching?: boolean;
  isLoading?: boolean;
  type?: string;
  handleFetchMore?: () => void;
}

const Matches = ({
  fixturesData,
  setSidIndex,
  isFetching,
  isLoading,
  hasMore,
  page,
  setPage,
  handleFetchMore,
  type = "prematch",
}: MatchesProps) => {
  // console.log(fixturesData, "*fix");

  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [activeMarket, setActiveMarket] = useState<any>(null);
  const [firstMarket, setFirstMarket] = useState<any>(null);
  const [active, setIsActive] = useState<{ [key in number]: boolean }>({});

  const { todaysDate, threeWeeksLaterDate } = getDaysBeforeAndAhead();

  // const { data: groupedData } = useGroupBySportsQuery({
  //   start: todaysDate,
  //   end: threeWeeksLaterDate,
  // });

  const groupedDataSlider = useRef<Slider>(null);

  const settings = {
    arrows: false,
    autoplay: false,
    infinite: true,
    speed: 300,
    // slidesToShow: groupedData?.length > 5 ? 5 : groupedData?.length,
    slidesToScroll: 1,
  };

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "-20px 0px",
  });

  const uniqueFixtures = (
    prev: { [key in string]: string }[],
    data: { [key in string]: string }[]
  ) => {
    if (data) {
      const filteredFixturesData = data.filter(
        (dataItem: { [key in string]: string }) => {
          return !prev.some(
            (prevItem: { [key in string]: string }) =>
              prevItem.name === dataItem.name
          );
        }
      );
      return [...prev, ...filteredFixturesData];
    } else {
      return prev;
    }
  };

  useEffect(() => {
    setActiveMarket(null);
    setFirstMarket(null);
    !page && setFixtures([]);
    fixturesData &&
      fixturesData?.markets?.length > 1 &&
      setActiveMarket(fixturesData?.markets[1]);

    fixturesData &&
      fixturesData?.markets?.length > 0 &&
      setFirstMarket(fixturesData?.markets[0]);

    fixturesData &&
      fixturesData?.fixtures?.length > 0 &&
      setFixtures((prev) => uniqueFixtures(prev, fixturesData?.fixtures));

    !fixturesData?.fixtures && setFixtures([]);
  }, [fixturesData]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveMarket(JSON.parse(e.target.value));
  };

  // useEffect(() => {
  //   if (groupedData) {
  //     const obj: { [key in number]: boolean } = {};
  //     groupedData?.forEach((_: unknown, idx: number) => {
  //       if (idx == 0) {
  //         obj[idx] = true;
  //       } else {
  //         obj[idx] = false;
  //       }
  //     });
  //     setIsActive(obj);
  //   }
  // }, [groupedData]);

  useEffect(() => {
    if (handleFetchMore) {
      handleFetchMore();
    }
  }, [inView]);

  // console.log(fixtures, "*fixs");
  //   console.log(groupedData, "group");

  return (
    <div className="matches">
      <MatchRangeTab
        categoryName={
          fixturesData?.fixtures
            ? fixturesData?.fixtures[0]?.categoryName
            : "SPORT"
        }
        tournament={
          fixturesData?.fixtures
            ? fixturesData?.fixtures[0]?.tournament
            : "TOURNAMENT"
        }
        sportName={
          fixturesData?.fixtures ? fixturesData?.fixtures[0]?.sportName : "GAME"
        }
        tournamentId={
          fixturesData?.fixtures && fixturesData?.fixtures[0]?.tournamentID
        }
      />
      {/* Slider */}
      {setSidIndex && (
        <div className="matches_slider_wrap center">
          <Slider
            ref={groupedDataSlider}
            {...settings}
            className="matches_slider"
          >
            {/* {groupedData?.map((sport: any, idx: number) => (
              <div
                key={idx}
                className={`start slider_item_wrap ${active[idx] && "active"}`}
                onClick={() => {
                  setSidIndex && setSidIndex(sport?.sport_id);
                  setFixtures([]);
                  setPage && setPage(1);
                  setIsActive((prev) => {
                    const obj = { ...prev };
                    for (const key in obj) {
                      obj[key] = false;
                    }
                    return { ...obj, [idx]: !obj[idx] };
                  });
                }}
              >
                <div
                  className={`sbe-sb-sports-icon ${slugify(
                    sport?.name?.toLowerCase()
                  )}`}
                />
                <div className="matches_slider_item">{sport?.name}</div>
              </div>
            ))} */}
          </Slider>
          <div
            className="matches_next center"
            onClick={() => groupedDataSlider?.current?.slickPrev()}
          >
            <GrNext />
          </div>
          <div
            className="matches_prev center"
            onClick={() => groupedDataSlider?.current?.slickNext()}
          >
            <GrPrevious />
          </div>
        </div>
      )}
      {/* Select Markets */}
      <div className={`markets_wrap end`}>
        <div className="markets_items start">
          <div
            className="market_item_single center"
            style={{ width: fixturesData?.markets?.length === 1 ? "100%" : "" }}
          >
            {fixturesData &&
              fixturesData?.markets &&
              fixturesData?.markets[0]?.marketName}
          </div>
          {fixturesData && fixturesData?.markets?.length === 2 && (
            <div className="market_item_single center">
              {fixturesData &&
                fixturesData?.markets &&
                fixturesData?.markets[1]?.marketName}
            </div>
          )}
          {fixturesData && fixturesData?.markets?.length > 2 && (
            <div className="market_items_select center">
              <select className="market_select " onChange={handleChange}>
                {fixturesData &&
                  fixturesData?.markets
                    ?.slice(1)
                    .map((item: any, idx: number) => (
                      <option
                        key={idx}
                        className={`market_option ${
                          activeMarket?.marketID === item?.marketID && "active"
                        }`}
                        value={JSON.stringify(item)}
                      >
                        {item?.marketName}
                      </option>
                    ))}
              </select>
            </div>
          )}
        </div>
      </div>
      <div>
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
        ) : fixturesData?.fixtures?.data?.length < 1 ||
          !fixturesData?.fixtures ? (
          <div className="p_20">
            <Empty title="No Fixtures" icon={<CgSearchLoading />} />
          </div>
        ) : (
          <div className="placebet_infinite">
            <Fixtures
              fixtureData={fixtures}
              activeMarket={activeMarket}
              type={type}
              firstMarket={firstMarket}
            />
          </div>
        )}
      </div>
      <div ref={ref} />
      <div className="view_more_wrap">
        {page &&
          page <= fixturesData?.lastPage &&
          (isFetching ? (
            <div
              className="end"
              style={{
                width: "100%",
              }}
            >
              <div className="view_more_text_wrap">
                <Watch
                  height="20"
                  width="20"
                  radius="48"
                  color="#e78b3d"
                  ariaLabel="watch-loading"
                  wrapperStyle={{}}
                  visible={true}
                />
              </div>
            </div>
          ) : (
            <div className="end" style={{ width: "100%" }}>
              <div
                className="view_more_text_wrap center"
                // onClick={() => handleFetchMore()}
              >
                {!hasMore && (
                  <div className="view_more_text">All fixtures Loaded</div>
                )}
                {/* <BiChevronRight /> */}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Matches;
