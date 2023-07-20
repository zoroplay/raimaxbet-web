import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";
import { getAllGamesByCategory, getAllGamesCategories } from "../Services/apis";
import Loader from "./Components/Loader";

export default function Casino() {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [games, setGames] = useState([]);
  const [categories, setCategories] = useState([]);
  const [active, setActive] = useState("pushgaming");
  const history = useHistory();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const fetchCategory = () => {
    setLoading(true);

    getAllGamesCategories()
      .then((response) => {
        setCategories(response);
      })
      .catch((err) => {
        // setGames(err?.response?.data?.message);
      });
  };

  const fetchGames = () => {
    setLoading(true);

    getAllGamesByCategory(active)
      .then((response) => {
        setLoading(false);
        setGames(response);
      })
      .catch((err) => {
        // setGames(err?.response?.data?.message);
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    fetchGames();
  }, [active]);

  const viewDetails = (id) => {
    if (isAuthenticated) {
      setToken(
        `${user?.code}-${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`
      );
    }
  };

  return (
    <JackpotLayout>
      <div className="casino-view">
        <div className="head"></div>
        <div className="body">
          {loading ? (
            <div style={{ height: "300px" }}>
              <Loader />
            </div>
          ) : (
            <div className="body-flex">
              {games &&
                games?.map((item, i) => (
                  <div
                    key={i}
                    className="game-card"
                    onClick={() => viewDetails(item?.game_id)}
                  >
                    <img src={item?.image_path} alt="Game view" />
                    <div class="middle">
                      <button class="textt">Play</button>
                    </div>
                    <p>{item?.title}</p>
                  </div>
                ))}
            </div>
          )}
        </div>
        <div className="footer">
          <div className="sides">
            {isAuthenticated ? (
              <>
                {" "}
                <p style={{ marginTop: "2rem" }}>BALANCE</p>
                <h2 style={{ fontSize: "2rem", marginTop: "-1rem" }}>
                  {" "}
                  CFA {user?.available_balance}
                </h2>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="middle-view">
            <div className="middle-flex">
              {categories &&
                categories?.data?.map((item, i) => (
                  <div
                    key={i}
                    className={
                      item.slug === active ? "active-card" : "game-card"
                    }
                    onClick={() => setActive(item?.slug)}
                  >
                    <p>{item?.slug}</p>
                  </div>
                ))}
            </div>
          </div>
          <div className="sides"></div>
        </div>
      </div>
    </JackpotLayout>
  );
}
