import React from 'react';

import {loadCoupon, todaysBet} from "../../Services/apis";
import {groupTournament} from "../../Utils/couponHelpers";
import {LOADING, SET_COUPON_DATA, SET_TODAYS_BET} from "../../Redux/types";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import CurrentBetslip from "./Coupon/CurrentBetslip";

export default function BetSlip() {
    const {coupon, todaysBets} = useSelector((state) => state.couponData);
    const {isAuthenticated, user} = useSelector((state) => state.auth);
    const [code, setCode] = useState('');
    const dispatch = useDispatch();

    const findCoupon = (e) => {
        e.preventDefault();
        if (code !== '') {
            dispatch({type: LOADING});
            loadCoupon(code, 'booking').then(res => {
                dispatch({type: LOADING});
                if (res.message === 'found' && res.coupon.selections.length) {
                    let couponData = res.coupon;
                    couponData.tournaments = groupTournament(couponData.selections);
                    // couponData.fixtures = groupSelections(couponData.selections);
                    dispatch({type: SET_COUPON_DATA, payload: couponData});
                } else {
                    alert('Unable to rebet the selected coupon because all the events are expired');
                }
            });
        }
    }

    const getTodayBet = () => {
        todaysBet().then(res => {
            if(res.length)
                dispatch({type: SET_TODAYS_BET, payload: res});
        });
    }

    useEffect(() => {
        if (isAuthenticated) {
            getTodayBet();
        }
    }, [isAuthenticated]);

    const reloadCoupon = (id) => {
        loadCoupon(id, 'rebet').then(res => {

            if (res.message === 'found' && res.coupon.selections.length) {
                let couponData = res.coupon;
                couponData.tournaments = groupTournament(couponData.selections);
                // couponData.fixtures = groupSelections(couponData.selections);
                dispatch({type: SET_COUPON_DATA, payload: couponData});
            } else {
                toast.error('Unable to rebet the selected coupon because all the events are expired');
                // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Coupon not found'}})
            }
        }).catch(err => {});
    }

    return (
        <div className="single-block betslip-holder active">
            <div className="block-title">
                <img src="//atlantiq1.brlgcs.com/atlantiq1/images/list-icon.png" alt="" className="title-icon" />
                <div className="match-count selectionss">{coupon.selections.length}</div>
                <span>Betslip</span>
            </div>
            <div className="betslip active">
                {coupon.selections.length > 0 ?
                    <CurrentBetslip coupon={coupon} dispatch={dispatch} user={user} />
                    :
                <div className="single-block" id="reservedCoupons">
                    <div className="block-content white">
                        <p>Click on the odds or enter a code to be loaded</p>
                        <form name="richiama_coupon_prenotato" onSubmit={findCoupon}>
                            <input
                                id="bookingCode"
                                name="bookingCode"
                                type="text"
                                placeholder="booking code"
                                autoComplete="off"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                            />
                            <input type="submit" value="Load" />
                        </form>
                    </div>
                </div>}
            </div>
        </div>
    )
}
