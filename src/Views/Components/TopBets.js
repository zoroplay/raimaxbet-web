import React, { useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {
    formatDate,
    getOdds, getStats,
    groupFixtures,
    isSelected,
} from "../../Utils/helpers";
import {NavLink} from "react-router-dom";
import {addToCoupon} from "../../Redux/actions";
import {createID} from "../../Utils/couponHelpers";
import Loader from "./Loader";
import useSWR from "swr/esm/use-swr";

export default function TopBets() {
    const [topBets, setTopBets] = useState(null);
    const [loading, setLoading] = useState(true);
    const [fixtures, setFixtures] = useState([]);
    const [activeTournament, setActiveTournament] = useState([]);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const [predictions, setPredictions] = useState([]);

    const {data: res, error} = useSWR('/sports/topbets');

    useEffect(() => {
        if (res) {
            setLoading(false);
            setActiveTournament(res.topbets[0]?.tournament_id)
            setTopBets(res);
            setPredictions(res.predictions);
        }
    }, [res]);

    useEffect(() => {
        if(activeTournament) {
            const events = topBets?.events.filter(item => item.sport_tournament_id === activeTournament);
            setFixtures(events);
        }
    }, [activeTournament, topBets]);

    return (

        <div className="topbets-container">
            <div className="topbets-top">
                <h4>Top Bets</h4>
                <div id="sb_1" data-id="1" className="topbets-tab active">
                    <a href="#">Football</a>
                </div>
            </div>
            <div className="topbets-bottom">
                {topBets && topBets.topbets.map(topbet =>
                    <div
                        onClick={() => setActiveTournament(topbet?.tournament_id)}
                        className={`topbets-cell sg_1 ${topbet?.tournament_id === activeTournament ? 'selected' : ''}`}
                        key={`topbet-item-${topbet.id}`}>
                        <p className="nomeGruppo ng-binding">{topbet.tournament.category.name}</p>
                        <h4 className="nomeEvento ng-binding">{topbet.tournament.name}</h4>
                    </div>
                )}
            </div>
            <div className="match-data-container">
                <table className="match-data-table">
                    <tbody className="match-data-tbody">
                    <tr className="stat-top">
                        <th className="match">Match</th>
                        <th colSpan="3">1X2</th>
                        <th colSpan="3">Double Chance</th>
                        <th colSpan="2">Over/Under 2.5</th>
                    </tr>
                    <tr className="stat-bottom">
                        <th></th>
                        <th>1</th>
                        <th>X</th>
                        <th>2</th>
                        <th>1X</th>
                        <th>12</th>
                        <th>X2</th>
                        <th>Over</th>
                        <th>Under</th>
                    </tr>
                    {loading ?
                        <tr>
                            <td colSpan="9">
                                <Loader />
                            </td>
                        </tr>
                    :
                    fixtures && groupFixtures(fixtures).map((fixture, i) =>
                        <>
                        <tr className="date" key={i}>
                            <td colSpan={9}>{formatDate(fixture.event_date, 'dddd DD, MMMM')}</td>
                        </tr>
                        {fixture.events.map(match =>
                            <>
                                <tr className="stat-row" key={`key_${match.provider_id}`} id={`event_${match.provider_id}`}>
                                    <td className="match-teams-content">
                                        <div className="match-teams-content">
                                            <NavLink  to={`/Sport/EventDetail?EventID=${match.provider_id}`} className="match-teams-content-a">
                                                <span className="match-teams">{match.event_name}</span>
                                            </NavLink>
                                            <div className="match-teams-content-b">
                                                <span className="match-date">{match.event_id}</span>
                                                <span className="match-time">{formatDate(match.schedule, 'HH:mm')}</span>
                                                <a className="match-grap" onClick={() => getStats(match)} href="#" />
                                                <a className="head-grap"  href="#" />
                                            </div>
                                        </div>
                                    </td>
                                    {predictions.length > 0 && predictions.map(row =>
                                        <td key={`prediction-${row.odd_id}`}>
                                            <span
                                                onClick={() => dispatch(addToCoupon(match, row.market_id, row.market_name, getOdds(row, match.odds), row.odd_id, row.odd_name, createID(match.provider_id, row.market_id, row.odd_name, row.odd_id), match.fixture_type))}
                                                className={`match-value odd quote ${(isSelected(createID(match.provider_id, row.market_id, row.odd_name, row.odd_id), coupon)) ? 'selected' : ''}`}>{getOdds(row, match.odds)}</span>
                                        </td>
                                    )}
                                </tr>
                                <tr key={`c_${match.id}`}>
                                    <td colSpan="11">
                                        <div className={`SingleInsideStats_${match.provider_id}`} />
                                    </td>
                                </tr>
                                </>
                            )}
                        </>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
