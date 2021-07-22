import React from "react";
import {NavLink} from "react-router-dom";


export default function Index({history}) {

    return (

        <div className="entry-content">
            <div className="aqx-b-head">
                <h3 className="aqx-b-head-txt">Your Benefits</h3>
            </div>
            <div className="pagescontent">
                <p>Are you entrepreneurial and interested in operating an independent sports betting
                business? Do not miss this opportunity to run your own business supported by a premium product and a big
                brand. Our agent program is based on many years of experience.</p>
                <p>Our professionalism, comprehensive and trustworthy service and our reliable and fast processing of
                    commissions and payments have already convinced many partners.</p>
                <h2>Benefits from our unique competitive advantages:</h2>
                <ul>
                    <li>Commission rates based on turnover. You earn for every bet you print.</li>
                    <li>Commissions for all online and mobile customers registered by your tellers.</li>
                    <li>Zero risk or liability for winning bets.</li>
                    <li>Over 5,000 events available for the most popular sports every week.</li>
                    <li>Over 12,000 live betting events per month.</li>
                    <li>Leading European sports betting software.</li>
                    <li>Constant development of new and exciting products.</li>
                </ul>
                <h2>Technology and equipment:</h2>
                <ul>
                    <li>Set-up support for hardware.</li>
                    <li>Technical support on-site and via telephone.</li>
                </ul>
                <h2>Support:</h2>
                <ul>
                    <li>On-site support from competent {process.env.REACT_APP_NAME} field staff.</li>
                    <li>Free training course to prepare you and your staff for the opening of your betting shop.</li>
                </ul>
                <p><NavLink className="bttn" to="/BecomeAnAgent/register">Register now</NavLink></p>

            </div>
        </div>
    )
}
