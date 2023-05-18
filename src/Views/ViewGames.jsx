import React, { useEffect, useState } from "react";
import { MD5 } from "crypto-js";
import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { playGame } from "../Services/apis";
import Loader from "./Components/Loader";

export default function ViewGames() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [, setMode] = useState(0);
  const [, setToken] = useState("111111");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [, setGroup] = useState(process.env.REACT_APP_SITE_KEY);

  let { id } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      setToken(user.auth_code);
      setMode(1);
      setGroup(user.group);
    } else {
      setToken("111111");
      setMode(0);
    }
  }, [isAuthenticated, user]);

  const fetchGame = () => {
    setLoading(true);
    const payload = {
      game_id: id,
      demo: 0,
    };
    playGame(payload)
      .then((response) => {
        setLoading(false);
        setGames(response?.result);
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGame();
  }, []);

  return (
    <JackpotLayout>
      <div id="globalbet" />
      {loading ? (
        <Loader style={{ marginTop: "4rem" }} laoding={loading} />
      ) : (
        <iframe
          title="casino"
          style={{
            width: "100%",
            border: 0,
            height: "80vh",
            overflow: "scroll",
          }}
          // style={{ width: '100%', border: 0, height: '100vh', overflow: scroll !important}}
          src={games && games?.SessionUrl}
        />
      )}
    </JackpotLayout>
  );
}
