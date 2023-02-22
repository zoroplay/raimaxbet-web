import React, { useEffect, useState } from "react";
import TopBets from "./Components/TopBets";
import UpcomingEvents from "./Components/UpcomingEvents";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.css";
import useSWR from "swr/esm/use-swr";
import { useSelector } from "react-redux";

export default function Home({ history }) {
  const [sliders, setSliders] = useState([]);
  const { user } = useSelector((state) => state.auth);

  const { data: res, error } = useSWR("/sports/banners?banner_type=web");

  useEffect(() => {
    // if (user?.verified === 0) {
    //   history.replace("/Auth/Verify");
    // }
  }, [user]);

  useEffect(() => {
    if (res) {
      setSliders(res.sliders);
    }
  }, [res]);

  return (
    <div className="App-header">
      {sliders.length && (
        <Carousel
          className="banner-container"
          autoPlay
          infiniteLoop={true}
          showStatus={false}
          showThumbs={false}
          showArrows={false}
          interval={res?.slider_speed}
        >
          {sliders.map((slider) => (
            <div key={slider.id}>
              <a href="#">
                <img src={slider.image_path} alt="home banner" />
              </a>
            </div>
          ))}
        </Carousel>
      )}
      <TopBets />

      <UpcomingEvents />
    </div>
  );
}
