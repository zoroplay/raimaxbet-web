import React from "react";
import {useHistory} from "react-router-dom";

export default function Footer() {
    const history = useHistory();

    const goTo = page => {
        history.push(page);
    }

    return (
        <footer className="footer-section">
            <div className="footer-inner">

                <div className="footer-side-a">

                    <div className="footer-links">
                        <div className="footer-links-inner">
                            <span className="footer-links-head"><h3>Pitch 90</h3></span>

                            <ul className="footer-links-list">
                                <li className="footer-links-list-li"><a href="#" onClick={() => goTo('/')}>Home</a></li>
                                <li className="footer-links-list-li"><a href="#" onClick={() => goTo('/Sport/Pages/about-us')}>About Us</a></li>
                                <li className="footer-links-list-li"><a href="/BecomeAnAgent">Become an Agent</a></li>
                                <li className="footer-links-list-li"><a href="#">Web Affillates</a></li>
                                <li className="footer-links-list-li"><a href="#">Results</a></li>
                                <li className="footer-links-list-li"><a href="#" onClick={() => goTo('/Sport/contact-us')}>Contact Us</a></li>
                            </ul>
                        </div>

                        <div className="footer-img">
                            <span className="footer-copy">
                                Pitch90Bet is licensed and regulated by the Betting Control and Licensing Board under License number BK 0000183
                            </span>
                        </div>
                    </div>

                    <div className="paymeth-container">
                        <div className="paymeth-inner">
                            <span className="paymeth-head"><h3>Payment Methods</h3></span>

                            <div className="paymeth-img">
                                <img className="paymeth-img-src" src="/img/pay-met.png" alt="" />
                            </div>
                        </div>

                        {/*<span className="footer-copy">.</span>*/}
                    </div>

                </div>


                <div className="footer-side-b">

                    <div className="resp-container">
                        <span className="resp-head"><h3>Responsible &amp; Secure Gaming.</h3></span>

                        <div className="resp-img">
                            <img className="resp-img-src"
                                 src="//atlantiq1.brlgcs.com/atlantiq1/images/logo/play-responsibly.png" alt="" />
                        </div>
                        <span className="footer-copy">
                            This site is open strictly to persons over the age of 18 years. Gambling may have adverse effects if not taken in moderation.
                        </span>
                    </div>

                    <div className="terms-container">
                        <span className="terms-head"><h3>Terms and Conditions</h3></span>

                        <ul className="terms-list">
                            <li className="terms-list-li"><a href="#" onClick={() => goTo('/Sport/Pages/terms-and-conditions')}>General T&amp;C</a></li>
                            {/*<li className="terms-list-li"><a href="#">Sport T&amp;C</a></li>
                            <li className="terms-list-li"><a href="#">Live Betting T&amp;C</a></li>
                            <li className="terms-list-li"><a href="#">Casino T&amp;C</a></li>
                            <li className="terms-list-li"><a href="#">Racing T&amp;C</a></li>
                            <li className="terms-list-li"><a href="#">Pitch90 T&amp;C</a></li>*/}
                            <li className="terms-list-li"><a href="#" onClick={() => goTo('/Sport/Pages/responsible-gaming')}>Responsible Gaming</a></li>
                            <li className="terms-list-li"><a href="#" onClick={() => goTo('/Sport/Pages/privacy')}>Privacy</a></li>
                        </ul>
                    </div>

                </div>
            </div>
        </footer>
    )
}
