import React, {useEffect, useState} from "react";
import {findCoupon, loadCoupon, processCashout} from "../../Services/apis";
import {formatDate, formatNumber} from "../../Utils/helpers";
import BetListOutcome from "../Components/BetListOutcome";
import { groupTournament, printTicket} from "../../Utils/couponHelpers";
import {useDispatch, useSelector} from "react-redux";
import {SET_COUPON_DATA} from "../../Redux/types";

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

    const reloadCoupon = () => {
        loadCoupon(betslip?.betslip_id, 'rebet').then(res => {

            if (res.message === 'found' && res.coupon.selections.length) {
                let couponData = res.coupon;
                couponData.tournaments = groupTournament(couponData.selections);
                dispatch({type: SET_COUPON_DATA, payload: couponData});
                history.push('/');
            } else {
                alert('Unable to rebet the selected coupon because all the events are expired');
                // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Coupon not found'}})
            }
        }).catch(err => {});
    }

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
                                                        <td className="SectionTitle" colSpan="4">Betslip</td>
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
                                                        <th scope="col">Event</th>
                                                        <th scope="col">Start Date</th>
                                                        <th scope="col">Quota Class</th>
                                                        <th scope="col">Type</th>
                                                        <th scope="col">Odds</th>
                                                        <th className="BetDetailRisultato" scope="col">HT Score</th>
                                                        <th className="BetDetailRisultato" scope="col">Result</th>
                                                        <th scope="col">Outcome</th>
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
                                                        <input
                                                            type="button"
                                                            name="ac$w$PC$PC$btnTorna"
                                                            value="Print Ticket"
                                                            id="ac_w_PC_PC_btnTorna"
                                                            onClick={() => printTicket(betslip?.betslip_id)}
                                                            className="button" />
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
                                                    onClick={reloadCoupon}
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
