import React, {useState} from 'react';
import {LOADING, SET_COUPON_DATA, SHOW_LOGIN_MODAL, SHOW_TIPSTER_BET, UPDATE_USER_BALANCE} from "../../../Redux/types";
import {loadCoupon, rebetTipster} from "../../../Services/apis";
import {Http} from "../../../Utils";
import {toast} from "react-toastify";
import {fastAdd} from "../../../Redux/actions";
import {useSelector} from "react-redux";

export default function TipsterBet({dispatch, betslip, reset}) {
    const [amount, setAmount] = useState(betslip.minimum_stake);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [errMsg, setErrMsg] = useState(false);
    const {coupon} = useSelector((state) => state.couponData);

    const updateAmount = (value) => {
        if (value === 0) {
            setAmount(0);
            return;
        }

        let currentAmount = amount;
        if (currentAmount === ''){
            currentAmount = 0;
        }
        const newAmount = currentAmount + value
        setAmount(newAmount);
    }

    const rebet = (e) => {
        e.preventDefault();
        if (amount < betslip.minimum_stake){
            setErrMsg('Minimum stake for this bet is ' + betslip.minimum_stake);
            return;
        }
        setSending(true);

        rebetTipster({betslip_id: betslip.betslip_id, tipster_id: betslip.tipster_id, stake: amount, channel: 'website'})
            .then(res => {
                setSending(false);
                if (res.success) {
                    dispatch({type: UPDATE_USER_BALANCE, payload: res.available_balance});
                    dispatch({type: SHOW_TIPSTER_BET});
                    toast.success('Your bet has been placed successfully', {position: 'top-center'});
                } else if (res.message === 'auth_fail') {
                    dispatch({type: SHOW_LOGIN_MODAL});
                } else {
                    setSending(false);
                    setErrMsg(res.message);
                }
        }).catch(err => {
            setSending(false);
            if(err.response.status === 401) {
                toast.error('Please login to place this bet', {position: 'top-center'})
                dispatch({type: SHOW_LOGIN_MODAL});
            }
        });
    }


    return (
        <div className="login-popup-wrapper" id="popupLogin">
            <div className="login-popup">
                <div className="close-coupon-popup" onClick={() => dispatch({type: SHOW_TIPSTER_BET})}>
                    <i className="fa fa-times" aria-hidden="true" /></div>
                <div className="login-content">
                    <div className="title">
                        <img src="/img/check-icon.png" alt=""
                             className="title-icon" />
                        <span>Place Tipster Bet</span>
                    </div>

                        <div className="alert-bar">
                            <p>By placing this bet, you admit to relinquishing {betslip.percentage}% of your winnings as requested by the tipster</p>
                        </div>

                        <form onSubmit={rebet}>
                            {errMsg && <div className="row">
                                <div className="info-error">{errMsg}</div>
                            </div>}
                            <div className="row">
                                <div className="label">Amount</div>
                                <input
                                    type="number"
                                    name="amount"
                                    value={amount}
                                    placeholder="0.00"
                                    autoComplete="off"
                                    onChange={(e) => setAmount(e.target.value)}
                                />
                            </div>
                            <div className="row">
                                <div className="quickstake">
                                    <div className="quickstake__item" onClick={() => updateAmount(0)}> Clear</div>
                                    <div className="quickstake__item" onClick={() => updateAmount(50)}> +50</div>
                                    <div className="quickstake__item" onClick={() => updateAmount(100)}> +100</div>
                                    <div className="quickstake__item" onClick={() => updateAmount(200)}> +200</div>
                                    <div className="quickstake__item" onClick={() => updateAmount(500)}> +500</div>
                                    <div className="quickstake__item" onClick={() => updateAmount(1000)}> +1000</div>
                                </div>
                            </div>
                            <div className="button-holder">
                                <input type="submit" value={sending ? 'Placing bet...' : 'Place bet'} disabled={sending}/>

                                <a href="javascript:;" onClick={() => {
                                    dispatch({type: SHOW_TIPSTER_BET});
                                    reset()
                                }}>
                                    <div className="register-button">Cancel</div>
                                </a>
                            </div>
                        </form>

                </div>
            </div>
        </div>
    )
}
