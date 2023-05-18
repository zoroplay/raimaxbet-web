import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMoreCasino } from "../Services/apis";
import Casino from "../Assets/img/cas.jpeg";
import JackpotLayout from "./layout/JackpotLayout";
import Loader from "./Components/Loader";

export default function ViewMoreGames({ history }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const [, setGroup] = useState(process.env.REACT_APP_SITE_KEY);

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

  useEffect(() => {}, [token, mode]);

  const fetchGames = () => {
    setLoading(true);

    getMoreCasino()
      .then((response) => {
        setLoading(false);
        setGames(response);
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const viewDetails = (id) => {
    if (isAuthenticated) {
      history.push(`/play/live-casino/${id}`);
    } else {
      history.replace("/Auth/Register");
    }
  };
  return (
    <JackpotLayout>
      <div className="box-header topbets-top">
        <h4>Live Casino</h4>
      </div>
      <div className="box-holder ">
        {loading && (
          <div style={{ width: "80%", margin: "0 auto" }}>
            <Loader loading={loading} />
          </div>
        )}

        {games &&
          !loading &&
          games?.games?.map((item, i) => (
            <div
              className="box "
              style={{ width: "24%" }}
              key={i}
              onClick={() => viewDetails(item?.game_id)}
            >
              <img
                src={item?.image_path === null ? Casino : item?.image_path}
                alt="view"
              />
              <div class="middle">
                <h4>{item?.title}</h4>

                <div class="textt">Play</div>
              </div>
            </div>
          ))}
      </div>
    </JackpotLayout>
  );
}
