import React, {useCallback, useEffect, useState} from 'react';

import JackpotLayout from "./layout/JackpotLayout";
import {getJackpots, getSplitProps} from "../Services/apis";
import {calculateExclusionPeriod, formatDate, formatNumber, isSelected} from "../Utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {checkBetType, createID, groupSelections, groupTournament} from "../Utils/couponHelpers";
import {
    LOADING,
    SHOW_LOGIN_MODAL,
    UPDATE_USER_BALANCE
} from "../Redux/types";
import {toast} from "react-toastify";
import {Http} from "../Utils";

export default function Jackpot() {
    const {user} = useSelector((state) => state.auth);
    const [jackpots, setJackpots] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setSubmitting] = useState(false);
    const [coupon, setCoupon] = useState({
        selections: [],
        totalOdds: 1,
        maxBonus: 0,
        minBonus: 0,
        maxWin: 0,
        minWin: 0,
        stake: 0,
        totalStake: 0,
        minOdds: 1,
        maxOdds: 1,
        event_type: 'jackpot',
        channel: 'website',
        autopick: 0,
        jackpot_id: null
    });
    const [activeJackpot, setActiveJackpot] = useState(null);
    const dispatch = useDispatch();

    const init = useCallback( () => {
        dispatch({type: LOADING})
        getJackpots().then(res => {
            dispatch({type: LOADING});
            // console.log(res)
            if (res.length > 0) {
                setJackpots(res);
                setActiveJackpot(res[0]);
                setCoupon({
                    ...coupon,
                    stake: res[0].stake,
                    totalStake: res[0].stake,
                    maxWin: res[0].amount,
                    jackpot_id: res[0].id
                })
            }
        })
    }, []);

    useEffect(() => {
        init();
    }, [init]);

    useEffect(() => {
        if (coupon.autopick > 0) {
            // loop through fixtures to make random selection
            activeJackpot.fixtures.forEach(fixture => {
                const num = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
                fixture.market.selections.forEach(selection => {
                    if (selection.id === num) {
                        addToJackpot(fixture, selection, createID(fixture.provider_id, fixture.market.market_id, selection.name, selection.id))
                    }
                })
            });
        }
    }, [coupon.autopick]);

    const proceed = () => {
        if (coupon.selections.length && groupSelections(coupon.selections).length === activeJackpot.fixtures.length) {
            setShowConfirm(true);
        } else {
            toast.error('You must make at least one selection from each game');
        }
    }

    const addToJackpot = async (fixture, selection, ele_id) => {
        const data = {
            provider_id: fixture.provider_id,
            event_id: fixture.event_id,
            event_name: fixture.event_name,
            market_id: fixture.market.market_id,
            market_name: fixture.market.market_name,
            oddname: selection.name,
            odd_id: selection.id,
            odds: selection.odds,
            element_id: ele_id,
            start_date: fixture.schedule,
            tournament: fixture.sport_tournament_name,
            category: fixture.sport_category_name,
            sport: fixture.sport_name,
            type: 'jackpot',
        };

        let couponData = {...coupon};
        //

        for (let i = 0; i < couponData.selections.length; i++) {
            //check if it's same event selected and remove it
            if (couponData.selections[i].element_id === data.element_id) {
                //remove item
                couponData.selections.splice(i, 1);
                //check if couponData still has selections
                if (couponData.selections.length > 0) {
                    //group selections by match
                    couponData.tournaments = groupTournament(couponData.selections);
                    //check bet type
                    couponData.bet_type = checkBetType(couponData);

                    if (couponData.bet_type === 'Split') {
                        couponData = await getSplitProps(couponData);
                    }else { // else remove selection from total odds
                        couponData.totalOdds = (parseFloat(couponData.totalOdds) / parseFloat(data.odds)).toFixed(2);
                        couponData.noOfCombos = 1;
                    }
                    couponData.stake = parseFloat(activeJackpot.stake) * parseFloat(couponData.noOfCombos);

                    return setCoupon(couponData);
                } else {
                    resetCoupon();
                    return;
                }
            }
        }
        for (let i = 0; i < couponData.selections.length; i++) {
            if(couponData.selections[i].provider_id === data.provider_id){
                //remove item
                couponData.selections.splice(i, 1);
                // if (!couponData.noOfCombos || couponData.noOfCombos < 4) {
                //     couponData.selections.push(data);
                //
                //     //group selections by match
                //     couponData.tournaments = groupTournament(couponData.selections);
                //
                //     couponData.bet_type = 'Split';
                //     // remove item
                //     // couponData.selections.splice(i, 1);
                //     couponData = await getSplitProps(couponData);
                //     couponData.stake = parseFloat(activeJackpot.stake) * parseFloat(couponData.noOfCombos);
                //
                //     return setCoupon(couponData);
                // } else {
                //     return;
                // }
            }
        }

        couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
        //add selection to selections list
        couponData.selections.push(data);
        //group selections by match
        couponData.tournaments = groupTournament(couponData.selections);
        // couponData.fixtures = groupSelections(couponData.selections);
        //check bet type
        couponData.bet_type = checkBetType(couponData);

        if (couponData.bet_type === 'Split') {
            couponData = await getSplitProps(couponData);
        }

        return setCoupon(couponData);

    }

    const jackpotAutoPickup = () => {
        // reset selections
        setCoupon({
            selections: [],
            totalOdds: 1,
            maxBonus: 0,
            minBonus: 0,
            maxWin: activeJackpot.amount,
            minWin: 0,
            stake: activeJackpot.stake,
            totalStake: activeJackpot.stake,
            minOdds: 1,
            maxOdds: 1,
            event_type: 'jackpot',
            channel: 'website',
            autopick: coupon.autopick + 1,
            jackpot_id: activeJackpot.id
        })

    }

    const resetCoupon = () => {
        setCoupon({
            selections: [],
            totalOdds: 1,
            maxBonus: 0,
            minBonus: 0,
            maxWin: activeJackpot.amount,
            minWin: 0,
            stake: activeJackpot.stake,
            totalStake: activeJackpot.stake,
            minOdds: 1,
            maxOdds: 1,
            event_type: 'jackpot',
            channel: 'website',
            autopick: 0,
            jackpot_id: null
        })
    }

    const closeConfirm = () => {
        setShowConfirm(false);
    }

    const confirmCoupon = () => {
        if (user.settings?.self_exclusion_period) {
            toast.error(`You have been temporary locked out for the next ${calculateExclusionPeriod(user.settings?.self_exclusion_period)} days due to your responsible gaming self exclusion settings.`)
            return;
        }
        const data = {...coupon};
        data.bet_type = 'Jackpot';

        setSubmitting(true);
        Http.post('sports/place-bet?channel=website', data).then(res => {
            setSubmitting(false);
            setShowConfirm(false);
            if (res.success) {
                // update user balance
                dispatch({type: UPDATE_USER_BALANCE, payload: res.balance});
                toast.success('Your jackpot bet has been placed successfully');
                // return dispatch({type: SET_BET_PLACED, payload: res});
                resetCoupon();
            } else if (res.message === 'auth_fail') {
                return dispatch({type: SHOW_LOGIN_MODAL})
            } else if (res.message === 'odds_change') {

                toast.error('Attention! some odds have been changed');
                setTimeout(() => {
                    window.location.reload();
                }, 3000)

            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            setSubmitting(false);

            if(err.response.status === 401){
                toast.error('Please login to place bets');
                setShowConfirm(false);
                dispatch({type: SHOW_LOGIN_MODAL});
            }
        });
    }

    const changeJackpot = (jackpot) => {
        setActiveJackpot(jackpot);
        setCoupon({
            ...coupon,
            stake: jackpot.stake,
            maxWin: jackpot.amount,
            jackpot_id: jackpot.id
        })
        resetCoupon();
    }

    const printJackpot = (jackpot) => {
        window.open(`${process.env.REACT_APP_BASEURL}/print-jackpot/${jackpot}`, 'mywin',
            ''); return false;
    }

    return (
        <JackpotLayout>
            <div className="jkpt-inner">

                <div className="jkpp-mid">
                    <ul className="jkpp-mid-list" id="jackpotList">
                        {jackpots && jackpots.map(jackpot =>
                            <li className="jkpp-mid-list-li" key={jackpot?.id}>
                                <a href="javascript:;"
                                   onClick={() => changeJackpot(jackpot) }
                                   className={activeJackpot?.id === jackpot?.id ? 'active' : ''}>
                                    <h1>{jackpot.title}</h1>
                                </a>
                            </li>
                        )}
                    </ul>
                </div>

                <div className="jktxt-container">
                    <div className="jktxt-inner">

                        <h3 className="jktxt-phrase" id="jname">{activeJackpot?.title}</h3>
                        <button className="jkpp-print" onClick={() => printJackpot(activeJackpot.id)}>
                            <i className="fa fa-print"></i>
                            Print
                        </button>
                    </div>
                </div>

                <div className="jkban-container">
                    <div className="jkban-inner">

                        <div className="jkban-amt" id="jackpotTotal">{formatNumber(activeJackpot?.amount)}</div>
                        <h2 className="jkban-txt">NGN</h2>
                    </div>
                </div>

                <div className="jkpt-odds">
                    <div className="jkpt-odds-inner">
                        <table className="jkpt-table">
                            <tbody id="jackpotMatches">
                            <tr className="jkpt-heads">
                                <td className="jkpt-head" />
                                <td className="jkpt-head">1</td>
                                <td className="jkpt-head">X</td>
                                <td className="jkpt-head">2</td>
                            </tr>
                            {activeJackpot && activeJackpot.fixtures.length > 0 &&
                                activeJackpot.fixtures.map(fixture =>
                                    <tr className="jkpt-row" key={fixture.provider_id}>
                                        <td>
                                            <div className="jkpt-group">
                                                <div className="jkpt-group-a">
                                                    <a href="#" className="">{fixture.event_name}</a>
                                                </div>
                                                <div className="jkpt-group-b">
                                                    <span className="jkpt-dt">{formatDate(fixture.schedule, 'DD/MM')}</span>
                                                    <span className="jkpt-dt">{fixture.event_time}</span>
                                                </div>
                                            </div>
                                        </td>
                                        {fixture.market && fixture.market.selections.length > 0 && fixture.market.selections.map(selection =>
                                        <td key={fixture.provider_id + '-' +selection.id}>
                                            <a href="javascript:;"
                                               key={selection.id}
                                               onClick={() => addToJackpot(fixture, selection, createID(fixture.provider_id, fixture.market.market_id, selection.name, selection.id))}
                                               className={`jkpt-odd ${(isSelected(createID(fixture.provider_id, fixture.market.market_id, selection.name, selection.id), coupon)) ? 'selected' : ''}`}
                                            >{selection.odds}</a>
                                        </td>
                                        )}
                                    </tr>
                                )}
                            </tbody>
                        </table>

                    </div>
                </div>

                <div className="jkpt-cta">
                    <div className="jkpt-cta-inner">
                        <div className="jkpt-cta-a">
                            <div className="cxbtn" onClick={jackpotAutoPickup}>
                                <div className="cxbtn-ico">
                                    <i className="fa fa-random cxbtn-ico-src" />
                                </div>
                                <input type="hidden" name="roundId" id="roundId" value="0" />
                                <div className="cxbtn-txt">auto pickup</div>
                            </div>
                        </div>
                        <div className="jkpt-cta-b">
                            <span className="totstk">Stake:</span>
                            <div className="totstk-box">
                                <div className="totstk-cur">NGN</div>
                                <div className="totstk-amt" id="price">{activeJackpot?.stake}</div>
                            </div>
                        </div>
                        <div className="jkpt-cta-b">
                            <span className="totstk">Comb:</span>
                            <div className="totstk-box">
                                <div className="totstk-amt" id="combo">{coupon?.noOfCombos || 1}</div>
                            </div>
                        </div>
                        <div className="jkpt-cta-b">
                            <span className="totstk">total stake:</span>
                            <div className="totstk-box">
                                <div className="totstk-cur">NGN</div>
                                <div className="totstk-amt" id="total">{coupon?.stake}</div>
                            </div>
                        </div>

                        <div className="jkpt-cta-c">

                            <div className="kkxbtn kkxbtn-stop" onClick={resetCoupon}>
                                <div className="kkxbtn-ico">
                                    <i className="fa fa-times kkxbtn-ico-src"></i>
                                </div>
                                <div className="kkxbtn-txt">Cancel</div>
                            </div>

                            <div className="kkxbtn kkxbtn-go" onClick={proceed}>
                                <div className="kkxbtn-ico">
                                    <i className="fa fa-check-square-o kkxbtn-ico-src"></i>
                                </div>
                                <div className="kkxbtn-txt">Proceed</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showConfirm &&
            <div className="bet-confirm-popup-wrapper">
                <div className="bet-confirm-popup">
                    <div className="close-bet-confirm-popup" onClick={closeConfirm}>
                        <i className="fa fa-times" aria-hidden="true" />
                    </div>
                    <div className="bet-confirm-content">
                        <div className="title">
                            <img src="/img/bet-confirm-info.png" alt="" />
                            <span>You are about to place a jackpot bet for <b>{coupon.stake}NGN</b>, please confirm that you would like to proceed.</span>
                        </div>
                        <div className="buttons">
                            <div className="cancel-button button" onClick={closeConfirm}>
                                Cancel
                            </div>
                            <div className="confirm-button button" onClick={confirmCoupon}>
                                Confirm {isSubmitting && <i className="fa fa-spinner fa-spin" />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </JackpotLayout>
    )
}
