import React, { useEffect, useState} from 'react';
import TopBets from "./Components/TopBets";
import UpcomingEvents from "./Components/UpcomingEvents";
import {Carousel} from "react-responsive-carousel";
import 'react-responsive-carousel/lib/styles/carousel.css';
import useSWR from "swr/esm/use-swr";

export default function Home() {
    const [sliders, setSliders] = useState([]);

    const {data: res, error} = useSWR('/sports/banners?banner_type=web');

    useEffect(() => {
        if (res) {
            setSliders(res.sliders);
        }
    }, [res]);

    return (
        <div className="App-header">
            {sliders.length &&
            <Carousel
                className="banner-container"
                autoPlay
                infiniteLoop={true}
                showStatus={false}
                showThumbs={false}
                showArrows={false}
                interval={res?.slider_speed}
            >
                {sliders.map(slider =>
                    <div key={slider.id}>
                    <a href="#" >
                        <img src={slider.image_path} alt="home banner" />
                    </a>
                    </div>
                )}
            </Carousel>}
            <TopBets />

            <UpcomingEvents />
        </div>
    )
}
