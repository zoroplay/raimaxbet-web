import React, {useState} from 'react';
import {SHOW_DEPOSIT_MODAL} from "../../../Redux/types";
import {useSelector} from "react-redux";
import {sendDeposit} from "../../../Services/apis";

export default function DepositModal({dispatch}) {
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const [amount, setAmount] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [errMsg, setErrMsg] = useState(false);

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

    const submit = (e) => {
        e.preventDefault();
        setSending(true);
        if(amount < SportsbookGlobalVariable.MinDeposit) {
            setErrMsg('The minimum deposit amount is ' + SportsbookGlobalVariable.MinDeposit);
            setSending(false);
            return;
        }

        sendDeposit({amount}).then(res => {
            setSending(false);
            if (res.success) {
                setSent(true);
            } else {
                setErrMsg(res.message || res.error_message);
            }
            // console.log(res);
        }).catch(err => {
            setSending(false);
            setErrMsg('Something went wrong ' + err.message);

        })
    }

    return (
        <div className="login-popup-wrapper" id="popupLogin">
            <div className="login-popup">
                <div className="close-coupon-popup" onClick={() => dispatch({type: SHOW_DEPOSIT_MODAL})}>
                    <i className="fa fa-times" aria-hidden="true" /></div>
                <div className="login-content">
                    <div className="title">
                        <img src="//atlantiq1.brlgcs.com/atlantiq1/images/check-icon.png" alt=""
                             className="title-icon" />
                        <span>Deposit</span>
                    </div>
                    {sent ?
                        <div className="alert-bar">
                            <p>Deposit request has been sent. Please follow the instructions on your mobile device.</p>
                        </div>
                        :
                        <form onSubmit={submit}>
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
                                <input type="submit" value={sending ? 'Sending Request...' : 'Deposit'} disabled={sending}/>

                                <a href="javascript:;" onClick={() => dispatch({type: SHOW_DEPOSIT_MODAL})}>
                                    <div className="register-button">Cancel</div>
                                </a>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}
