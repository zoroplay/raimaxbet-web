import React, {useEffect, useState} from "react";
import {getLiveFixtures} from "../Services/apis";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faTrophy} from '@fortawesome/free-solid-svg-icons'
import {getLiveOdds, getSpread, slugify} from "../Utils/helpers";
import {LiveEventsOverview, matchStatus} from "../Utils/constants";
import {LiveOdd} from "./Components/LiveOdd";
import {useSelector} from "react-redux";

export function LiveBetting ({history}) {
    const [availableSports, setAvailableSports] = useState([]);
    const [sports, setSports] = useState([]);
    const [filteredSports, setFilteredSports] = useState([]);
    const [activeSport, setActiveSport] = useState('all');
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);

    const getData = () => {
        getLiveFixtures().then(response => {
            // console.log(response);
            setAvailableSports(response.AvailableSports);
            let sports = response.Sports;
            if(sports.length > 0){
                sports.forEach((item, key) => {
                    item.headers = LiveEventsOverview.find(sport => sport.id === item.Id);
                });
                setSports(sports)
            }else{

            }
        })
    }

    useEffect(() => {
        getLiveFixtures().then(response => {
            setAvailableSports(response.AvailableSports)
            let sports = response.Sports;
            if(sports.length > 0){
                sports.forEach((item, key) => {
                    item.headers = LiveEventsOverview.find(sport => sport.id === item.Id);
                });
                setSports(sports);
            }else{

            }
        })
    }, []);

    useEffect(() => {

        const interval = setInterval(() => {
            getData();
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    useEffect(() => {
        filterSports(activeSport);
    }, [sports]);

    const togglePanel = (e) => {
        const parent = e.currentTarget.parentElement;
        parent.classList.toggle('closed');
    }

    const filterSports = (sport)  => {
        if (sport === 'all') {
            setFilteredSports(sports);
            setActiveSport('all');
        } else {
            const filter = sports.filter(el => el.Name === sport);
            if (filter) {
                setFilteredSports(filter);
                setActiveSport(sport);
            }
        }
    }

    return (
        <>
            <div className="topHeader panel-heading">
                <div className="sport-menu">
                    <div
                        onClick={() => filterSports('all')}
                        className={`menu all ${activeSport === 'all' ? 'selected' : ''}`}>
                        <FontAwesomeIcon icon={faTrophy} />
                        <span>All</span>
                    </div>
                    {availableSports.length > 0 && availableSports.map(sport =>
                    <div
                        onClick={() => filterSports(sport.Name)}
                        className={`menu sport_${sport.Id} ${activeSport === sport.Name ? 'selected' : ''}`} key={sport.Id}>
                        <span className={`live-item-icon icon_${sport.Id}`} />
                        <span>{sport.Name}</span>
                        <span className="sport-count">{sport.EventCount}</span>
                    </div>)}
                </div>
            </div>
            <div id="live-grouped-odds">
                <div id="CNWrapper">
                    <div className="wrapper">
                        <div className="content" id="divMainContentLive">
                            <div id="divPanelInPlayEvents">
                                <div id="divMainEventsLive">
                                    {filteredSports.map(sport =>
                                        <div className="tipoSport" key={sport.Id}>
                                            <div
                                                onClick={togglePanel}
                                                className="sport"
                                                style={{backgroundImage: `url(/img/sports/live/${slugify(sport.Name)}.png)`}}
                                            >
                                                <span className="arrow"  />
                                                <div className="count">({sport.EventCount})</div>
                                                {sport.Name}
                                            </div>
                                            {sport.Tournaments.map(tournament =>
                                            <div className="groups" key={tournament.Id}>
                                                <div className="group">
                                                    <div className="titleGroup" onClick={togglePanel}>
                                                        {tournament.Name}
                                                        <span className="arrow"  />
                                                        <div className="count">({tournament.Events.length})</div>
                                                    </div>
                                                    <div className="events">
                                                        {tournament.Events.map(match =>
                                                            <div className="item" key={match.Id}>
                                                                <a className="codPub">{match.SelectionCount} </a>
                                                                <div className="evento">
                                                                    <span onClick={() => history.push(`/Live/LiveEventDetail?EventID=${match.Id}`)}>
                                                                        {match.Name}
                                                                    </span>
                                                                </div>
                                                                <div className="time">
                                                                    {match.MatchTime !== 0 && <span className="min">{match.MatchTime} min </span> }
                                                                    <span className="fase">{matchStatus(match.MatchStatus)}</span>
                                                                </div>
                                                                <div className="risultato over">
                                                                    <span className="c1">{match.HomeGameScore}</span>&nbsp;-&nbsp;
                                                                    <span className="c2">{match.AwayGameScore}</span>
                                                                </div>
                                                                <div className="pnlQuote">
                                                                    <div className="container">
                                                                        <div className="quote">
                                                                            {sport.headers && sport.headers.markets.map(market =>
                                                                            <div className={`mainSE o${market.outcomes.length}`} key={`${slugify(sport.Name)}-${market.id}`}>
                                                                                <div className="SE">{market.name}</div>
                                                                                <div className={market.hasSpread ? 'hndItem' : ''}>
                                                                                    {market.hasSpread &&
                                                                                    <div className="hnd">
                                                                                        <div className="hndTitle">hnd
                                                                                        </div>
                                                                                        <div className="hndValue">{getSpread(match.Markets, market)}
                                                                                        </div>
                                                                                    </div>
                                                                                    }
                                                                                    {market.outcomes.map(outcome =>
                                                                                    <div className={`OddsQuotaItemStyleTQ ${market.hasSpread ? 'hndItem' : ''} g1`} key={`${slugify(sport.Name)}-${market.id}-${outcome.id}`}>
                                                                                        <LiveOdd
                                                                                            newOdds={getLiveOdds(match.Markets, market, outcome)}
                                                                                            outcome={outcome}
                                                                                            market={market}
                                                                                            fixture={match}
                                                                                            tournament={tournament.Name}
                                                                                            sport={sport.Name}
                                                                                            coupon={coupon}
                                                                                            globalVars={SportsbookGlobalVariable}
                                                                                            bonusList={SportsbookBonusList}
                                                                                        />
                                                                                    </div>)}
                                                                                </div>
                                                                            </div> )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
