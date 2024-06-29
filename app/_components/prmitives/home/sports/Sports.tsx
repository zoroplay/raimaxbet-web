/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import "./Sports.scss";
import {
  useGetSportsQuery,
  useGetSportCategoriesQuery,
  useGetSportTournamentsQuery,
} from "@/_services/sport.service";
import "../../../../icons.css";
import { slugify } from "@/_utils";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import {
  removeFromFixtures,
  updateCurrentTournaments,
  updateFixtures,
} from "@/_redux/slices/fixtures.slice";
import { Oval } from "react-loader-spinner";
import { updateSports } from "@/_redux/slices/sport.slice";

const Sports = () => {
  const [value, setValue] = useState("4");
  const [sportID, setSportID] = useState<number | null>(null);
  const [categoryID, setCategoryID] = useState<number | null>(null);
  const [open, setOpen] = useState<{ [key in string]: boolean }>({});
  const [trigger, setTrigger] = useState<boolean>(false);
  const [sportName, setSportName] = useState<number | null>(null);
  const [openCategory, setOpenCategory] = useState<{
    [key in string]: boolean;
  }>({});
  const [tournamentData, setTournamentData] = useState<{
    [key in string]: any;
  }>({});
  const [categoryData, setCategoryData] = useState<{
    [key in string]: any;
  }>({});

  const dispatch = useAppDispatch();
  const { currentTournament } = useAppSelector((state) => state.fixtures);

  const current = {
    0: "today",
    1: "48hours",
    2: "72hours",
    3: "week",
    4: "all",
  }[value];
  const { data, isFetching } = useGetSportsQuery(current);
  const {
    data: categories,
    isFetching: isFetchingCat,
    isSuccess: isSuccessCat,
  } = useGetSportCategoriesQuery(sportID, { skip: !sportID });
  const {
    data: tournaments,
    isSuccess,
    isFetching: isFetchingTour,
  } = useGetSportTournamentsQuery(categoryID, { skip: !categoryID });

  // useEffect(() => {
  //   if (data) dispatch(updateSports(data.sports));
  // }, [data]);

  // track state of all sport tabs, open/close
  useEffect(() => {
    const obj: { [key in string]: boolean } = {};

    if (data && data?.sports) {
      data?.sports?.forEach((item: any) => {
        obj[item?.sportName] = false;
      });
    }
    setOpen(obj);
    // dispatch(updateCurrentTournaments({ data: objTournament, id: null }));
  }, [data]);

  // set sport category data
  useEffect(() => {
    isSuccessCat &&
      setCategoryData((prev) => {
        return { ...prev, [sportName!]: categories?.sports };
      });
  }, [categories, isSuccessCat]);

  // set tournament data
  useEffect(() => {
    isSuccess &&
      setTournamentData((prev) => {
        return { ...prev, [categoryID!]: tournaments?.sports };
      });
  }, [tournaments, isSuccess]);

  // track state of all tournament tabs, open/close
  useEffect(() => {
    categoryID && !openCategory[categoryID!]
      ? setOpenCategory((prev) => {
          return {
            ...prev,
            [categoryID!]: true,
          };
        })
      : setOpenCategory((prev) => {
          return {
            ...prev,
            [categoryID!]: !prev[categoryID!],
          };
        });
  }, [categoryID, trigger]);

  // Add selected tournament to global persisted state to track open/close state

  return (
    <>
      <div className="sports center col">
        <div className="sports_labels between">
          <label htmlFor="mySlider" className={`sports_label`}>
            Today
          </label>
          <label htmlFor="mySlider" className={`sports_label`}>
            2 days
          </label>
          <label htmlFor="mySlider" className={`sports_label`}>
            3 days
          </label>
          <label htmlFor="mySlider" className={`sports_label`}>
            1 Week
          </label>
          <label htmlFor="mySlider" className={`sports_label`}>
            All Sports
          </label>
        </div>
        <input
          type="range"
          min="0"
          max="4"
          value={value}
          id="mySlider"
          className="sport_range"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setValue(e.target.value)
          }
        />
      </div>
      {isFetching ? (
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
      ) : (
        <div className="sports_link_wrap">
          {data?.sports?.map((item: any, idx: number) => (
            <>
              <div
                key={idx}
                className="sports_link between"
                onClick={() => {
                  setSportID(item?.sportID);
                  setSportName(item?.sportName);
                  setOpen((prev) => {
                    return {
                      ...prev,
                      [item?.sportName]: !prev[item?.sportName],
                    };
                  });
                }}
              >
                <div className="sports_link_left center">
                  <div
                    className={`sbe-sb-sports-icon sports_icon ${slugify(
                      item?.sportName?.toLowerCase()
                    )}`}
                  />
                  <div className="sports_title">{item?.sportName}</div>
                </div>
                <div className="sports_right center">
                  <div className="sports_num">{item?.total}</div>
                </div>
              </div>
              <div>
                {open[item?.sportName] && !isFetchingCat && (
                  <div
                    className="sports_link_all between"
                    onClick={() => {
                      dispatch(
                        updateFixtures({
                          name: "sport",
                          info: [],
                        })
                      );
                      // update clicked tournament for all leagues
                      dispatch(
                        updateCurrentTournaments({
                          data: item,
                          id: null,
                        })
                      );
                    }}
                  >
                    <div className="sports_link_left center">
                      <div className="icon_style center">
                        <div
                          className={`sbe-sb-sports-icon sports_icon ${slugify(
                            item?.sportName?.toLowerCase()
                          )}`}
                        />
                      </div>
                      <div className="all_title">All Leagues</div>
                    </div>
                    <div className="sports_right center">
                      <div className="sports_num"></div>
                    </div>
                  </div>
                )}
                {open[item?.sportName] &&
                  categoryData[item?.sportName]?.map(
                    (category: any, idx: number) => (
                      <>
                        {sportName === item?.sportName && isFetchingCat ? (
                          idx === 0 && (
                            <div
                              className="loading end"
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
                            className="sports_linksub between"
                            onClick={() => {
                              setCategoryID(category?.categoryID);
                              setTrigger(!trigger);
                            }}
                          >
                            <div className="sports_linksub_left center">
                              <div
                                className={`sbe-sb-sports-icon sports_icon ${slugify(
                                  item?.sportName?.toLowerCase()
                                )}`}
                              />
                              <div className="sports_title_sub">
                                {category?.categoryName}
                              </div>
                            </div>
                            <div className="sports_right_sub center">
                              <div className="sports_num_sub">
                                {category?.total}
                              </div>
                            </div>
                          </div>
                        )}
                        {openCategory[category?.categoryID] && (
                          <div className="tour_wrap">
                            {tournamentData[category?.categoryID]?.map(
                              (tournament: any, idx: number) => (
                                <>
                                  {categoryID === category?.categoryID &&
                                  isFetchingTour ? (
                                    idx === 0 && (
                                      <div
                                        className="loading end"
                                        style={{
                                          width: "100%",
                                          borderBottom:
                                            "1px solid rgba(0,0,0,0.4)",
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
                                      className="tour_wrap_item between"
                                      onClick={() => {}}
                                    >
                                      <div className="sports_linksub_left center">
                                        <input
                                          type="checkbox"
                                          className="tour_check"
                                          checked={
                                            currentTournament[
                                              tournament?.tournamentID
                                            ]
                                          }
                                          onChange={() => {
                                            // update checked status for each tournament
                                            dispatch(
                                              updateCurrentTournaments({
                                                data: null,
                                                id: tournament?.tournamentID,
                                              })
                                            );

                                            currentTournament[
                                              tournament?.tournamentID
                                            ]
                                              ? dispatch(
                                                  removeFromFixtures(
                                                    tournament?.tournamentID
                                                  )
                                                )
                                              : dispatch(
                                                  updateFixtures({
                                                    name: "tournaments",
                                                    info: [
                                                      item?.sportID,
                                                      tournament?.tournamentID,
                                                    ],
                                                  })
                                                );
                                          }}
                                        />
                                        <div className="sports_title_sub">
                                          {tournament?.tournamentName}
                                        </div>
                                      </div>
                                      <div className="sports_right_sub between">
                                        <div className="tour_item_icon center">
                                          <span className="sbe-sb-mb-event-cashout">
                                            <i className="sbe-app-cash"></i>
                                          </span>
                                        </div>
                                        <div className="sports_num_sub">
                                          {tournament?.total}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )
                            )}
                          </div>
                        )}
                      </>
                    )
                  )}
              </div>
            </>
          ))}
        </div>
      )}
    </>
  );
};

export default Sports;
