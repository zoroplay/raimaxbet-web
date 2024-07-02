"use client";
import React, { useState, useEffect } from "react";
import "./TopGames.scss";
import { useGetTopTournamentQuery } from "@/_services/sport.service";
import Image from "next/image";
// import Link from "next/link";
// import { slugify } from "@/_utils";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { updateFixtures } from "@/_redux/slices/fixtures.slice";

const TopGames = () => {
  const [active, setIsActive] = useState<{ [key in number]: boolean }>({});

  const { data } = useGetTopTournamentQuery("");
  const dispatch = useAppDispatch();
  const { currentFixtureTab } = useAppSelector((state) => state.fixtures);

  useEffect(() => {
    if (data) {
      const obj: { [key in number]: boolean } = {};
      data?.forEach((_: unknown, idx: number) => {
        obj[idx] = false;
      });
      setIsActive(obj);
    }
  }, [data]);

  const getImageURL = (name: string) => {
    if (name.includes('Qualification CAF')) {
      return '/images/qualification.JPG'
    } else {
      return `https://firebasestorage.googleapis.com/v0/b/iron-envelope-405217.appspot.com/o/Top%20Leagues%2F${name}.png?alt=media`
    }
  }

  // console.log(data, "topTour");
  return (
    <div className="topgames start">
      {data &&
        data?.map((tournament: any, idx: number) => (
          <div
            onClick={() => {
              // router.push(
              //   `/#/sports/${slugify(tournament?.tournament?.name)}/${
              //     tournament?.tournament?.category?.sport_id
              //   }/${tournament?.tournament?.provider_id}`
              // )
              dispatch(
                updateFixtures({
                  name: "top",
                  info: [
                    tournament?.tournament?.category?.sport_id,
                    tournament?.tournament?.provider_id,
                  ],
                })
              );
              setIsActive((prev) => {
                const obj = { ...prev };
                for (const key in obj) {
                  obj[key] = false;
                }
                return { ...obj, [idx]: !obj[idx] };
              });
            }}
            key={idx}
            className={`topgame start ${
              active[idx] && currentFixtureTab.name === "top" && "active"
            }`}
          >
            <div className="topgame_img_wrap">
              <Image
                className="topgame_img_wrap"
                fill
                src={getImageURL(tournament?.tournament?.name)}
                alt="icon"
              />
            </div>
            <div className="topgame_text">{tournament?.tournament?.name}</div>
          </div>
        ))}
    </div>
  );
};

export default TopGames;
