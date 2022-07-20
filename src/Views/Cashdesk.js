import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {findFixtureWithOutcomes} from "../Services/apis";
import {toast} from "react-toastify";
import { addToCoupon, removeSelection, updateWinnings } from "../Redux/actions";
import { calculateBonus, createID } from "../Utils/couponHelpers";
import { formatNumber } from "../Utils/helpers";
import { CANCEL_BET, CONFIRM_BET, SET_COUPON_DATA } from "../Redux/types";
import { useHistory } from "react-router-dom";


export default function Cashdesk({location}) {
    const {coupon} = useSelector((state) => state.couponData);
    const {loading} = useSelector((state) => state.login);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);

    const history = useHistory();

    const [selections, setSelections] = useState([{
        event_id: '',
        event_date: '',
        event_name: '',
        tournament_name: '',
        market_code: '',
        odds: '',
        outcomes: []
    }]);
    
    const dispatch = useDispatch();

    useEffect(() => {
        document.getElementById(`event_id_0`).focus();
        return () => dispatch({type: CANCEL_BET});
    }, [])

    const findEvent = (e, i) => {
        const value = e.target.value;
        const newArr = [...selections];
        newArr[i].event_id = value;
        if(value.length === 4 || e.key === 'Enter') {
            // document.getElementById('FastCodeField').focus();
            findFixtureWithOutcomes(value).then(res => {
                if(res.event_name){
                    const input = document.getElementById(`event_code_${i}`);
                    newArr[i].event_name = res.event_name;
                    newArr[i].event_date = res.event_time;
                    newArr[i].tournament_name = res.sport_tournament_name;
                    // newArr[i].market_code = res.outcomes[0].code;
                    // newArr[i].odds = res.outcomes[0].odds;
                    newArr[i].fixture = res;
                    setSelections(newArr);
                    // const end = res.outcomes[0].code.length;
                    // input.setSelectionRange(end, end);
                    input.focus();
                }else {
                    toast.error(res.message);
                    e.target.value = '';
                }
            }).catch(err => {
                console.log(err.message);
                toast.error('Something went wrong. Please try again')
            });
        }
    }

    const changeCode = (e, i) => {
        const value = e.target.value;
        const newArr = [...selections];
        newArr[i].market_code = value;
        const splitCode = value.split('/');
        const outcomes = newArr[i].fixture.outcomes;

        if (e.key === 'Enter') {
            if (Array.isArray(splitCode) && splitCode.length > 1) {
                for (const code of splitCode) {
                    const outcome = outcomes.find(item => item.code === code);

                    dispatch(addToCoupon(selections[i].fixture, outcome.market_id, outcome.market_name, outcome.odds, outcome.odd_id, outcome.odd_name,
                        createID(selections[i].fixture.provider_id, outcome.market_id, outcome.odd_name, outcome.odd_id), selections[i].fixture.fixture_type));
                }
            } else {
                const outcome = outcomes.find(item => item.code === value);
                dispatch(addToCoupon(selections[i].fixture, outcome.market_id, outcome.market_name, outcome.odds, outcome.odd_id, outcome.odd_name,
                    createID(selections[i].fixture.provider_id, outcome.market_id, outcome.odd_name, outcome.odd_id), selections[i].fixture.fixture_type))
            }
            addCDLine();
            setTimeout(() => {
                document.getElementById(`event_id_${i+1}`).focus();
            }, 100);
        
            return;
        }
        if(splitCode.length > 1){
            let odds = '';
            for (let i = 0; i <= splitCode.length; i++) {
                const outcome = outcomes.find(item => item.code === splitCode[i]);
                if (outcome) odds += outcome.odds + (i < splitCode.length - 1 ? '/': '');
            }
            newArr[i].odds = odds;
        } else {
            const outcome = outcomes.find(item => item.code === value);

            if (outcome) {
                newArr[i].odds = outcome.odds;
            } else {
                newArr[i].odds = '';
            }
        }
        setSelections(newArr);
    }
    
    const addCDLine = () => {
        setSelections([...selections, {
            event_id: '',
            event_date: '',
            event_name: '',
            tournament_name: '',
            market_code: '',
            odds: '',
            outcomes: []
        }]);
    }

    const removeCDLine = (i) => {
        const newArr = [...selections];
        if (newArr.length > 1) {
            if (newArr[i].event_id) {
                let index = coupon.selections.findIndex(item => (item.event_id === selections[i].event_id));
                dispatch(removeSelection(coupon.selections[index]))
            }
            newArr.splice(i, 1);
            setSelections(newArr);
        }
    }

    const updateSystemWinnings = (stake, action) => {
        let coupondata = {...coupon};
        coupondata.totalStake = stake;

        if(stake !== '') {

            coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            coupondata.minStake = parseFloat(stake) / coupondata.noOfCombos;

            //calculate winnings
            let minWinnings = parseFloat(coupondata.minOdds) * parseFloat(coupondata.minStake);
            let maxWinnings = parseFloat(coupondata.maxOdds) * parseFloat(coupondata.minStake);
            //calculate bonus
            coupondata.minBonus = calculateBonus(minWinnings, coupondata, SportsbookGlobalVariable, SportsbookBonusList);
            coupondata.maxBonus = calculateBonus(maxWinnings, coupondata, SportsbookGlobalVariable, SportsbookBonusList);
            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + minWinnings;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + maxWinnings;
            const wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.wthTax = wthTax < 1 ? 0 : wthTax;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
        }
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});

    }

    return (
        <>
            <div id="MainContent" className="sport">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div id="s_w_PC_PC_panelSquare">
                                <div className="groupsDivMain">
                                    <div>
                                        <table
                                            className="dgStyle logged-table cashdesk-table" 
                                            cellSpacing="0" border="0"
                                            style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                            <thead>
                                                <tr className="dgHdrStyle">
                                                    <th></th>
                                                    <th>Event ID</th>
                                                    <th>Event Date</th>
                                                    <th className="l-table__team">Event</th>
                                                    <th>Smart Code</th>
                                                    <th>Odds</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selections.map((selection, i) =>
                                                <tr key={i}>
                                                    <td onClick={() => removeCDLine(i)}>
                                                        <div class="add-remove-icon"></div> {i + 1}.
                                                    </td>
                                                    <td>
                                                        <input autocomplete="off" id={`event_id_${i}`} type="text" defaultValue={selection.event_id} maxlength="4" onKeyUp={(e) => findEvent(e, i)} />
                                                    </td>
                                                    <td>
                                                        <span id="CDdate_1"> {selection.event_date}</span>
                                                    </td>
                                                    <td>
                                                        <span id="CDevent_1" 
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => history.push(`/Sport/EventDetail?EventID=${selection.fixture.provider_id}`)}
                                                        >
                                                            {selection.event_name}
                                                        </span>
                                                        <span style={{ color: 'grey' }}>{(selection.fixture?.sport_category_name || '') + ' - ' +selection.tournament_name}</span>
                                                    </td>
                                                    <td>
                                                        {/* <div id="CDSign_1" class="smart-bet">
                                                            <div class="red-tooltip" id="CDred_1">
                                                            <i class="fa fa-exclamation-triangle" aria-hidden="true"></i>Shortcut code is invalid
                                                        </div> */}
                                                        <input 
                                                            id={`event_code_${i}`}
                                                            type="text" autocomplete="off"
                                                            defaultValue={selection.market_code}
                                                            onKeyUp={(e) => changeCode(e, i)} 
                                                        />
                                                        <div class="tooltip-info"><i class="fa fa-table" aria-hidden="true"></i></div>
                                                    </td>
                                                    <td><span id="CDodd_1">{selection.odds}</span></td>
                                                </tr>
                                                )}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colspan="6"><div class="add-remove-icon add" onClick={addCDLine}></div></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                    <div class="cashdesk-content">
                                        <div class="cashdesk-tabs">
                                            <div class="row">
                                                <div class="tab">Total selection: <span class="selectionss">{coupon.selections.length}</span></div>
                                                <div class="tab">Min Bonus: <span id="CDminBonus">{ formatNumber(coupon.minBonus) }</span></div>
                                                <div class="tab">Min Win: <span id="CDminWin">{ formatNumber(coupon.minWin) }</span></div>
                                                <div class="stake-holder">
                                                    <span>Stake</span>
                                                    <input 
                                                        id="cashDeskStake"
                                                        type="text" 
                                                        onChange={(e) => {
                                                            if(coupon.bet_type === 'Split') {
                                                                updateSystemWinnings(e.target.value);
                                                            } else {
                                                                dispatch(updateWinnings(e.target.value))
                                                            }
                                                        }} 
                                                        value={coupon.totalStake}
                                                    />
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="tab">Total Odds: <span class="maxodd">{ coupon.totalOdds }</span></div>
                                                <div class="tab">Max Bonus: <span id="CDmaxBonus">{ formatNumber(coupon.maxBonus) }</span></div>
                                                <div class="tab green">Max Win: <span id="CDmaxWin">{formatNumber(coupon.maxWin)}</span></div>
                                                <div class="buttons">
                                                    <div 
                                                        class="cancel"
                                                        onClick={() => {
                                                            dispatch({type: CANCEL_BET})
                                                            setSelections([
                                                                {
                                                                    event_id: '',
                                                                    event_date: '',
                                                                    event_name: '',
                                                                    tournament_name: '',
                                                                    market_code: '',
                                                                    odds: '',
                                                                    outcomes: []
                                                                }
                                                            ])
                                                        }}
                                                    >Cancel</div>
                                                    <div 
                                                        class="proceed"
                                                        onClick={(e) => dispatch({type: CONFIRM_BET, payload: true})}
                                                    >Proceed</div>
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
    )
}
