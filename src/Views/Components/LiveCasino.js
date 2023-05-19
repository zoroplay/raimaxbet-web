import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getTopCasinoGame } from "../../Services/apis";
import Casino from "../../Assets/img/casin.jpeg";
import { NavLink, useHistory } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import Loader from "../Components/Loader";

function LiveCasino() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState([]);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const history = useHistory();

  const fetchTopGames = () => {
    setLoading(true);
    getTopCasinoGame()
      .then((response) => {
        setLoading(false);
        setGames(response?.data);
      })
      .catch((err) => {
        setGames(err?.response?.data?.message);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTopGames();
  }, []);

  const viewDetails = (id) => {
    if (isAuthenticated) {
      history.push(`/play/live-casino/${id}`);
    } else {
      history.replace("/Auth/Register");
    }
  };

  return (
    <div>
      {games &&
        games?.map((item) => (
          <>
            <div className="box-header topbets-top">
              <h4>{item?.name}</h4>
              <NavLink to="/live-casino">View More</NavLink>
            </div>
            {loading ? (
              <Loader loading={loading} style={{ textAlign: "center" }} />
            ) : (
              <Carousel
                className="banner-cont"
                style={{ background: "black" }}
                autoPlay={true}
                infiniteLoop={true}
                showStatus={false}
                showThumbs={false}
                centerMode={true}
                centerSlidePercentage={33}
                showArrows={true}
                interval={3000}
              >
                {/* <div className="box-holder"> */}
                {item?.games &&
                  item?.games?.map((game, i) => (
                    <div
                      className="box"
                      key={i}
                      onClick={() => viewDetails(game?.casino?.game_id)}
                    >
                      <img
                        src={
                          game?.casino?.image_path === null
                            ? Casino
                            : game?.casino?.image_path
                        }
                        alt="view"
                      />
                      <div class="middle">
                        <p>{game?.casino?.title}</p>
                        <button class="textt">Play</button>
                      </div>
                    </div>
                  ))}
                {/* </div> */}
              </Carousel>
            )}
          </>
        ))}
    </div>
  );
}

export default LiveCasino;
