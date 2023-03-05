import React from "react";
import {NavLink} from "react-router-dom";


export default function EasySteps({history}) {

    return (

        <div className="entry-content">
            <div className="aqx-b-head">
                <h3 className="aqx-b-head-txt">Easy steps to start</h3>
            </div>
            <div className="pagescontent">

                <ul>
                    <li>Submission of documentation to {process.env.REACT_APP_NAME}</li>
                    <li>Check of documents and location</li>
                    <li>Introductory conversation in person with our field staff</li>
                    <li>Verification of premises</li>
                    <li>Signing of the agent contract</li>
                    <li>Get your shop ready to go with help from our professional support</li>
                </ul>
                <h2>Become a {process.env.REACT_APP_NAME} agent today! *</h2>
                <p>Interested in us and our agency concept?<br />
                    Do you want to know more about your options and earning opportunities with {process.env.REACT_APP_NAME}?<br />
                    Then contact us via our <NavLink to="/BecomeAnAgent/register">registration form</NavLink> or call us
                    on <strong>+211921212150</strong> or Email <strong> raimaxsb@gmail.com</strong>&nbsp;(7 days a week, 8:00 am to 21:00 pm).</p>
                <p><NavLink className="bttn" to="/BecomeAnAgent/register">Register now</NavLink></p>
                <p>*Subject to contract.</p>
            </div>
        </div>
    )
}
