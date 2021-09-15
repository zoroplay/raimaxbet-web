import Header from "./partials/Header";
import Footer from "./partials/Footer";
import React, {Fragment} from "react";
import RightSide from "./partials/RightSide";
import '../../Assets/scss/_live.scss';

export default function InPlay({children}) {

    return (
        <Fragment>
            <Header />
            <div className="main-content live-page">
                <section className="section-content">
                    <div className="live-container">
                        <a href="/Sport/became-an-agent" className="join-btn1">BE AGENT</a>
                        <a href="/Sport/became-an-agent" className="join-btn2">BE AGENT</a>

                        <div className="live-wrapper" id="live-root">
                            {children}
                        </div>
                        <RightSide />
                    </div>
                </section>
            </div>
            <Footer />
            {/*<div className="bet-confirm-popup-wrapper">
                <div className="bet-confirm-popup">
                    <div className="close-bet-confirm-popup" onClick="closeConfirm();">
                        <i className="fa fa-times" aria-hidden="true" />
                    </div>
                    <div className="bet-confirm-content">
                        <div className="title">
                            <img src="/img/bet-confirm-info.png" alt="" />
                            <span>You are about to place a bet, please confirm, that you would like to proceed.</span>
                        </div>
                        <div className="buttons">
                            <div className="cancel-button button" onClick="closeConfirm();">
                                Cancel
                            </div>
                            <div className="confirm-button button" onClick="confirmCoupon();">
                                Confirm
                            </div>
                        </div>
                    </div>
                </div>
            </div>*/}
        </Fragment>
    )
}
