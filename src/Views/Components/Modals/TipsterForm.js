import React, {useState} from 'react';
import { SHOW_TIPSTER_MODAL} from "../../../Redux/types";
import {saveTipsterBet} from "../../../Services/apis";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

const percentages = [
    { text: '10%', value: 10 },
    { text: '15%', value: 15 },
    { text: '20%', value: 20 },
    { text: '25%', value: 25 },
    { text: '30%', value: 30 },
];

export default function TipsterForm({betslip, dispatch}) {
    const [tipsterForm, setTipsterForm] = useState({
        percentage: 10,
        minimum_stake: '',
        betslip_id: betslip?.betslip_id,
    });
    const [errMsg, setErrMsg] = useState(false);
    const [loading, setLoading] = useState(false);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);


    const submitForm = (e) => {
        e.preventDefault();
        if (tipsterForm.minimum_stake < parseFloat(SportsbookGlobalVariable.MinBetStake)) {
            setErrMsg('Minimum allowed stake amount is 50');
            return;
        }
        setLoading(true);

        saveTipsterBet(tipsterForm).then(res => {
            setLoading(false);
            if (res.success) {
                toast.success('Betslip has been added to your tipster account');
                dispatch({type: SHOW_TIPSTER_MODAL});
            }
        }).catch(err => {
            setLoading(false);
            setErrMsg('Something went wrong ' + err.message);
        })

    }

    return (
        <div className="login-popup-wrapper" id="popupLogin">
            <div className="login-popup">
                <div className="close-coupon-popup" onClick={() => dispatch({type: SHOW_TIPSTER_MODAL})}>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <div className="login-content">
                    <div className="title">
                        <img src="/img/check-icon.png" alt=""
                             className="title-icon" />
                        <span>Add betslip to tipster</span>
                    </div>
                    <div className="alert-bar">
                        <p>Becoming a Tipster allows you earn extra cash from others that play your tickets.<br/>
                        You earn by making any of your betslip public, set the percentage on return you want from each person that plays your pick. <br/>
                        You only earn if you betslip is a winning betslip.</p>
                    </div>
                    <form onSubmit={submitForm}>
                        {errMsg && <div className="row">
                            <div className="info-error">{errMsg}</div>
                        </div>}
                        <div className="row">
                            <div className="label">Set the percentage you want from winnings</div>
                            <select
                                onChange={(e) => setTipsterForm({...tipsterForm, percentage: e.target.value})}
                            >
                                {percentages.map(row =>
                                    <option value={row.value}>{row.text}</option>
                                )}
                            </select>
                        </div>
                        <div className="row">
                            <div className="label">Set the minimum stake allowed for this pick</div>
                            <input
                                type="number"
                                autoComplete="off"
                                value={tipsterForm.minimum_stake}
                                onChange={(e) => setTipsterForm({...tipsterForm, minimum_stake: e.target.value})}
                            />
                        </div>
                        <div className="button-holder">
                            <a onClick={() => dispatch({type: SHOW_TIPSTER_MODAL})}>
                                <div className="register-button">Cancel</div>
                            </a>
                            <input type="submit" value={loading ? 'Saving...' : 'Submit' } />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
