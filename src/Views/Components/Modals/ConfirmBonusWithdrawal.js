import React, {useState} from 'react';
import { SET_USER_DATA, SHOW_BONUS_CONFIRM} from "../../../Redux/types";
import {formatNumber} from "../../../Utils/helpers";
import {redeemBonus} from "../../../Services/apis";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

export default function ConfirmBonusWithdrawal({amount, dispatch}) {
    const [sending, setSending] = useState(false);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    const doRedeem = () => {
        setSending(true);
        redeemBonus().then(res => {
            setSending(false);
            if (res.success) {
                toast.success(res.message)
                dispatch({type: SET_USER_DATA, payload: res.data});
                dispatch({type: SHOW_BONUS_CONFIRM, payload: {show: false, amount: 0}});
            } else {
                toast.error(res.message);
                dispatch({type: SHOW_BONUS_CONFIRM, payload: {show: false, amount: 0}});
            }
        }).catch(err => {
            setSending(false);
            toast.error('Something went wrong. Unable to process request');
        })
    }
    return (
        <div className="login-popup-wrapper" id="popupLogin">
            <div className="login-popup">
                <div className="close-coupon-popup" onClick={() => dispatch({type: SHOW_BONUS_CONFIRM, payload: {show: false, amount: 0}})}>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <div className="login-content">
                    <div className="title">
                        <img src="//atlantiq1.brlgcs.com/atlantiq1/images/check-icon.png" alt=""
                             className="title-icon" />
                        <span>Redeem your bonus Winnings</span>
                    </div>
                    <div className="alert-bar">
                        <p>Congratulations!! You can now redeem your bonus winning of <strong>{SportsbookGlobalVariable.Currency + ' ' +formatNumber(amount)}</strong> to your real balance.</p>
                        <p>Are you sure you want to redeem your bonus?</p>
                    </div>
                    <form>
                    <div className="button-holder">
                        <input type="submit" onClick={doRedeem} value={sending ? 'Submitting Request...' : 'Yes, Redeem'} disabled={sending}/>

                        <a href="javascript:;" onClick={() => dispatch({type: SHOW_BONUS_CONFIRM, payload: {show: false, amount: 0}})}>
                            <div className="register-button">No, Later</div>
                        </a>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
