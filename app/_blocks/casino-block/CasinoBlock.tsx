"use client";
import React, { useEffect, useState } from "react";
import "./CasinoBlock.scss";
import MD5 from "crypto-js/md5";
import {
  useGetGamesByTopCategoryQuery,
  useGetAllCategoriesByProviderSlugQuery,
  useGetAllGamesByCategoryQuery,
  useGetGamesBySearchQuery,
  useGetAllGamesQuery,
  useGetAllTopCategoriesQuery,
} from "@/_services/casino.service";
import { useRouter, useParams } from "next/navigation";
import { Banner, Button, Empty } from "@/_components";
import { BiSearch } from "react-icons/bi";
import { useAppDispatch, useAppSelector, useDebounce } from "@/_hooks";
import Image from "next/image";
import Link from "next/link";
import { slugify, NavLink } from "@/_utils";
import { casino } from "@/_assets";
import { BiChevronRight } from "react-icons/bi";
import { openModal } from "@/_redux/slices/modal.slice";

const CasinoBlocks = () => {
  const [mode, setMode] = useState(0);
  const [vtoken, setVtoken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);
  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;
  //   const [games, setGames] = useState([]);
  const [count, setCount] = useState(1);
  const [gameId, setGameId] = useState<number>(3);
  const [input, setInput] = useState("");
  const [gamesData, setGamesData] = useState([]);
  //   const [topCategoryId, setTopCategoryId] = useState<number>(12);
  const [topCategory, setTopCategory] = useState<string>("All games");
  const [active, setActive] = useState("pushgaming");
  const [, setActiveId] = useState<number>(1);
  const [isSearch, setIsSearch] = useState(false);

  //   const { data: gameCount } = useGetAllGamesByTopCategoriesQuery("");
  //   const { data: game } = useGetAllGamesByCategoryQuery("");

  const debouncedIput = useDebounce(input, 1000);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);

  const { data: categories } = useGetAllCategoriesByProviderSlugQuery(active);
  const { data: searchGames } = useGetGamesBySearchQuery(input);
  const { data: games, refetch: refetchGames } =
    useGetGamesByTopCategoryQuery(gameId);
  const { data: allGames, refetch: refetchAllGames } =
    useGetAllGamesQuery(count);
  const { data: topCategories } = useGetAllTopCategoriesQuery("");

  const gameDataToShow =
    topCategory === "All games" ? allGames?.games?.data : games?.data;

  // console.log(gameDataToShow, "games");

  const router = useRouter();
  const params = useParams();
  const token = useAppSelector((state) => state.user.token);
  // console.log(input);

  const getActive = (item: number, active: string) => {
    setActive(active);
    setActiveId(item);
  };

  useEffect(() => {
    if (user.token) {
      setMode(1);
      setGroup(user.user?.group);
      setVtoken(user.user?.auth_code);
    }
  }, [user]);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, [token]);

  const uniqueGames = (
    prev: { [key in string]: string }[],
    data: { [key in string]: string }[]
  ) => {
    if (data) {
      const filteredGamesData = data.filter(
        (dataItem: { [key in string]: string }) => {
          return !prev.some(
            (prevItem: { [key in string]: string }) =>
              prevItem.game_id === dataItem.game_id
          );
        }
      );
      return [...prev, ...filteredGamesData];
    } else {
      return prev;
    }
  };
  useEffect(() => {
    setGamesData((prev: any) => {
      if (gameDataToShow) {
        return uniqueGames(prev, gameDataToShow);
      } else {
        return prev;
      }
    });
  }, [gameDataToShow]);

  useEffect(() => {
    refetchGames();
    refetchAllGames();
  }, [gameId]);

  const handleMore = () => {
    setCount((prev) => prev + 1);
  };

  const viewDetails = ({ provider, id }: { provider: string; id: number }) => {
    if (token) {
      router.push(`/game/play/live-casino/${provider}/${id}`);
    } else {
      dispatch(openModal({ component: "LoginModal" }));
    }
  };

  return (
    <>
      {/* <div className="provider start">
        {categories &&
          categories?.categories?.map((item: any, i: number) => (
            <div
              key={i}
              className={
                item?.slug === active ? `active_provider_item` : `provider_item`
              }
              onClick={() => getActive(item?.id, item?.slug)}
            >
              <p>{item?.slug}</p>
            </div>
          ))}
      </div> */}
      <div className="banner_wrap">
        <Banner />
      </div>
      <div className="cas_body">
        <div className="cas_wrap">
          <div className="cas_tab">
            <div className="cas_tab_scroll between">
              {topCategories?.data?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`cas_tab_scroll_item center ${
                    topCategory === item?.name && "active"
                  }`}
                  onClick={() => {
                    if (item.name !== "Virtuals") {
                      setGameId(item?.id);
                      setTopCategory(item?.name);
                      setGamesData([]);
                    }

                    if (item.name === "Virtuals") {
                      window.open(
                        `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${vtoken}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
                      );
                    }
                  }}
                  // activeClassName="active"
                  // href={`/casino/${slugify(item?.name)}`}
                >
                  <div
                    className="cas_tab_scroll_icon"
                    // style={{ color: item.color }}
                  >
                    {/* {item.icon} */}
                    <div
                      className={`sbe-sb-sports-icon ${item?.name?.toLowerCase()}`}
                    />
                  </div>
                  <div className="cas_tab_scroll_text">{item?.name}</div>
                </div>
              ))}
            </div>
            <div
              className={`cas_tab_srch between ${isSearch && "search_active"}`}
            >
              <input
                placeholder="search"
                className="cas_tab_srch_inp"
                onChange={(e) => setInput(e.target.value)}
              />
              <div
                onClick={() => setIsSearch(!isSearch)}
                className="center cas_tab_srch_icon"
              >
                <BiSearch />
              </div>
            </div>
          </div>

          {topCategory !== "all" || input.length > 1 ? (
            <div
              className={`cas_block ${input && "search_bg"}`}
              id="scrollableDiv"
            >
              <div className="cas_block_sort">
                {!input && (
                  <div className="cas_block_sort_text">
                    {topCategory.toUpperCase()}
                  </div>
                )}
                {/* <div>
                <div></div>
            </div> */}
              </div>
              {/* <div className="cas_block" id="scrollableDiv"> */}
              {gamesData?.length === 0 && searchGames?.games?.length === 0 ? (
                <Empty title="NO GAMES FOUND" icon={<BiSearch />} />
              ) : (
                // <InfiniteScroll
                //   className={`card_wrap ${input && "search"}`}
                //   dataLength={gamesData?.length || 10}
                //   next={() => handleMore()}
                //   hasMore={true} // Replace with a condition based on your data source
                //   loader={<div>Laoding...</div>}
                //   endMessage={<p>No more data to load.</p>}
                // >
                <div className={`card_wrap ${input && "search"}`}>
                  {input.length > 1
                    ? searchGames?.games
                        ?.filter((item: any) => item?.category?.status !== 0)
                        ?.map((item: any, i: number) => (
                          <div key={i} className="cas_block_game_search start">
                            <img
                              src={
                                item?.image_path?.length > 1
                                  ? item?.image_path
                                  : casino
                              }
                              onError={(
                                e: React.ChangeEvent<HTMLImageElement>
                              ) => {
                                e.target.onerror = null;
                                e.target.src = casino;
                              }}
                              style={{
                                width: "50%",
                                height: "120px",
                                objectFit: "cover",
                              }}
                              className="cas_block_game_img"
                              alt="Game view"
                            />
                            <div className="cas_block_game_text">
                              <p className="cas_block_search_title">
                                {item?.title}
                              </p>
                              <p className="cas_block_search_sub">EN</p>
                              <Button
                                text="View"
                                className="cas_block_search_btn1"
                                onClick={() =>
                                  viewDetails({
                                    provider: item?.provider_id?.toLowerCase(),
                                    id: item?.game_id,
                                  })
                                }
                              />
                              {/* <Button text="Demo" className="cas_block_search_btn2" /> */}
                            </div>
                          </div>
                        ))
                    : gamesData
                        ?.filter((item: any) => item?.category?.status !== 0)
                        ?.map((item: any, i: number) => (
                          <div
                            key={i}
                            className="cas_block_game_card"
                            onClick={() =>
                              viewDetails({
                                provider: item?.provider_id?.toLowerCase(),
                                id: item?.game_id,
                              })
                            }
                          >
                            <img
                              src={
                                item?.image_path?.length > 1
                                  ? item?.image_path
                                  : casino
                              }
                              onError={(
                                e: React.ChangeEvent<HTMLImageElement>
                              ) => {
                                e.target.onerror = null;
                                e.target.src = casino;
                              }}
                              style={{
                                width: "100%",
                                height: "150px",
                                objectFit: "cover",
                              }}
                              className="cas_block_game_img"
                              alt="Game view"
                            />
                            <div className="casino_block_gameitem_text">
                              {item?.title}
                            </div>
                            {/* <div className="cas_block_game_text">
                      <p>{item?.title?.slice(0, 9)}</p>
                    </div> */}
                          </div>
                        ))}
                </div>
                // </InfiniteScroll>
              )}
              {/* </div> */}
              <div className="end" style={{ width: "100%" }}>
                <div
                  className="view_more_text_wrap center"
                  onClick={() => handleMore()}
                >
                  <div className="view_more_text">View More</div>
                  <BiChevronRight />
                </div>
              </div>
            </div>
          ) : (
            <div className="all_cat_wrap start col">
              {topCategories?.data?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className={`all_cat_item start ${
                    topCategory === item?.name && "active"
                  }`}
                  onClick={() => {
                    setGameId(item?.id);
                    setTopCategory(item?.name);
                    setGamesData([]);
                  }}
                  // activeClassName="active"
                  // href={`/casino/${slugify(item?.name)}`}
                >
                  <div
                    className="all_cat_icon"
                    // style={{ color: item.color }}
                  >
                    {/* {item.icon} */}
                    <div
                      className={`sbe-sb-sports-icon ${item?.name?.toLowerCase()}`}
                    />
                  </div>
                  {<div className="all_cat_text">{item?.name}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CasinoBlocks;
