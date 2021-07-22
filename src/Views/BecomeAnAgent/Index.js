import React from "react";
import {NavLink} from "react-router-dom";


export default function Index({history}) {

    return (

        <div className="entry-content">
            <div className="aqx-b-head">
                <h3 className="aqx-b-head-txt">Become An Agent</h3>
            </div>
            <div className="pagescontent">
                <p>{process.env.REACT_APP_NAME} offers you the chance to run your own business by becoming one of our
                sales outlets and promoting a tried-and-tested product range.</p>
                <p>Our products, training and support team will provide you with everything a self-motivated person needs to
                    start and grow his/her own shop.</p>
                <p>By offering customers the chance to play on over <strong>5000 events a month</strong>, providing <strong>great
                    bonuses</strong> and the <strong>best odds</strong>, we make your job an easy sell.</p>
                <p>For further information please call <strong>0720909999</strong> or WhatsAPP <strong> +254791744076</strong>&nbsp;(7 days a week, 8:00 am to 21:00 pm)
                    or fill in and submit the registration form.</p>
                <p>A {process.env.REACT_APP_NAME} representative will be in touch.</p>
                <p><NavLink className="bttn" to="/BecomeAnAgent/Register">Register now</NavLink></p>

            </div>
        </div>
    )
}
