import React, {useState} from 'react';
import {formatDate, formatNumber} from "../../../Utils/helpers";
import {useDispatch, useSelector} from "react-redux";
import {CANCEL_BET, CONFIRM_BET, SET_BET_PLACED, SHOW_LOGIN_MODAL, SHOW_TIPSTER_MODAL} from "../../../Redux/types";
import {placeBet, updateWinnings} from "../../../Redux/actions";
import {checkOddsChange, printTicket} from "../../../Utils/couponHelpers";
import {toast} from "react-toastify";
import {NavLink} from "react-router-dom";

export default function ConfirmSlip({couponData}) {
    const dispatch = useDispatch();
    const [giftCode, setGiftCode] = useState(null);
    const {coupon, betPlaced, confirm} = couponData;
    const {isAuthenticated, user} = useSelector(state => state.auth);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);

    const close = () => {
        if(betPlaced) {
            dispatch({type: CANCEL_BET});
        }
        dispatch({type: CONFIRM_BET, payload: false});
        dispatch({type: SET_BET_PLACED, payload: null});
    }

    const showLogin = () => {
        dispatch({type: SHOW_LOGIN_MODAL});
        dispatch({type: CONFIRM_BET, payload: false});
        dispatch({type: SET_BET_PLACED, payload: null});
    }

    const showRegister = () => {
        dispatch({type: CONFIRM_BET, payload: false});
    }

    const confirmBet = async (e) => {
        if (coupon.hasLive) {
            // set button ele
            const ele = document.getElementById('placeBetBtn');
            ele.disabled = true;
            ele.innerHTML = 'Verifying...';

            try {
                const oddsChanged = await checkOddsChange(coupon, dispatch, SportsbookGlobalVariable, SportsbookBonusList);

                if (oddsChanged) { // if odds have changed, close modal
                    ele.disabled = false;
                    ele.innerHTML = 'Place Bet';
                    close();
                    toast.error('Some odds have changed. Please confirm your bets to proceed');
                } else {
                    dispatch(placeBet(ele, 'bet', giftCode));
                }
            } catch (e) {
                ele.disabled = false;
                ele.innerHTML = 'Place Bet';
                toast.error('We were unable to process your bet. Please try again');
            }
        }else {
            // console.log(e)
            dispatch(placeBet(e,'bet', giftCode));
        }
    }

    const showTipsterForm = () => {
        dispatch({type: SHOW_TIPSTER_MODAL, payload: couponData.betPlaced.coupon});
        close();
    }

    return (
        <>
            <div id="popupPrenotatoreSco">
                <div>
                    <div className="divTitle" id="PCDTitle"><a onClick={() => close()} id="popupPrenotatoreScoClose"></a></div>
                </div>
                <div id="divBody">
                    <div className="prenSco" id="prenSco">
                        {betPlaced && betPlaced.type === 'booking' && <div id="info">
                            <div id="play">
                                <div>
                                    <span className="title">
                                        <span style={{ color: '#264d22' }}>
                                            Excellent news! Your bet has been booked.
                                        </span>
                                    </span>
                                    <span className="content">
                                        Please print it and go to any Pitch90 betting shop to lay the bet.
                                        The bet is valid only when authorised in a betting shop, and the final ticket is released.
                                        Odds may change.
                                        <br />
                                        <a href="/Pages/Tutorial_book/Guest" target="_blank">find out more</a>
                                    </span>

                                </div>

                                {!isAuthenticated &&
                                <div>
                                    <a id="popUp_PC_lnkPrint" onClick={showLogin} className="lnk Print"
                                       href="javascript:;">Login</a>
                                   {/* <div id="prenScoSendMail" className="sendMail">
                                        <a className="lnk eMailFake">
                                            Send the booking via email
                                        </a>
                                    </div>*/}
                                </div>}
                            </div>

                            {!isAuthenticated &&
                            <div id="register">
                                <div>
                                    <span className="title">Bet Online!</span>
                                    <span className="content">
                                        If you want to bet online, open an account using our form.
                                        If you're already registered, close this window and login.
                                    </span>
                                </div>
                                <div>
                                    <NavLink to="/Auth/Register" onClick={showRegister} className="lnk Register">Register Now</NavLink>
                                </div>
                            </div> }
                        </div>}
                        {betPlaced && <div id="bookHead">
                            {betPlaced?.type === 'booking' ? (
                                <>
                                    <span className="number">Booking Number: <span>{betPlaced.coupon.code}</span></span>
                                    <span className="date">{formatDate(betPlaced.coupon.created_at, 'YYYY-MM-DD HH:mm')}</span>
                                </>
                            ):(
                                <span className="number">Bet successfully placed. Assigned Bet ID: <span>{betPlaced.coupon.betslip_id}</span></span>
                                )
                            }
                        </div>}
                        {confirm && !betPlaced &&
                        <div id="bookHead">
                            <span className="number"><span>Preview and Confirm Bet</span></span>
                        </div>}

                        <div id="bookDett">

                            <div className="rep">
                                <div className="item hdr">
                                    <div className="cod">
                                        Code
                                    </div>
                                    <div className="date">
                                        Date
                                    </div>
                                    <div className="event">
                                        Event
                                    </div>
                                    <div className="tipo">
                                        Live/Prematch
                                    </div>
                                    <div className="tq">
                                        Selection
                                    </div>
                                </div>
                                {coupon.selections.length > 0 &&
                                    coupon.selections.map((selection, key) =>
                                        <div className={`item ${selection.hasError ? 'started' : ''}`} key={key}>
                                            <div className="cod">{selection.event_id}</div>
                                            <div className="date">
                                                {formatDate(selection.start_date, 'DD/MM/YYYY HH:mm')}
                                            </div>
                                            <div className="event">
                                                <span id="popUp_PC_repGrid_ctl01_Evento" title="Brighton - West Brom">{selection.event_name}</span>
                                            </div>
                                            <div className="tipo">{selection.type}</div>
                                            <div className="tq">{selection.oddname} <span className="Cerror"></span></div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <div id="bookFooter">
                            <table style={{width: '100%', border: '1px solid #ccc', margin: '20px 0'}}>
                                <tr>
                                    <th>Odds</th>
                                    <th>Stake</th>
                                    <th>Gross Win</th>
                                    <th>Pot. Net Win</th>
                                    <th>WTH Tax</th>
                                </tr>
                                <tr>
                                    <td>{formatNumber(coupon.totalOdds)}</td>
                                    <td>{SportsbookGlobalVariable.Currency} {formatNumber(coupon.stake)}</td>
                                    <td>{SportsbookGlobalVariable.Currency} {formatNumber(coupon.grossWin)}</td>
                                    <td>{SportsbookGlobalVariable.Currency} {formatNumber(coupon.maxWin)}</td>
                                    <td>{SportsbookGlobalVariable.Currency} {formatNumber(coupon.wthTax)}</td>
                                </tr>
                            </table>

                            {confirm && !betPlaced &&
                                <>
                                    <label htmlFor="giftCode" className="txt-blue" style={{fontSize: '15px'}}>Claim Coupon Gift</label><br/>
                                    <input
                                        type="text"
                                        id="giftCode"
                                        className="form-input mb10"
                                        placeholder="Enter gift card code"
                                        onChange={(e) => setGiftCode(e.target.value)}
                                        onBlur={(e) => dispatch(updateWinnings(100))}
                                    />
                                    <div className="txt-c">
                                        <button
                                            id="placeBetBtn"
                                            style={{padding: '2px 25px'}}
                                            onClick={(e) => confirmBet(e)}
                                            className="button px-5">Place Bet
                                        </button>
                                    </div>
                                </>
                            }
                            {betPlaced && betPlaced.type === 'bet' &&
                                <div className="txt-c">
                                    <button className="button px-5 btn-blue" onClick={()=>printTicket(betPlaced.coupon.betslip_id, betPlaced.ticketType)}>Print Ticket</button>

                                    <button className="button px-5" onClick={close}>Bet Again (+)</button>

                                    {user.role === 'Player' && <button className="button px-5 btn-green" onClick={showTipsterForm}>Add to Tipster (+)</button>}
                                </div>
                            }
                            {/*<span className="barcode">
                <img id="popUp_PC_imgBarCode"
                     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMoAAAAfCAYAAACmllI0AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAZYSURBVHhelYtRauBQEMN6/0t3GxaBI54SItCHPZ6fP35XcIbqDbvau9/tak6bS3A2+7M79whvfVF7C9Wbr3eye+MdFr7vz1OPcLqtUNm98Q6h8ngvwBmqN+xq7363qzltLsHZ7M/u3CO89UXtLVRvvt7J7o13WPi+P089wum2QmX3xjuEyuO9AGeo3rCrvfvdrua0uQRnsz+7c4/w1he1t1C9+XonuzfeYeH7/jz1CKfbCpXdG+8QKo/3ApyhesOu9u53u5rT5hKczf7szj3CW1/U3kL15uud7N54h4Xv+/PUI5xuK1R2b7xDqDzeC3CG6g272rvf7WpOm0twNvuzO/cIb31RewvVm693snvjHRa+789Tj3C6rVDZvfEOofJ4L8AZqjfsau9+t6s5bS7B2ezP7twjvPVF7S1Ub77eye6Nd1j4vj9PPcLptkJl98Y7hMrjvQBnqN6wq7373a7mtLkEZ7M/u3OP8NYXtbdQvfl6J7s33mHh+/489Qin2wqV3RvvECqP9wKcoXrDrvbud7ua0+YSnM3+7M49wltf1N5C9ebrnezeeIeF7/vz1COcbitUdm+8Q6g83gtwhuoNu9q73+1qTptLcDb7szv3CG99UXsL1Zuvd7J74x0Wvu/PU49wuq1Q2b3xDqHyeC/AGao37GrvfrerOW0uwdnsz+7cI7z1Re0tVG++3snujXdY+L4/Tz3C6bZCZffGO4TK470AZ6jesKu9+92u5rS5BGezP7tzj/DWF7W3UL35eie7N95h4fv+PPUIp9sKld0b7xAqj/cCnKF6w6727ne7mtPmEpzN/uzOPcJbX9TeQvXm653s3niHhe/789QjnG4rVHZvvEOoPN4LcIbqDbvau9/tak6bS3A2+7M79whvfVF7C9Wbr3eye+MdFr7vz1OPcLqtUNm98Q6h8ngvwBmqN+xq7363qzltLsHZ7M/u3CO89UXtLVRvvt7J7o13WPi+P089wum2QmX3xjuEyuO9AGeo3rCrvfvdrua0uQRnsz+7c4/w1he1t1C9+XonuzfeYeH7/jz1CKfbCpXdG+8QKo/3ApyhesOu9u53u5rT5hKczf7szj3CW1/U3kL15uud7N54h4Xv+/PUI5xuK1R2b7xDqDzeC3CG6g272rvf7WpOm0twNvuzO/cIb31RewvVm693snvjHRa+789Tj3C6rVDZvfEOofJ4L8AZqjfsau9+t6s5bS7B2ezP7twjvPVF7S1Ub77eye6Nd1j4vj9PPcLptkJl98Y7hMrjvQBnqN6wq7373a7mtLkEZ7M/u3OP8NYXtbdQvfl6J7s33mHh+/489Qin2wqV3RvvECqP9wKcoXrDrvbud7ua0+YSnM3+7M49wltf1N5C9ebrnezeeIeF7/vz1COcbitUdm+8Q6g83gtwhuoNu9q73+1qTptLcDb7szv3CG99UXsL1Zuvd7J74x0Wvu/PU49wuq1Q2b3xDqHyeC/AGao37GrvfrerOW0uwdnsz+7cI7z1Re0tVG++3snujXdY+L4/Tz3C6bZCZffGO4TK470AZ6jesKu9+92u5rS5BGezP7tzj/DWF7W3UL35eie7N95h4fv+PPUIp9sKld0b7xAqj/cCnKF6w6727ne7mtPmEpzN/uzOPcJbX9TeQvXm653s3niHhe/789QjnG4rVHZvvEOoPN4LcIbqDbvau9/tak6bS3A2+7M79whvfVF7C9Wbr3eye+MdFr7vz1OPcLqtUNm98Q6h8ngvwBmqN+xq7363qzltLsHZ7M/u3CO89UXtLVRvvt7J7o13WPi+P089wum2QmX3xjuEyuO9AGeo3rCrvfvdrua0uQRnsz+7c4/w1he1t1C9+XonuzfeYeH7/jz1CKfbCpXdG+8QKo/3ApyhesOu9u53u5rT5hKczf7szj3CW1/U3kL15uud7N54h4Xv+/PUI5xuK1R2b7xDqDzeC3CG6g272rvf7WpOm0twNvuzO/cIb31RewvVm693snvjHRa+789Tj3C6rVDZvfEOofJ4L8AZqjfsau9+t6s5bS7B2ezP7twjvPVF7S1Ub77eye6Nd1j4vj9PPcLptkJl98Y7hMrjvQBnqN6wq7373a7mtLkEZ7M/u3OP8NYXtbdQvfl6J7s33mHh+/489Qin2wqV3RvvECr/9+f3H8AOZMtlPGm+AAAAAElFTkSuQmCC"
                     style={{borderWidth:'0px'}} />
                            </span>*/}
                        </div>

                    </div>
                </div>
            </div>
            <div id="backgroundPrenotatoreSco" onClick={close} />
        </>
    )
}
