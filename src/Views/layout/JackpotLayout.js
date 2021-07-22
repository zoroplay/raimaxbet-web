import Header from "./partials/Header";
import Footer from "./partials/Footer";
import React, {Fragment} from "react";

export default function JackpotLayout({children}) {

    return (
        <Fragment>
            <Header />
            <div className="main-content live-page">
                <div className="jkpt-container">
                    {children}
                </div>
            </div>
            <Footer />
        </Fragment>
    )
}
