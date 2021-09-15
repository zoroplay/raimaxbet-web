import React, {useEffect, useState} from "react";
import {setActivePeriod, setSport, setSports, setTournaments} from "../../../Redux/actions";
import {getSportMenu} from "../../../Services/apis";
import {useDispatch, useSelector} from "react-redux";
import {NavLink, useHistory} from 'react-router-dom';
import {SET_TOURNAMENTS} from "../../../Redux/types";
import {periods} from "../../../Utils/constants";
import {slugify} from "../../../Utils/helpers";
import useSWR from "swr";

export default function LeftSide() {
    const {activePeriod, sports, tournaments} = useSelector((state) => state.sportsData);
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();
    const history = useHistory();

    const {data: topbets, error} = useSWR('sports/top-bets');

    const toggleSportMenu = e => {
        // console.log(e);
        e.currentTarget.parentNode.classList.toggle('active');
        // e.target.nextElementSibling.style.display = ''
    }

    const getSports = async () => {
        await getSportMenu(activePeriod).then(res => {
            dispatch(setSports(res.menu));
        });
    }

    useEffect( () => {
        getSports();
    }, [activePeriod]);

    const openEvent = (cid, tid, sid) => {

        const index = tournaments.findIndex(tournament => tournament.sport_tournament_id === tid);
        if (index !== -1) { // remove tournament
            tournaments.splice(index, 1);
            // update state
            dispatch({
                type: SET_TOURNAMENTS,
                payload: tournaments
            });

        } else {
            const pathname = window.location.pathname;
            const urlSearch= window.location.search;
            const url = `/Sport/Odds?tid=${tid}&sid=${sid}`;
            if (pathname+urlSearch === url) {
                dispatch(setTournaments({tid, sid}));
            } else {
                history.push(url);
            }
        }
        // dispatch(setTournaments({tid, sid}));
    }

    const doSearch = e => {
        e.preventDefault();
        if(keyword.length)
            history.push(`/Sport/SearchResults?q=${keyword}`)
    }

    const goTo = sport => {
        dispatch(setSport(sport));
        history.push('/Sport/PreMatch/' + slugify(sport.name))
    }

    return (
        <div className="side1">
            <form onSubmit={doSearch} className="search-container">
                <input
                    className="search-input"
                    type="text"
                    maxLength="50"
                    placeholder="Search"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="search-btn" type="submit">
                    <img
                        className="search-icon"
                        src="/img/icons/search.png"
                        alt="search icon"
                    />
                </button>
            </form>
            <NavLink to="/Live/LiveDefault" className="liveBtn">LiveBetting</NavLink>
            <NavLink to="/" className="homeBtn">Home</NavLink>
            <NavLink to="/Sport/OddsLessThan" className="oddBtn">Less then 2</NavLink>
            <NavLink to="/Sport/Explore" className="dailyBtn">Today’s matches</NavLink>

            <div className="psec-container">
                <div className="smx-card-section">
                    <div className="smx-card-list-heading">Most popular</div>
                    <div className="smx-card-list">
                        {topbets && topbets.map(row =>
                            <NavLink to={`/Sport/Odds?tid=${row.tournament_id}&sid=1`} key={row.id} className="smx-card" >
                                <span className="smx-item-art-wrap" style={{backgroundImage: 'url(/img/sports-icon/1.png)'}} />
                                <div className="smx-card-details">
                                    <div className="smx-card-name">{row.tournament.name}</div>
                                </div>
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
            <div className="sport-container">
                <div className="sport-tabs-top">
                    <ul className="sport-tabs" id="filtersport">
                        {periods.map((period, i) => <li
                            key={period.value}
                            onClick={() => dispatch(setActivePeriod(period.value))}
                            className={`s${i} ${activePeriod === period.value ? 'onSel' : ''}`}>
                            <p
                                className={i === 0 || i === 5 ? 'ctr' : ''}
                                dangerouslySetInnerHTML={{ __html: period.label}}
                            />
                        </li> )}

                    </ul>
                </div>
                <div className="scx-heading">All Sports</div>
                <div id="sportMenu" className="sport-tab-content">
                    {sports.map(sport =>
                    <div className="single-sport" key={sport.sport_id}>
                        <div className={`anchor sport-${sport.sport_id}`} onClick={(e) => toggleSportMenu(e)}>
                            <div className="trigger" />
                            <div className="icon" />
                            {sport.name} <span> ({sport.total})</span>
                            <div className="check">
                                <input id="sf1" className="sportFlag" type="checkbox"/>
                                <span className="checkmark" />
                            </div>
                        </div>
                        <div className="states">
                            <div className="state" />
                            {sport?.categories?.map(category =>
                            <div className="state" key={`category_${category.sport_category_id}`}>
                                <div className="anchor special" onClick={(e) => toggleSportMenu(e)}>
                                    <div className="trigger">{category.name}</div>
                                    <div className="check">
                                        <input type="checkbox" />
                                        <span className="checkmark" />
                                    </div>
                                </div>
                                <div className="championships">
                                    {category?.tournaments.map(tournament =>
                                    <div
                                        className={`championship ${tournaments.some(item => item.sport_tournament_id === tournament.sport_tournament_id) ? 'selected' : ''}`}
                                        id={`TOR_${tournament.sport_tournament_id}`}
                                        key={`TOR_${tournament.sport_tournament_id}`}
                                        onClick={(e) => openEvent(category.sport_category_id, tournament.sport_tournament_id, sport.sport_id)}
                                    >
                                        <div className="anchor favourite">
                                            {tournament.name}
                                            <div className="check">
                                                <input type="checkbox" id="TORc_841" />
                                                <span className="checkmark" />
                                            </div>
                                            <div className="fav off" />
                                        </div>
                                    </div>)}
                                </div>
                            </div>)}
                        </div>
                    </div>)}
                </div>
            </div>
        </div>
    )
}
