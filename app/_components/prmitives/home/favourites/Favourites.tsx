"use client";
import React, { useState } from "react";
import "./Favourites.scss";
import "../../../../icons.css";
import { FaStar } from "react-icons/fa";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { MdClose } from "react-icons/md";
import { RiErrorWarningFill } from "react-icons/ri";
import { BiFootball } from "react-icons/bi";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import {
  useFavouriteMutation,
  useGetFavouriteQuery,
} from "@/_services/sport.service";
import { dayMonthTime, rtkMutation, slugify } from "@/_utils";
import {
  updateFixtures,
} from "@/_redux/slices/fixtures.slice";

const Favourites = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const { data, isFetching } = useGetFavouriteQuery(
    {
      favourite: 1,
      userId: user?.id,
    },
    {
      refetchOnMountOrArgChange: true,
    }
  );
  const [favourite, { isLoading, isSuccess, isError }] = useFavouriteMutation();

  return (
    <div className={`favs ${isOpen && "extend_fav"}`}>
      <div className="fav_acc_wrap between" onClick={() => setIsOpen(!isOpen)}>
        <div className="fav_acc_texts start">
          <div className="fav_acc_star">
            <FaStar />
          </div>
          <div className="fav_acc_title">FAVOURITES</div>
        </div>
        <div>
          {isOpen ? (
            <div className="fav_acc_down">
              <RiArrowUpSLine />
            </div>
          ) : (
            <div className="fav_acc_down">
              <RiArrowDownSLine />
            </div>
          )}
        </div>
      </div>
      {data?.fixtures?.length < 1 ? (
        <div className={`empty_item between ${isOpen && "add_anim_bg"}`}>
          <div className={`${isOpen && "add_anim_text"} start`}>
            <div className="empty_item_icon">
              <RiErrorWarningFill />
            </div>
            <div className="favs_item_texts start col">
              <div className="favs_item_empty">
                Favourite list is currently empty
              </div>
            </div>
          </div>
        </div>
      ) : (
        data?.fixtures?.map((item: any, idx: number) => (
          <div className="favs_item between" key={idx}>
            <div
              className="favs_item_texts start col"
              onClick={() => {
                dispatch(
                  updateFixtures({ name: "single", info: [data?.matchID] })
                );
              }}
            >
              <div className="favs_item_teams">{item?.name}</div>
              <div className="favs_item_date">{dayMonthTime(item?.date)}</div>
            </div>
            <div
              className="favs_item_close"
              onClick={() => {
                rtkMutation(favourite, {
                  userId: user?.id,
                  competitor1: item?.homeTeamID,
                  competitor2: item?.awayTeamID,
                  action: "remove",
                });
              }}
            >
              <MdClose />
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
  );
};

export default Favourites;
