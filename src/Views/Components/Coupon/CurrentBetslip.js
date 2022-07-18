import React, {Fragment} from 'react';
import {Multiple} from "./BetTypes/Multiple";
import {Combined} from "./BetTypes/Combined";
import {Split} from "./BetTypes/Split";
import {CANCEL_BET, CONFIRM_BET, SET_COUPON_TYPE, SET_USE_BONUS} from "../../../Redux/types";
import {fastAdd, placeBet, removeSelection} from "../../../Redux/actions";
import {formatNumber} from "../../../Utils/helpers";
import {useSelector} from "react-redux";

export default function CurrentBetslip({coupon, dispatch, user}) {
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);

    return (
        <div id="coupon">
            <div className="selections-wrapper">
                <div className="selections">
                    <div className="selection">Selections <span className="selectionss">{coupon.selections.length}</span></div>
                    <div className="max-odd">Max Odd <span className="maxodd" id="quota">{coupon.totalOdds}</span></div>
                </div>
                <div id="couponEvents">
                    {coupon.tournaments.map(tournament =>
                        <Fragment>
                            <div className="tournament-name">{`${tournament.category} / ${tournament.tournamentName}`}</div>
                            {tournament.fixtures.map(fixture =>
                            <div className="single-event" key={`group-event-${fixture.provider_id}`}>
                                <div className="match-info">
                                    {fixture.type === 'pre' && <div className="id">{fixture.event_id}</div>}
                                    {fixture.type === 'live' && <div className="isLive">Live</div>}
                                    <div className="team-names">{fixture.event_name}</div>
                                    <div id="f_23204141" className="bonus " style={{ display: 'none' }}>B</div>
                                </div>
                                {fixture.selections.map(selection =>
                                    <div className={`selected-bet ${selection.classList || ''}`} key={`selection-${selection.odd_id}`}>
                                        <div className="remove-icon" onClick={() => dispatch(removeSelection(selection))}>
                                            <div className="icon-holder">
                                                <img src="/img/cross-red.png" alt="" />
                                            </div>
                                        </div>
                                        <div className="bet">
                                            <span>{coupon?.tipster_id ? '***' : selection.market_name}: {coupon?.tipster_id ? '**' : selection.oddname}</span>
                                            <div className="quote-holder">
                                                <div className="quote" id="no_23204141_10_2_">{selection.odds}</div>
                                                <div className="quote old" id="oo_23204141_10_2_">{selection.oldOdds}</div>
                                            </div>
                                        </div>
                                        {/* <div class="previousOdds">2.10</div> */}
                                    </div>
                                )}
                            </div>
                            )}
                        </Fragment>
                    )}
                </div>
            </div>
            <div className="combination-wrapper">
                <div className="select-wrapper" id="cTipi">
                    <div className="combination-type" id="tSingle"  style={{ display: 'none' }}>Single</div>
                    {coupon.bet_type === 'Split' ?
                        <div className="combination-type" style={{width: '100%'}}>Split Column Bet</div>
                        :
                        <>
                            <div className={`combination-type ${coupon.bet_type === 'Multiple' ? 'active' : ''}`}
                                 id="tMultiple"
                                 onClick={() => {
                                     dispatch({type: SET_COUPON_TYPE, payload: 'Multiple'});
                                     dispatch(fastAdd(0));
                                 }}
                            >Multiple</div>
                            <div className={`combination-type ${coupon.bet_type === 'Combo' ? 'active' : ''}`}
                                 id="tCombination"
                                 onClick={() => {
                                    dispatch({type: SET_COUPON_TYPE, payload: 'Combo'});
                                    dispatch(fastAdd(0))
                                 }}
                            >Combo Bet</div>
                            {/*<div className={`combination-type ${coupon.bet_type === 'Single' ? 'active' : ''}`}
                                 id="tMultiple"
                            >Single</div>
                            <div className={`combination-type ${coupon.bet_type === 'Multiple' ? 'active' : ''}`}
                                 id="tCombination"
                            >Multiple</div>*/}
                        </>
                    }
                </div>
                {
                    {
                        'Combo':  <Combined couponData={coupon} dispatch={dispatch} globalVar={SportsbookGlobalVariable} bonusList={SportsbookBonusList} />,
                        'Split' : <Split couponData={coupon} dispatch={dispatch} globalVar={SportsbookGlobalVariable} bonusList={SportsbookBonusList} />
                    }[coupon.bet_type] || <Multiple couponData={coupon} dispatch={dispatch} globalVar={SportsbookGlobalVariable} />
                }


                <div className="totals-section">
                    <div id="couponFooter">
                        {
                            {
                               'Combo' : <table id="couponWinningCompositeSystem" >
                                   <tbody>
                                   <tr>
                                       <td colSpan="2">
                                           Stake <span id="totalStake">{coupon.stake || 0}</span>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td className="colored" colSpan="2">Potential Winnings</td>
                                   </tr>
                                   <tr>
                                       <td>Min Odd <span className="minodd">{coupon.minOdds}</span></td>
                                       <td>Max Odd <span className="maxodd">{coupon.maxOdds}</span></td>
                                   </tr>
                                   <tr>
                                       <td>Mn Bonus <span id="minBonus">{formatNumber(coupon.minBonus)}</span></td>
                                       <td>Mx Bonus <span id="maxBonus">{formatNumber(coupon.maxBonus)}</span></td>
                                   </tr>
                                   <tr>
                                       <td>Mn Win <span id="minWin">{formatNumber(coupon.minWin)}</span></td>
                                       <td>Mx Win <span id="maxWin">{formatNumber(coupon.maxWin)}</span></td>
                                   </tr>
                                   </tbody>
                               </table>,
                               'Split' : <table id="couponWinningCompositeIntegral"  >
                                   <tbody>
                                   {/*<tr>
                                       <td colSpan="2">
                                           Total stake <span id="totalStake">{coupon.totalStake || 0}</span>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td colSpan="2">
                                           Excise Duty <span id="totalStake">{coupon.exciseDuty || 0}</span>
                                       </td>
                                   </tr>*/}
                                   <tr>
                                       <td colSpan="2">
                                        stake <span id="totalStake">{coupon.stake || 0}</span>
                                       </td>
                                   </tr>
                                   <tr>
                                       <td className="colored" colSpan="2">Potential Winnings</td>
                                   </tr>
                                   <tr>
                                       <td>Min Odd <span id="minoddIntegral">{coupon.minOdds?.toFixed(2)}</span></td>
                                       <td>Max Odd <span id="maxoddIntegral">{coupon.maxOdds?.toFixed(2)}</span></td>
                                   </tr>
                                   <tr>
                                       <td>Mn Bonus <span id="minBonusIntegral">{formatNumber(coupon.minBonus)}</span></td>
                                       <td>Mx Bonus <span id="maxBonusIntegral">{formatNumber(coupon.maxBonus)}</span></td>
                                   </tr>
                                   <tr>
                                       <td>Mn Win <span id="minWinIntegral">{formatNumber(coupon.minGrossWin)}</span></td>
                                       <td>Mx Win <span id="maxWinIntegral">{formatNumber(coupon.grossWin)}</span></td>
                                   </tr>
                                   {/* <tr>
                                       <td colSpan="2">Winning Tax Percentage :<span id="taxPercentageIntegral">20%</span></td>
                                   </tr>
                                   <tr>
                                       <td colSpan="2">WTH <span id="taxOnWinIntegral">{formatNumber(coupon.wthTax)}</span></td>
                                   </tr>
                                   <tr>

                                       <td colSpan="2">Max Win Full<span id="maxWinIntegralFull">0.00</span></td>
                                   </tr>*/}
                                   </tbody>
                               </table>
                            }[coupon.bet_type] || <table id="couponWinningSimple">
                                <tbody>
                                <tr>
                                    <td>
                                        Stake <span id="totalStake">{coupon.totalStake || 0}</span>
                                    </td>
                                    <td>
                                        Odds <span className="maxodd">{coupon.totalOdds}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="colored" colSpan="2">Potential Winnings</td>
                                </tr>
                                <tr>
                                    <td colSpan="2">Bonus <span id="multipleBonus">{formatNumber(coupon.maxBonus)}</span></td>
                                </tr>

                                </tbody>
                            </table>
                        }
                    </div>

                    <div>
                        <table>
                            <tbody>
                            <tr>
                                <td colSpan="4" className="allow-changes">
                                    <div className="check">
                                        <input type="checkbox" id="allowChangeOdds" />
                                        <input type="hidden" id="livello" value="" />
                                        <span className="checkmark"></span>
                                    </div>
                                    <span>Allow Odds Changes</span>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="totals">
                        <div className="winning">
                            <div className="coupon-potential-winning-label">
                                Potential Net Win
                            </div>
                            {SportsbookGlobalVariable.Currency} <span id="potentialWin">{formatNumber(coupon.maxWin)}</span>
                            {/*                            <span id="potentialWinIntegral">42825.83</span>
                            <span id="potentialWinSystem" >0</span>*/}
                        </div>
                        {user && user?.bonus_balance >= coupon.stake && parseFloat(coupon.totalOdds) >= process.env.REACT_APP_MIN_BONUS_ODD
                        && coupon.bet_type !== 'Split' && coupon.bet_type !== 'Combo' &&
                        <div className="bonus-btn">
                            <a href="javascript:void(0)" className="genBtn" onClick={async (e) => {
                                await dispatch({type: SET_USE_BONUS})
                                dispatch({type: CONFIRM_BET, payload: true})
                            }}>USE BONUS</a>
                        </div> }
                        
                        {coupon.hasError ? 
                            <div class="oddsChanged" ng-if="couponCtrl.couponContainsOddChanges()">
                                <div class="message">
                                Some of the selected odds have changed.
                                </div>
                                <button class="acceptChanges" ng-click="couponCtrl.acceptOddChanges()">
                                <i class="fa fa-check" aria-hidden="true"></i><span>Accept</span>
                                </button>
                            </div>
                        :
                            <div className="buttons">
                                <div className="cancel" onClick={() => dispatch({type: CANCEL_BET})}>Cancel</div>
                                <div className="book" onClick={(e) => dispatch(placeBet(e, 'booking'))}>Book</div>
                                <div className="proceed" onClick={(e) => dispatch({type: CONFIRM_BET, payload: true})}>Proceed</div>
                            </div>
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}
