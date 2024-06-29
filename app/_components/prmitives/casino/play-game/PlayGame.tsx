"use client";
import React, { useEffect, useState } from "react";
import "./PlayGame.scss";
import { useParams, useRouter } from "next/navigation";
import getCasinoStartUrl from "@/_utils/getCasinoStartUrl";
import { Oval } from "react-loader-spinner";
import { useAppSelector } from "@/_hooks";
import MD5 from "crypto-js/md5";

export default function PlayGames() {
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [games, setGames] = useState();
  const [loading, setLoading] = useState(false);
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_APP_KEY);
  const backurl = process.env.NEXT_PUBLIC_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;

  let params = useParams();
  const router = useRouter();
  const provider = params.slug[params.slug.length - 2];
  const id = params.slug[params.slug.length - 1];
  const { user } = useAppSelector((state) => state.user);
  // console.log(user, "params");

  useEffect(() => {
    if (user) {
      setToken(user?.auth_code);
      setMode(1);
      setGroup(user?.group);
      setHash(
        MD5(`${token}${id}${backurl}${mode}${group}${privateKey}`).toString()
      );
    } else {
      setToken("111111");
      setMode(0);
      setHash(
        MD5(`${token}${id}${backurl}${mode}${group}${privateKey}`).toString()
      );
    }
  }, [user]);

  // useEffect(() => {}, [token, mode]);

  const fetchGame = () => {
    setLoading(true);
    const payload = {
      game_id: id,
    };

    getCasinoStartUrl(provider, payload)
      .then((response) => {
        setLoading(false);
        setGames(response);
        // console.log(response, "res");
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);
        // console.log(err.response);

        setLoading(false);
      });
  };

  const playGoldenrace = () => {
    const url = `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${token}&game=${id}&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`;
    window.location.href = url;
    // router.push(url);
  };

  // useEffect(() => {
  //   console.log("hash:", hash);
  // }, [hash]);

  useEffect(() => {
    if (provider === "golden-race") {
      playGoldenrace();
    } else {
      fetchGame();
    }
  }, [provider]);

  return (
    <div className="play_game">
      {/* <div className="play_title">Play game </div> */}
      {/* <div id="globalbet" /> */}
      {loading ? (
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
      ) : provider === "golden-race" ? (
        ""
      ) : (
        <iframe
          title="casino"
          style={{
            width: "100%",
            border: 0,
            height: "100vh",
            overflow: "scroll",
          }}
          // style={{ width: '100%', border: 0, height: '100vh', overflow: scroll !important}}
          src={games ? games : ""}
        />
      )}
    </div>
  );
}

// PlayGames.noLayout = true;
