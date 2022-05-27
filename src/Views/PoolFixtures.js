import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import moment from "moment";
import '../Assets/scss/_print-fixtures.scss';
import useSWR from "swr";
import {toast} from "react-toastify";
import {addToPoolCoupon, placePoolBet} from "../Redux/actions";
import {SET_POOL_STAKE} from "../Redux/types";
import {formatDate} from "../Utils/helpers";

export default function PoolFixtures({history}) {
    const [fixtures, setFixtures] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.poolCoupon);
    const gameWeek = moment().day('Saturday').format('YYYY-MM-DD');
    const [game, setGame] = useState('');

    const {data, error} = useSWR(`/sports/pool-fixtures?week=${gameWeek}`);

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
            dispatch(addToPoolCoupon(i + 1, fixture, gameWeek));
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
        dispatch(placePoolBet(e))
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
                                        Game Type
                                        <select
                                            name="ac$w$PC$PC$BetList$ddlFiltoData"
                                            id="ac_w_PC_PC_BetList_ddlFiltoData"
                                            className="dropdownFiltoData"
                                            value={coupon.gameType}
                                            style={{width:'140px'}}>
                                            <option label="NAP 3" value="NAP3">NAP 3</option>
                                            <option label="NAP 4" value="NAP4">NAP 4</option>
                                            <option label="NAP 5" value="NAP5">NAP 5</option>
                                            <option label="NAP 6" value="NAP6">NAP 6</option>
                                            <option label="NAP 7" value="NAP7">NAP 7</option>
                                            <option label="NAP 8" value="NAP8">NAP 8</option>
                                            <option label="NAP 9" value="NAP9">NAP 9</option>
                                            <option label="NAP 10" value="NAP10">NAP 10</option>
                                            <option label="PERM 3" value="PERM3">PERM 3</option>
                                            <option label="PERM 4" value="PERM4">PERM 4</option>
                                            <option label="PERM 5" value="PERM5">PERM 5</option>
                                            <option label="PERM 6" value="PERM6">PERM 6</option>
                                            <option label="PERM 7" value="PERM7">PERM 7</option>
                                            <option label="PERM 8" value="PERM8">PERM 8</option>
                                            <option label="PERM 9" value="PERM9">PERM 9</option>
                                            <option label="PERM 10" value="PERM10">PERM 10</option>
                                        </select>
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
                                        Games
                                        <input
                                            name="ac$w$PC$PC$BetList$txtCodiceCoupon"
                                            type="text"
                                            placeholder="e.g 20"
                                            value={`3 from ${coupon.selections.map(selection => selection)}`}
                                            // onChange={(e) => handleChange('betslip_id', e.target.value)}
                                            id="ac_w_PC_PC_BetList_txtCodiceCoupon"
                                            className="textbox"
                                            style={{ width: '140px', marginLeft: '38px'}}
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
                                                                    onChange={(e) => dispatch({type: SET_POOL_STAKE, payload: e.target.value})}
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
            <div className="divDg">
                <div>
                    <table className="dgStyle" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
                           style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                        <tbody>
                        <tr className="dgHdrStyle">
                            <th>S/N</th>
                            <th scope="col">Date</th>
                            <th scope="col">Fixtures</th>
                            <th scope="col">Scores</th>
                            <th scope="col">Status</th>
                            <th scope="col">Kickoff</th>
                            <th></th>
                        </tr>
                        {loading ? (
                            <tr className="dgItemStyle">
                                <td colSpan="8">Loading...Please wait!</td>
                            </tr>
                        ):(
                            fixtures.length > 0 ? (
                                fixtures.map((fixture, i) =>
                                    <tr className="div-table-row" key={`key_${fixture.id}`} id={`event_${fixture.id}`}>
                                        <td className="div-table-cell">
                                            <span className="div-table-cell-start-in-span">{i + 1}</span>
                                        </td>
                                        <td className="div-table-cell">
                                            <span className="div-table-cell-start-in-span">{formatDate(fixture.event_date, 'DD.MM')}</span>
                                        </td>
                                        <td className="div-table-cell div-table-cell-left">
                                            <span className="div-table-cell-match" >
                                                <span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate'}}>{fixture.home_team}</span>
                                                <span dir="ltr" style={{direction: 'ltr', unicodeBidi: 'isolate'}}> - {fixture.away_team}</span>
                                            </span>
                                            {/*<button className="statscore-btn" onClick={() => dispatch({
                                                type: SHOW_STAT_MODAL,
                                                payload: {show: true, eventID: fixture.provider_id}
                                            })}><i className="fa fa-bar-chart" /></button>*/}
                                        </td>
                                        <td align="center" className="div-table-cell">
                                            <span className="div-table-cell-start-in-span">-:-</span>
                                        </td>
                                        <td align="center" className="div-table-cell">
                                            <span className="div-table-cell-start-in-span">{'Saturday'}</span>
                                        </td>
                                        <td align="center" className="div-table-cell">
                                            <span className="div-table-cell-start-in-span">
                                                <nvs-configure-time-for-view date-time="event.start_time" className="">{fixture.event_time}</nvs-configure-time-for-view>
                                            </span>
                                        </td>
                                        <td align="center" className="div-table-cell-odd ">
                                            <button
                                                onClick={() => dispatch(addToPoolCoupon(i + 1, fixture, gameWeek))}
                                                className={`div-table-cell-span ${coupon.selections.includes(i + 1) ? 'active' : ''}`}
                                            >
                                                {coupon.selections.includes(i + 1) ? 'Selected' : 'Select'}
                                            </button>
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
