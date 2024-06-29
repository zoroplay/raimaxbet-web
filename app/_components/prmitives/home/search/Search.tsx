"use client";
import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import "./Search.scss";
import { useDebounce, useAppDispatch, useAppSelector } from "@/_hooks";
import { useSearchEventQuery } from "@/_services/sport.service";
import { Empty } from "@/_components";
import { CgSearchLoading } from "react-icons/cg";
import { Oval } from "react-loader-spinner";
import { BiSearch } from "react-icons/bi";
import { updateHistory } from "@/_redux/slices/modal.slice";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";
import { dayMonthTime, slugify } from "@/_utils";

const Search = () => {
  const [search, setSearch] = useState<string>("");

  const debouncedSearch = useDebounce(search, 2000);

  const { searchHistory } = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const {
    isLoading: isLoading,
    data,
    isFetching,
  } = useSearchEventQuery(
    { search: debouncedSearch },
    { skip: search.length < 3 }
  );

  useEffect(() => {
    debouncedSearch && dispatch(updateHistory(debouncedSearch));
  }, [debouncedSearch]);

  return (
    <div className="side_search">
      <div className="side_search_wrap between">
        <input
          className="side_search_input"
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <div className="side_search_icon center">
          <FaSearch />
        </div>
      </div>
      {search.length >= 1 && (
        <div
          className="search_con"
          style={{ height: data?.fixtures > 1 ? "35vh" : "" }}
        >
          {search.length < 3 ? (
            <div className="search_block_input_con">
              <div className="trend_search">
                <div className="trend_search_title">Trending Search</div>
                <div className="trend_search_items start">
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("manchester")}
                  >
                    Manchester
                  </div>
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("chelsea")}
                  >
                    Chelsea
                  </div>
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("madrid")}
                  >
                    Madrid
                  </div>
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("arsenal")}
                  >
                    Arsenal
                  </div>
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("liverpool")}
                  >
                    Liverpool
                  </div>
                  <div
                    className="trend_search_item"
                    onClick={() => setSearch("barcelona")}
                  >
                    Barcelona
                  </div>
                </div>
              </div>
              <div className="history">
                <div className="between history_search_wrap">
                  <div className="history_search_title">Search History</div>
                  <div
                    className="history_search_clear"
                    onClick={() => dispatch(updateHistory("delete-all"))}
                  >
                    Clear
                  </div>
                </div>
                <div className="history_item_wrap start col">
                  {searchHistory?.map((item, idx) => (
                    <div
                      key={idx}
                      className="start history_item"
                      onClick={() => setSearch(item)}
                    >
                      <div className="history_item_icon">
                        <BiSearch />
                      </div>
                      <div className="history_item_text">
                        <div>{item}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : //   ) : search.length < 3 ? (
          //     <div className="char_wrap center">
          //       <div className="char">Please enter at least three characters </div>
          //     </div>
          isFetching ? (
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
          ) : !data?.fixtures ? (
            <div className="p_20" style={{ background: "#fff" }}>
              <Empty title="No Fixtures" icon={<CgSearchLoading />} />
            </div>
          ) : (
            data?.fixtures?.map((item: any, idx: number) => (
              <div className="search_item between" key={idx}>
                <div
                  className="search_item_texts start col"
                  onClick={() => {
                    dispatch(
                      updateFixtures({ name: "single", info: [item?.matchID] })
                    );
                  }}
                >
                  <div className="search_item_teams">{item?.name}</div>
                  <div className="search_item_date">
                    {dayMonthTime(item?.date)}
                  </div>
                </div>
                <div
                  className={`sbe-sb-sports-icon sports_icon ${slugify(
                    item?.sportName?.toLowerCase()
                  )}`}
                  style={{
                    color: "rgba(156, 156, 156, 0.15)",
                  }}
                />
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
