import Header from "./partials/Header";
import Footer from "./partials/Footer";
import React, {Fragment} from "react";

export default function Others({children}) {

    return (
        <Fragment>
            <Header />
            {children}
            <Footer />

        </Fragment>
    )
}
