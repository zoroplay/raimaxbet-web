"use client";
import React, { useEffect, useState } from "react";
import "./CategoryMatches.scss";
import { Fixtures, MatchRangeTab } from "../..";
import { useGetFixturesByCategoryQuery } from "@/_services/sport.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { Empty } from "@/_components";
import { CgSearchLoading } from "react-icons/cg";
import { Oval } from "react-loader-spinner";
import { MdOutlineCancel } from "react-icons/md";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

interface CategoryMatchesProps {
  fixturesData: any;
  setSidIndex?: React.Dispatch<React.SetStateAction<number>>;
  type?: string;
}

const CategoryMatches = () => {
  const [fixtures, setFixtures] = useState<{ [key in string]: string }[]>([]);
  const [activeMarket, setActiveMarket] = useState<any>(null);
  const [firstMarket, setFirstMarket] = useState<any>(null);

  const { info } = useAppSelector((state) => state.fixtures.currentFixtureTab);
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetFixturesByCategoryQuery(info[0]);

  useEffect(() => {
    const allFixtures: any[] = [];
    if (data && data?.fixtures) {
      // get all unique tournaments in fixtures
      const tournaments = data?.fixtures?.map((item: any) => item?.tournament);
      const uniqueTournaments = new Set(tournaments);
      console.log(uniqueTournaments, "all");

      // all specific category fixture in a list
      Array.from(uniqueTournaments).forEach((tournament) => {
        allFixtures.push(
          data?.fixtures?.filter((item: any) => item?.tournament === tournament)
        );
      });
    }
    console.log(allFixtures, "all");
    setFixtures(allFixtures);
  }, [data]);

  useEffect(() => {
    data && data?.markets?.length > 1 && setActiveMarket(data?.markets[1]);

    data && data?.markets?.length > 0 && setFirstMarket(data?.markets[0]);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setActiveMarket(JSON.parse(e.target.value));
  };

  //   console.log(fixturesData, "fix");
  //   console.log(groupedData, "group");

  return (
    <div className="cat_matches_wrap">
      <div
        className="cat_matches_cancle"
        onClick={() => dispatch(updateFixtures("return"))}
      >
        <MdOutlineCancel />
      </div>
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
      ) : fixtures?.length < 1 ? (
        <div className="p_20">
          <Empty title="No Fixtures" icon={<CgSearchLoading />} />
        </div>
      ) : (
        fixtures?.map((fixture: any, idx: number) => (
          <div className="cat_matches" key={idx}>
            <MatchRangeTab
              categoryName={fixture ? fixture[0]?.categoryName : "SPORT"}
              tournament={fixture ? fixture[0]?.tournament : "TOURNAMENT"}
              sportName={fixture ? fixture[0]?.sportName : "GAME"}
            />
            {/* Select Markets */}
            <div className={`markets_wrap end`}>
              <div className="markets_items start">
                <div
                  className="market_item_single center"
                  style={{ width: data?.markets?.length === 1 ? "100%" : "" }}
                >
                  {data && data?.markets && data?.markets[0]?.marketName}
                </div>
                {data && data?.markets?.length === 2 && (
                  <div className="market_item_single center">
                    {data && data?.markets && data?.markets[1]?.marketName}
                  </div>
                )}
                {data && data?.markets?.length > 2 && (
                  <div className="market_items_select center">
                    <select className="market_select " onChange={handleChange}>
                      {data &&
                        data?.markets
                          ?.slice(1)
                          .map((item: any, idx: number) => (
                            <option
                              key={idx}
                              className={`market_option ${
                                activeMarket?.marketID === item?.marketID &&
                                "active"
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
              <Fixtures
                fixtureData={fixture}
                activeMarket={activeMarket}
                type={"prematch"}
                firstMarket={firstMarket}
              />
            </div>
          </div>
        ))
      )}
    </div>
  );
};
export default CategoryMatches;
