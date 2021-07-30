import React, {useEffect, useState} from "react";
import '../../Assets/scss/app.scss';
import {getBonuses} from "../../Services/apis";
import {toast} from "react-toastify";
import {formatDate, formatNumber} from "../../Utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {SHOW_BONUS_CONFIRM} from "../../Redux/types";


export function Bonuses({history}) {
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const dispatch = useDispatch();
    const [bonuses, setBonuses] = useState([]);
    const [redeemable, setRedeemable] = useState({canRedeem: false, amount: 0});
    const toggle = (e) => {
        e.currentTarget.classList.toggle('opened');
    }

    useEffect(() => {
        fetchBonuses();
    }, []);

    const fetchBonuses = () => {
        getBonuses().then(r => {
            if(r.success) {
                setBonuses(r.data.bonuses);
                setRedeemable(r.data.redeem);
            } else {
                toast.error(r.message);
            }
        }).catch(err => {
            toast.error('Internal server eror');
        })
    }
    return (
        <>
            <div id="MainContent" className="">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div className="payments">
                                <div className="RiquadroSrc">
                                    <div className="Cnt">
                                        <div>
                                            <div className="page__head">
                                                <div className="page__head-item"><h1> Bonus History</h1></div>
                                                {redeemable.canRedeem && <div className="page__head-item txt-r">
                                                    <button className="btn green" onClick={() =>
                                                        dispatch({
                                                            type: SHOW_BONUS_CONFIRM,
                                                            payload: {show: true, amount: redeemable.amount}
                                                        })}
                                                    > Redeem Bonus</button>
                                                </div>}
                                            </div>
                                            <div className="page__body pt15 pb15">
                                                <div className="bonus indent">
                                                    <div className="accordion ">
                                                        {bonuses.map(bonus =>
                                                            <div className={`accordion__item ${bonus.status === 1 ? 'opened' : ''}`} onClick={toggle} key={bonus.id}>
                                                            <div className="accordion__header collapsible">
                                                                <div className="accordion-toggle"></div>
                                                                <div className="accordion__cnt">
                                                                    <div className="accordion__cnt-item "><strong>{bonus.bonus.name}</strong></div>
                                                                    <div className="accordion__cnt-item txt-r">
                                                                        <strong>{bonus.status === 1 ? 'Active' : 'Finished'}</strong></div>
                                                                </div>
                                                            </div>
                                                            <div className="accordion__body " tabIndex="0">
                                                                <div className="accordion__content"><h3
                                                                    className="txt-darkblue"> Bonus Sport
                                                                    Withdrawal</h3><p> Bets must be placed on events
                                                                    that will be settled BEFORE the bonus expires. Once
                                                                    the wagering has been completed, please ensure to
                                                                    redeem your bonus balance before the expiry date</p>
                                                                    <div className="progress green mt20">
                                                                        <div className="progress__bar">
                                                                            <div className="progress__fill"
                                                                                 style={{width: '0%'}}>
                                                                                <div className="progress__percent">0%
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <table className="default mt20"
                                                                           style={{tableLayout: 'unset'}}>
                                                                        <thead>
                                                                        <tr>
                                                                            <th> Date</th>
                                                                            <th> Stake</th>
                                                                            <th> Remaining</th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>

                                                                        {bonus.transactions.map(transaction =>
                                                                            <tr>
                                                                                <td>{formatDate(transaction.created_at, 'DD/MM/YYYY, HH:mm')}</td>
                                                                                <td>
                                                                                    {(transaction.tranx_type === 'credit')? formatNumber(transaction.amount) : '-' + formatNumber(transaction.amount)}
                                                                                    {SportsbookGlobalVariable.Currency}
                                                                                </td>
                                                                                <td>
                                                                                    <strong>
                                                                                        {(transaction.tranx_type === 'credit')? formatNumber(transaction.to_user_balance) : formatNumber(transaction.from_user_balance)}
                                                                                        {SportsbookGlobalVariable.Currency}
                                                                                    </strong>
                                                                                </td>
                                                                            </tr>
                                                                        )}
                                                                        </tbody>
                                                                    </table>
                                                                    {/*<div className="mt20 txt-c"><a
                                                                        href="https://promo.bet9ja.com/drm-sprts-jul-2021/"
                                                                        className="txt-blue"
                                                                        target="_blank"> Terms &amp; Conditions</a>
                                                                    </div>*/}
                                                                </div>
                                                            </div>
                                                        </div>)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
