import React, {useState, useEffect} from "react";
import QuickBet from "../../Components/QuickBet";
import SmartBet from "../../Components/SmartBet";
import CouponCheck from "../../Components/CouponCheck";
import BetSlip from "../../Components/BetSlip";
import {NavLink} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import useSWR from "swr/esm/use-swr";

export default function RightSide() {
    const {isAuthenticated, user } = useSelector(state => state.auth);
    const [image, setBg] = useState(null);

    const {data: res, error} = useSWR('/utilities/bg-image?type=sport&position=right');

    useEffect(() => {
        if (res && res.image_path) {
            setBg(res.image_path);
        }
    }, [res]);

    return (
        <div className="side3">
            {!isAuthenticated ?
                <NavLink to="/Auth/Register" className="registerBtn">REGISTER NOW!</NavLink>
                :
                user.role !== 'Cashier' && <NavLink to="/Account/Deposit" className="depositBtn">DEPOSIT NOW!</NavLink>
            }
            {/* SMART BET*/}
            <SmartBet />
            
            {/* BET SELECTION */}
            <BetSlip />

            {/*COUPON CHECK*/}
            <CouponCheck />

            {/* QUICK BET */}
            <QuickBet />

            {image &&
            <a href="/Sport/cms?mid=29&amp;sid=0" className="mb">
                <img src={image} alt="contact us" />
            </a>}

            <a href="/Sport/cms?mid=29&amp;sid=0" className="mb">
                <img src="/img/CONTACT-US.png" alt="contact us" width="100%" />
            </a>

            <div className="lucky-container">
                <img src="/img/LUCKYPICK-1.jpg" alt="LUCKYPICK" />
                <div className="lucky-content">
                    <div className="lucky-left lucky">
                        <p>To win</p>
                        <input type="text" id="luckyPickWin" />
                    </div>
                    <div className="lucky-right lucky">
                        <p>Your stake</p>
                        <input type="text" id="luckyPickAmount" />
                    </div>
                </div>
                <a href="#" className="genBtn">GENERATE BET</a>
            </div>
        </div>
    )
}
