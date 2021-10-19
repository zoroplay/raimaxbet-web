import Header from "./partials/Header";
import Footer from "./partials/Footer";
import React, {Fragment, useState, useEffect} from "react";
import LeftSide from "./partials/LeftSide";
import RightSide from "./partials/RightSide";
import useSWR from "swr/esm/use-swr";
import {NavLink} from "react-router-dom";

export default function Main({children, history}) {
    const [bg, setBg] = useState(null);

    const {data: res, error} = useSWR('/utilities/bg-image?type=sport&position=background');

    useEffect(() => {
        if (res && res.image_path) {
            setBg(res.image_path);
        }
    }, [res]);

    return (
        <Fragment>
            <Header />
            <main className="main-content" style={{backgroundImage: bg ? `url(${bg})` : ''}}>
                <section className="section-content">
                    <div className="side-container">
                        <NavLink to="/BecameAnAgent" className="join-btn1">BE AGENT</NavLink>
                        <NavLink to="/BecameAnAgent" className="join-btn2">BE AGENT</NavLink>

                        <LeftSide history={history} />

                        <div className="side2">
                            <div className="sports-book">
                                <div className="title">
                                    <img src="/img/soccer-icon.png" alt=""
                                         className="title-icon" />
                                        SPORTSBOOK
                                </div>
                                <div className="right-content">
                                    <div className="events-info">
                                        <div><span id="sportsNum">16</span> Sports</div>
                                        <div><span id="tournamentsNum">159</span> Events</div>
                                        <div><span id="eventsNum">1081</span> Matches</div>
                                        <div><span id="oddsNum">561188</span> Odds</div>
                                    </div>
                                </div>
                            </div>
                            {children}
                        </div>

                        <RightSide />
                    </div>
                </section>
            </main>
            <Footer />
            {/*<div className="coupon-popup-wrapper" id="reservedCoupon"></div>
            <div className="coupon-popup-wrapper" id="searchEvents"></div>*/}


        </Fragment>
    )
}
