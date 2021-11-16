import React, {useEffect, useState} from "react";
import {findCoupon, processCashout} from "../../Services/apis";
import {formatDate, formatNumber} from "../../Utils/helpers";
import BetListOutcome from "../Components/BetListOutcome";
import { printTicket} from "../../Utils/couponHelpers";
import {useDispatch, useSelector} from "react-redux";
import {reloadCoupon} from "../../Redux/actions";

export default function BetDetail({match, history}) {
    const betslip_id = match.params.betslip;
    const dispatch = useDispatch();
    const [betslip, setBetslip] = useState(null);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const [cashoutModal, setCashoutModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [settled, setSettled] = useState(false);
    const {user} = useSelector(state => state.auth);

    const getBetslip = () => {
        findCoupon(betslip_id).then(res => {
            if (res.message === 'found') {
                setBetslip(res.coupon);
            } else {
                history.goBack();
            }
        }).catch(err => {} );
    }

    useEffect(() => {
        if (betslip_id) {
            getBetslip();
        }
    }, [betslip_id]);

    const doCashout = () => {
        setProcessing(true);
        setCashoutModal(false);
        processCashout(betslip_id).then(res => {
            setProcessing(false);
            if (res.success) {
                setSettled(true);
            }
        })
    }

    return (
        <>
        <div id="MainContent" className="">
            <div className="Riquadro">
                <div className="CntSX">
                    <div className="CntDX">
                        <div id="ac_w_PC_PC_panelSquare">
                            <span className="noBetFound"></span>
                            <div id="ac_w_PC_PC_panel_DataGrid">
                                <div className="NormalPageContent">
                                    <table cellPadding="0" cellSpacing="0" width="100%" align="center">
                                        <tbody>
                                        <tr>
                                            <td colSpan="4" id="tdData">
                                                <table cellSpacing="1" cellPadding="0" width="100%" align="center">
                                                    <tbody>
                                                    <tr>
                                                        <td className="SectionTitle" colSpan="3">Betslip</td>
                                                        <td className="SectionTitle" style={{textAlign: "right"}}>
                                                            <a href="javascript:;" onClick={() => history.goBack()} >
                                                                <i className="fa fa-caret-left fa-2x fa-fw" />
                                                            </a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx" width="40%">Betslip ID</td>
                                                        <td className="cellaDx">{betslip?.betslip_id}</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx" width="40%">Coupon Status</td>
                                                        <td className="cellaDx">{betslip?.status === 0 ? 'Running' : 'Settled - Close'}</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx">User</td>
                                                        <td className="cellaDx">{betslip?.user.code + ' ' + betslip?.user.username}</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>

                                                    <tr>
                                                        <td className="cellaSx">Date</td>
                                                        <td className="cellaDx">{formatDate(betslip?.created_at, 'DD/MM/YYYY HH:mm:ss')}</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx">Bet Type</td>
                                                        <td className="cellaDx">{betslip?.event_type === 'jackpot' ? 'Jackpot' : betslip?.bet_type}</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>
                                                   {/* <tr>
                                                        <td className="cellaSx">Transaction Type</td>
                                                        <td className="cellaDx">User Account</td>
                                                        <td className="cellaSx">&nbsp;</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                    </tr>*/}


                                                    {/*<tr>
                                                        <td className="cellaSx">Pending</td>
                                                        <td className="cellaDx">&nbsp;</td>
                                                        <td className="cellaSx"></td>
                                                        <td className="cellaDx"><span
                                                            id="ac_w_PC_PC_lblImportoOriginale"></span>&nbsp;</td>
                                                    </tr>*/}


                                                    </tbody>
                                                </table>

                                                <table id="ac_w_PC_PC_tbl_DettagliScommessa" cellPadding="0"
                                                       cellSpacing="1" width="100%" align="center">
                                                    <tbody>
                                                    <tr>
                                                        <td className="SectionTitle" colSpan="2">Detail</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx" width="40%">Status</td>
                                                        <td className="cellaDx">
                                                            {
                                                                {
                                                                    0: <span className="">Running</span>,
                                                                    1: <span className="detScoEsitoVin">Won</span>,
                                                                    2: <span className="detScoEsitoPer">Lost</span>,
                                                                    3: <span className="">Cancel</span>,
                                                                }[betslip?.status]
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="cellaSx" width="40%"><span
                                                            className="detScoIG">Stake</span></td>
                                                        <td className="cellaDx">
                                                            <span className="detScoIG">{SportsbookGlobalVariable.Currency}&nbsp;{formatNumber(betslip?.stake)}</span>
                                                            <div></div>
                                                        </td>
                                                    </tr>
                                                    {betslip?.bet_type !== 'Jackpot' &&
                                                    <tr>
                                                        <td className="cellaSx">Bonus</td>
                                                        <td className="cellaDx">
                                                            {SportsbookGlobalVariable.Currency}&nbsp;
                                                            {
                                                                {
                                                                    'Split': `${formatNumber(betslip?.min_bonus)} / ${formatNumber(betslip?.bonus)}`,
                                                                    'Combo': `${formatNumber(betslip?.min_bonus)} / ${formatNumber(betslip?.bonus)}`
                                                                }[betslip?.bet_type] || formatNumber(betslip?.bonus)
                                                            }
                                                        </td>
                                                    </tr>}
                                                    <tr id="ac_w_PC_PC_trVincita">
                                                        <td className="cellaSx" width="40%"><span
                                                            className="detScoVP">Winnings</span></td>
                                                        <td className="cellaDx"><span className="detScoVP">
                                                            {SportsbookGlobalVariable.Currency}&nbsp;
                                                            {betslip?.bet_type === 'Jackpot' && formatNumber(betslip?.winnings) }

                                                            {
                                                                betslip?.status === 0 ? (
                                                                    {
                                                                        'Split': `${formatNumber(betslip?.min_winnings)} / ${formatNumber(betslip?.pot_winnings)}`,
                                                                        'Combo': `${formatNumber(betslip?.min_winnings)} / ${formatNumber(betslip?.pot_winnings)}`
                                                                    }[betslip?.bet_type] || formatNumber(betslip?.pot_winnings)
                                                                ) : formatNumber(betslip?.winnings)
                                                            }
                                                        </span>
                                                        </td>
                                                    </tr>
                                                    {betslip?.bet_type !== 'Jackpot' &&
                                                    <tr id="ac_w_PC_PC_trQuota">
                                                        <td className="cellaSx">
                                                            <span className="detScoOdd">Odd</span></td>
                                                        <td className="cellaDx">
                                                            <span className="detScoOdd">
                                                                 {
                                                                     {
                                                                         'Split': `${formatNumber(betslip?.min_oods)} / ${formatNumber(betslip?.odds)}`,
                                                                         'Combo': `${formatNumber(betslip?.min_odds)} / ${formatNumber(betslip?.odds)}`
                                                                     }[betslip?.bet_type] || formatNumber(betslip?.odds)
                                                                 }
                                                            </span>
                                                        </td>
                                                    </tr>
                                                    }

                                                    {betslip?.cashout > 0 && betslip.event_type !== 'jackpot' && betslip?.status === 0 &&
                                                    <tr id="ac_w_PC_PC_trCashout" className="rowCashout">
                                                        <td className="cellaSx">
                                                            <span className="detCashOut">Cashout</span>
                                                        </td>
                                                        <td className="cellaDx">
                                                            {processing ?
                                                                <span className="txt-darkgreen">Processing...</span>
                                                                :
                                                                settled ?
                                                                    <span className="txt-darkgreen">Settled</span>
                                                                    :
                                                                        <div id="ac_w_PC_PC_pnlCashout"
                                                                             className="cashout">
                                                                            <div>
                                                                                <div
                                                                                    className="pnlConfirm enableConfirm"
                                                                                    onClick={() => setCashoutModal(true)}>
                                                                                    <div
                                                                                        className="value">{formatNumber(betslip?.cashout)} ₦
                                                                                    </div>
                                                                                    <div
                                                                                        className="btnConfirm"/>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                            }
                                                        </td>
                                                    </tr>}
                                                    {/*<tr id="ac_w_PC_PC_betDetailDate">
                                                        <td className="cellaSx" width="40%">Payment Date</td>
                                                        <td className="cellaDx">26/10/2020 21:18:00</td>
                                                    </tr>*/}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">
                                            </td>
                                        </tr>

                                        <tr>
                                            <td colSpan="4">

                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="RiquadroNews">
                                    <div className="TopSX">
                                        <div className="TopDX"></div>
                                    </div>
                                    <div className="Cnt">
                                        <div>
                                            {betslip?.system_bets.length > 0 &&
                                                <>
                                                    <table cellSpacing="1" cellPadding="0" width="100%" align="center"
                                                           border="0">
                                                        <tbody>
                                                        <tr>
                                                            <td className="SectionTitle">Bets</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <table className="dgStyle" cellSpacing="0" align="Center" border="0"
                                                           id="ac_w_PC_PC_dg_ElencoEventi"
                                                           style={{
                                                               borderWidth: '0px',
                                                               borderStyle: 'None',
                                                               width: '100%',
                                                               borderCollapse: 'collapse'
                                                           }}>
                                                        <tbody>
                                                        <tr className="dgSubHdrStyle">
                                                            <th><span>Combination Type</span></th>
                                                            <th><span>No of Combinations</span></th>
                                                            <th><span>Amount</span></th>
                                                            <th><span>Pot. Winnings</span></th>
                                                            <th><span>Status</span></th>
                                                            <th><span>Pot. Bonus</span></th>
                                                            <th><span>Winning</span></th>
                                                            <th><span>Payment Date</span></th>
                                                        </tr>
                                                        {betslip?.system_bets.map(combo =>
                                                        <tr key={`combo-${combo.id}`} style={{textAlign: "center"}}>
                                                            <td><span>{combo.combination_type}</span></td>
                                                            <td><span>{combo.no_of_combos}</span></td>
                                                            <td><span><span>{combo.no_of_combos}</span> x <span>₦{combo.min_stake}</span></span></td>
                                                            <td><span className="cell-content ng-isolate-scope">₦{formatNumber(combo.min_win)}</span></td>
                                                            <td><span><BetListOutcome outcome={betslip.status} /></span></td>
                                                            <td><span>₦{formatNumber(combo?.min_bonus)}</span></td>
                                                            <td><span>{combo.status === 0 ? ' - ' : formatNumber(combo?.winnings)}</span></td>
                                                            <td><span>{combo.payment_date ? formatDate(combo.payment_date, 'MMM DD, YYYY') : '-'}</span></td>
                                                        </tr>)}
                                                        </tbody>
                                                    </table>
                                                </>
                                            }
                                            <table cellSpacing="1" cellPadding="0" width="100%" align="center"
                                                   border="0">
                                                <tbody>
                                                <tr>
                                                    <td className="SectionTitle">Event List</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div>
                                                <table className="dgStyle" cellSpacing="0" align="Center" border="0"
                                                       id="ac_w_PC_PC_dg_ElencoEventi"
                                                       style={{
                                                           borderWidth: '0px',
                                                           borderStyle: 'None',
                                                           width: '100%',
                                                           borderCollapse: 'collapse'
                                                       }}>
                                                    <tbody>
                                                    <tr className="dgSubHdrStyle">
                                                        <th >Event</th>
                                                        <th >Start Date</th>
                                                        <th >Quota Class</th>
                                                        <th >Type</th>
                                                        <th >Odds</th>
                                                        <th className="BetDetailRisultato" >HT Score</th>
                                                        <th className="BetDetailRisultato" >Result</th>
                                                        <th >Outcome</th>
                                                    </tr>
                                                    {betslip?.selections.map((selection, i) =>
                                                        <tr className="dgItemStyle" key={selection.provider_id}>
                                                            <td>
                                                                {selection.event}
                                                            </td>
                                                            <td align="center">{formatDate(selection.start_date, 'DD/MM/YYYY HH:mm')}</td>
                                                            <td align="center">
                                                                {selection?.market_name}
                                                            </td>
                                                            <td align="center">{selection?.odd_name}</td>
                                                            <td align="center">{selection.odds}</td>
                                                            <td className="BetDetailRisultato" align="center" style={{whiteSpace:'nowrap'}}>
                                                                <span title="Final Result">{selection?.ht_score}</span>
                                                            </td>
                                                            <td className="BetDetailRisultato" align="center" style={{whiteSpace:'nowrap'}}>
                                                                <span title="Final Result">{selection?.score}</span>
                                                            </td>
                                                            <td align="center">
                                                                <BetListOutcome outcome={selection.status} />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    </tbody>
                                                </table>
                                            </div>

                                            <table className="SearchButtonsStyle">
                                                <tbody>
                                                <tr>
                                                    <td className="tdSrcSX">
                                                        {betslip?.event_type !== 'jackpot' && !betslip?.tipster_id && betslip?.active_selections_count !== 0 &&

                                                        <input
                                                            type="button"
                                                            name="ac$w$PC$PC$btnTorna"
                                                            value="Print Ticket"
                                                            id="ac_w_PC_PC_btnTorna"
                                                            onClick={() => printTicket(betslip?.betslip_id)}
                                                            className="button" /> }
                                                    </td>

                                                    <td className="tdSrcDX">
                                                        {user?.role !== 'Player' && <input
                                                            type="button"
                                                            name="ac$w$PC$PC$btnTorna"
                                                            value="Back"
                                                            id="ac_w_PC_PC_btnTorna"
                                                            onClick={() => history.goBack()}
                                                            className="button" />}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <div className="divBetDetailsRebet">
                                                {betslip?.event_type !== 'jackpot' &&
                                                <input
                                                    type="button"
                                                    name="ac$w$PC$PC$btnRebet"
                                                    value="Rebet"
                                                    onClick={() => dispatch(reloadCoupon(betslip?.betslip_id, 'rebet')) | history.push('/')}
                                                    id="ac_w_PC_PC_btnRebet" className="button"/>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div className="BtmSX">
                                        <div className="BtmDX"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            {cashoutModal && <div className="cashoutPopup" id="cashoutPopup">
                <div className="popupBG"></div>
                <div className="popupContent">
                    <div className="titlePopup">Confirm Cashout
                        <div className="closePopup" onClick={() => setCashoutModal(false)}></div>
                    </div>
                    <div className="mainContent">
                        <div className="highText">You are Cashing Out {betslip?.cashout} ₦</div>
                        <div className="mainText">Are you sure?</div>
                    </div>
                    <div className="btnPanel">
                        <div className="confirmButton" onClick={doCashout}>Yes</div>
                        <div className="cancelButton">Cancel</div>
                    </div>
                </div>
            </div>}
        </>
    )
}
