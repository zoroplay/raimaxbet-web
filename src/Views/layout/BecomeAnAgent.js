import React, {Fragment, useState} from "react";

import Header from "./partials/Header";
import Footer from "./partials/Footer";
import {useDispatch} from "react-redux";
import '../../Assets/scss/become-an-agent.scss';
import {NavLink} from "react-router-dom";

export default function BecomeAnAgent({
                                 children,
                             }) {
    const dispatch = useDispatch();

    return (
        <Fragment>
            <Header />

            <div className="aqx-main" id="becomeAnAgent">
                <div className="aqx-main-inner">
                    <div className="aqx-a">
                        <div className="pagesmenu">
                            <ul className="pagemenu">
                                <li><NavLink to="/BecomeAnAgent">Become an agent</NavLink></li>
                                <li><NavLink to="/BecomeAnAgent/benefits/">Benefits</NavLink></li>
                                <li><NavLink to="/BecomeAnAgent/how-to-start">Easy steps to start</NavLink></li>
                                <li><NavLink to="/BecomeAnAgent/register/">Register</NavLink></li>
                            </ul>
                        </div>
                    </div>
                    <div className="aqx-b">
                        {children}
                    </div>
                </div>
            </div>
            <Footer />
        </Fragment>
    );
}
