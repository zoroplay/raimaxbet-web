"use client";
import React, { useEffect, useState } from "react";
import "./AllLeagues.scss";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { useGetLiveCountQuery } from "@/_services/sport.service";
import { slugify } from "@/_utils";
import {
  MdOutlineExpandMore,
  MdOutlineKeyboardDoubleArrowRight,
} from "react-icons/md";
import { Oval } from "react-loader-spinner";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";
import {
  useGetSportCategoriesQuery,
  useGetSportTournamentsQuery,
} from "@/_services/sport.service";

const AllLeagues = () => {
  const [isOpen, setIsOpen] = useState<{ [key in string]: boolean }>({});
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [tournamentData, setTournamentData] = useState<{
    [key in string]: any;
  }>({});

  const dispatch = useAppDispatch();
  const activeSport = useAppSelector((state) => state.fixtures.sport);
  let { data: liveCount, isLoading: loading } = useGetLiveCountQuery({
    sid: activeSport?.sportID,
  });

  const {
    data: categories,
    isFetching: isFetchingCat,
    isSuccess: isSuccessCat,
  } = useGetSportCategoriesQuery(activeSport?.sportID, {
    skip: !activeSport?.sportID,
  });
  const {
    data: tournaments,
    isSuccess,
    isFetching: isFetchingTour,
  } = useGetSportTournamentsQuery(categoryID, {
    skip: !categoryID,
  });

  useEffect(() => {
    const obj: { [key in string]: boolean } = {};

    categories?.sports?.forEach((category: any) => {
      obj[category?.categoryID] = false;
    });
    setIsOpen(obj);
  }, [activeSport]);

  // set tournament data
  useEffect(() => {
    isSuccess &&
      setTournamentData((prev) => {
        return { ...prev, [categoryID!]: tournaments?.sports };
      });
  }, [tournaments, isSuccess]);

  console.log(isOpen, "is");

  return (
    <div className="all_lgs">
      <div className="all_lgs_sport start">
        <div
          className={`sbe-sb-sports-icon sports_icon ${slugify(
            activeSport?.sportName?.toLowerCase()
          )}`}
        />
        <div className="all_sport_text">{activeSport.sportName}</div>
      </div>
      <div className="all_lgs_tab start">
        <div className="all_lgs_text center">
          <span>Live Now</span>
          <span className="count center"> {liveCount?.count || 0}</span>
        </div>
        <div className="all_lgs_text center">Tournaments</div>
      </div>
      <div className="categories">
        {categories?.sports?.map((category: any, idx: number) => (
          <>
            <div key={idx} className="category_wrap between">
              <div className="category start">
                <div
                  className={`sbe-sb-sports-icon sports_icon ${slugify(
                    activeSport?.sportName?.toLowerCase()
                  )}`}
                />
                <div className="category_text">
                  {category?.categoryName}
                  {` (${category?.total})`}
                </div>
              </div>
              <div className="more_wrap start">
                <div
                  className="more center"
                  onClick={() =>
                    dispatch(
                      updateFixtures({
                        name: "category-matches",
                        info: [category?.categoryID],
                      })
                    )
                  }
                >
                  <span>More</span>
                  <span className="more_icon">
                    <MdOutlineKeyboardDoubleArrowRight />
                  </span>
                </div>
                <div
                  className={`expand center ${
                    isOpen[category?.categoryID] && "active"
                  }`}
                  onClick={() => {
                    setCategoryID(category?.categoryID);
                    setIsOpen((prev) => ({
                      ...prev,
                      [category?.categoryID]: !prev[category?.categoryID],
                    }));
                  }}
                >
                  <MdOutlineExpandMore />
                </div>
              </div>
            </div>
            {isOpen[category?.categoryID] && (
              <div className="category_items_wrap">
                {tournamentData[category?.categoryID]?.map(
                  (tournament: any, idx: number) => (
                    <>
                      {categoryID === category?.categoryID && isFetchingTour ? (
                        idx === 0 && (
                          <div
                            className="loading center"
                            style={{
                              width: "100%",
                              borderBottom: "1px solid rgba(0,0,0,0.4)",
                              background: "rgba(0,0,0,0.2",
                            }}
                            key={idx}
                          >
                            <Oval
                              height={15}
                              width={15}
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
                        )
                      ) : (
                        <div
                          key={idx}
                          className="category_item"
                          onClick={() => {
                            dispatch(
                              updateFixtures({
                                name: "top",
                                info: [
                                  activeSport?.sportID,
                                  tournament?.tournamentID,
                                ],
                              })
                            );
                          }}
                        >
                          {tournament?.tournamentName}
                          {` (${tournament?.total})`}
                        </div>
                      )}
                    </>
                  )
                )}
              </div>
            )}
          </>
        ))}
      </div>
    </div>
  );
};

export default AllLeagues;
