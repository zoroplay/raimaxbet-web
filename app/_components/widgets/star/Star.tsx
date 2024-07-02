"use client";
import React, { useEffect, useState } from "react";
import "./Star.scss";
import {
  useFavouriteMutation,
  useGetFavouriteQuery,
} from "@/_services/sport.service";
import { useAppSelector } from "@/_hooks";
import { rtkMutation } from "@/_utils";
import { AiOutlineStar } from "react-icons/ai";
import { MdOutlineStar } from "react-icons/md";

const Star = ({ data }: any) => {
  const [isFav, setIsFav] = useState<boolean>(false);

  const [favourite, { isLoading, isSuccess, isError }] = useFavouriteMutation();

  const { user } = useAppSelector((state) => state.user);

  const { data: favouriteData } = useGetFavouriteQuery({
    favourite: 1,
    userId: user?.id,
  });

  useEffect(() => {
    favouriteData?.fixtures?.forEach((fixture: any) => {
      if (fixture?.homeTeam === (data?.homeTeam || data?.competitor1)) {
        setIsFav(true);
      } else if (fixture?.awayTeam === (data?.awayTeam || data?.competitor2)) {
        setIsFav(true);
      }
    });
  }, [favouriteData]);
  return (
    <div
      className="table_item_btm_icon center"
      onClick={() => {
        setIsFav(!isFav);
        !isFav
          ? rtkMutation(favourite, {
              userId: user?.id,
              competitor1: data?.homeTeamID,
              competitor2: data?.awayTeamID,
            })
          : rtkMutation(favourite, {
              userId: user?.id,
              competitor1: data?.homeTeamID,
              competitor2: data?.awayTeamID,
              action: "remove",
            });
      }}
    >
      {!isFav ? (
        <AiOutlineStar />
      ) : (
        <div className="star_wrap">
          <div className="star_wrap_item">
            <MdOutlineStar />
          </div>
          <div className={`star_wrap_item ${isFav && "star_wrap_item_anim"}`}>
            <MdOutlineStar />
          </div>
        </div>
      )}
    </div>
  );
};

export default Star;
