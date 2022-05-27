import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import '../Assets/scss/_print-fixtures.scss';
import {formatDate, formatNumber, getOdds, isSelected} from "../Utils/helpers";
import useSWR from "swr/esm/use-swr";
import {addToCoupon, addToWeeklyCoupon, placeCouponBet, updateCouponWinnings} from "../Redux/actions";
import {createID} from "../Utils/couponHelpers";
import {toast} from "react-toastify";
import {CANCEL_BET} from "../Redux/types";

export default function WeeklyCoupon({history}) {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.weeklyCoupon);
    const gameWeek = moment().day('Saturday').format('YYYY-MM-DD');
    const {data, error} = useSWR(`/sports/pool-fixtures?week=${gameWeek}`);
    const [game, setGame] = useState('');

    useEffect(() => {
        if(data) {
            setLoading(false);
            setFixtures(data);
        }
    }, [data]);

    const addGame = () => {
        // find game index
        const i = fixtures.findIndex((item, i) => i + 1 === parseInt(game));
        if (i !== -1) {
            const fixture = fixtures[i];
            dispatch(addToWeeklyCoupon(fixture, gameWeek, createID(fixture.id, 1, 'X', 2)));
            toast.success(`Game ID ${game} has been added`);
            setGame('');
        } else {
            toast.error('Game ID not found please enter a number between 1 and 49');
        }
    }

    const submit = (e) => {
        if (!coupon.selections.length){
            toast.error('Please select at least 3 games to place bet');
            return;
        }

        if (coupon.stake === 0) {
            toast.error('Please enter a stake amount');
            return;
        }
        dispatch(placeCouponBet(e))
    }

    return (
        <Fragment>
            <div className="RiquadroSrc">
                <div className="Cnt">
                    <div>
                        <div id="ac_w_PC_PC_BetList_panForm">
                            <table id="tblSearch" className="SearchContainerStyle">
                                <tbody>
                                <tr className="SearchSectionStyle">
                                    <td className="SearchDescStyle">
                                        Total Odds
                                        <input
                                            type="text"
                                            className="textbox"
                                            name="odds"
                                            value={coupon.totalOdds}
                                            style={{ width: '100px', marginLeft: '56px'}}
                                            aria-invalid="false"
                                            readOnly
                                        />
                                    </td>
                                    <td className="SearchControlsStyle">
                                        <table width="100%">
                                            <tbody>
                                            <tr>
                                                <td width="20%" className="SearchControlDesc">
                                                    Fixture S/N
                                                </td>
                                                <td width="30%">
                                                    <table cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    name="fixture_sn"
                                                                    type="text"
                                                                    placeholder="e.g 20"
                                                                    onChange={(e) => setGame(e.target.value)}
                                                                    onKeyPress={(e) => {
                                                                        if(e.key === 'Enter') addGame();
                                                                    }}
                                                                    id="ac_w_PC_PC_BetList_txtCodiceCoupon"
                                                                    className="textbox"
                                                                />
                                                            </td>
                                                            <td className="tdSrcDX">
                                                                <input
                                                                    type="submit" name="ac$w$PC$PC$BetList$btnAvanti"
                                                                    value="Add To Betslip"
                                                                    // onClick={() => fetchResult(1)}
                                                                    id="ac_w_PC_PC_BetList_btnAvanti" className="button" />
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr className="SearchSectionStyle">
                                    <td className="SearchDescStyle">
                                        Pot. Winnings
                                        <input
                                            name="pot-winnings"
                                            type="text"
                                            placeholder="e.g 20"
                                            value={formatNumber(coupon.maxWin)}
                                            id="ac_w_PC_PC_BetList_txtCodiceCoupon"
                                            className="textbox"
                                            style={{ width: '100px', marginLeft: '38px'}}
                                        />
                                    </td>
                                    <td className="SearchControlsStyle">
                                        <table width="100%">
                                            <tbody>
                                            <tr>
                                                <td width="20%" className="SearchControlDesc">
                                                    Amount
                                                </td>
                                                <td width="30%">
                                                    <table cellPadding="0" cellSpacing="0">
                                                        <tbody>
                                                        <tr>
                                                            <td>
                                                                <input
                                                                    name="ac$w$PC$PC$BetList$txtCodiceCoupon"
                                                                    type="text"
                                                                    placeholder="e.g 20"
                                                                    value={coupon.stake}
                                                                    onChange={(e) => dispatch(updateCouponWinnings(e.target.value))}
                                                                    id="ac_w_PC_PC_BetList_txtCodiceCoupon"
                                                                    className="textbox"
                                                                />
                                                            </td>
                                                            <td className="tdSrcDX">
                                                                <input
                                                                    type="submit" name="ac$w$PC$PC$BetList$btnAvanti"
                                                                    value="Place Bet"
                                                                    style={{width: '104px'}}
                                                                    onClick={submit}
                                                                    id="ac_w_PC_PC_BetList_btnAvanti" className="button" />
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="divDg match-data-container">
                <div>
                    <table className="dgStyle match-data-table" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
                           style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                        <tbody className="match-data-tbody">
                        <tr className="dgHdrStyle">
                            <th>S/N</th>
                            <th scope="col">Date</th>
                            <th scope="col">Time</th>
                            <th scope="col">Match/Competition</th>
                            <th>X</th>
                        </tr>
                        {loading ? (
                            <tr className="dgItemStyle">
                                <td colSpan="8">Loading...Please wait!</td>
                            </tr>
                        ):(
                            fixtures.length > 0 ? (
                                fixtures.map((fixture, i) =>
                                    <tr className="div-table-row" key={`key_${fixture.id}`} id={`event_${fixture.id}`}>
                                        <td className="div-table-cell" align="center">
                                            <span className="div-table-cell-start-in-span">{i + 1}</span>
                                        </td>
                                        <td className="div-table-cell" align="center">
                                            <span className="div-table-cell-start-in-span">{formatDate(fixture.event_date, 'DD.MM')}</span>
                                        </td>
                                        <td className="div-table-cell" align="center">
                                                <span className="div-table-cell-start-in-span">
                                                    <nvs-configure-time-for-view date-time="event.start_time" className="">{fixture.event_time}</nvs-configure-time-for-view>
                                                </span>
                                        </td>
                                        <td className="div-table-cell div-table-cell-left">
                                            <span className="div-table-cell-match" >
                                                <span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate'}}>{fixture.home_team}</span>
                                                <span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate'}}> - {fixture.away_team}</span>
                                            </span>
                                        </td>

                                        <td className="div-table-cell-odd " align="center">
                                            <span
                                                onClick={() => dispatch(addToWeeklyCoupon(fixture, gameWeek, createID(fixture.id, 1, 'X', 2)))}
                                                className={`match-value odd quote 
                                                ${(isSelected(createID(fixture.id, 1, 'X', 2), coupon)) ? 'selected' : ''}`}
                                            >{fixture.odds}</span>
                                        </td>
                                    </tr>
                                )
                            ):(
                                <tr className="dgEmptyStyle">
                                    <td colSpan="8">
                                        No record found
                                    </td>
                                </tr>
                            )
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    )
}
