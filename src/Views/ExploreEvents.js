import React, {useEffect, useState} from 'react';
import moment from "moment";
import {useDispatch, useSelector} from "react-redux";
import {fetchFixturesByDate, fetchFixturesByDateSport, getMarkets} from "../Services/apis";
import Loader from "./Components/Loader";
import FixturesList from "./Components/FixturesList";
import {LOADING} from "../Redux/types";
import {toast} from "react-toastify";

const getDays = () => {
    const days = [];
    const today = moment();
    days.push({
        date: today.format('YYYY-MM-DD'),
        label: `Today ${today.format('DD.MM')}`
    })
    for (let i = 1; i < 5; i++) {
        const data = {date: moment().add(i, 'days').format('YYYY-MM-DD'), label: ''};
        if (i === 1) {
            data.label = 'Tomorrow ' + moment().add(i, 'day').format('DD.MM');
        } else {
            data.label = moment().add(i, 'days').format('ddd DD.MM');
        }
        days.push(data);
    }
    return days;
}

export default function ExploreEvents({history}) {

    const [activeDate, setActiveDate] = useState(getDays()[0]);
    const [sports, setSports] = useState([]);
    const [fixtures, setFixtures] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [activeSport, setActiveSport] = useState(null);
    const [activeMarket, setActiveMarket] = useState(null);
    const [activeGroup, setActiveGroup] = useState(null);
    const [groups, setGroups] = useState([]);
    const [markets, setMarkets] = useState([]);
    const [selectedMarkets, setSelectedMarkets] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);

    const displayWeekDay = (curr) => {
        const today = moment();

        if(today.format('YYYY-MM-DD') === curr){
            return 'Today\'s';
        } else if (moment(curr).diff(today, 'days') === 1) {
            return 'Tomorrow\'s';
        }
        return moment(curr).format('dddd')+'\'s';
    }

    const getSports = () => {
        setLoading(true);
        fetchFixturesByDate(activeDate.date).then(res => {
            setLoading(false);
            setSports(res.sports);
            setActiveSport(res.sports[0]);
            setFixtures(res.data.fixtures);
            setPredictions(res.data.predictions);
            setGroups(res.data.groups);
            setActiveGroup(res.data.groups[0]);
            setActiveMarket(res.data.markets[0]);
            setMarkets(res.data.markets);
            setSelectedMarkets(res.data.market_def);
            setActiveMarket(res.data.selected_market);
        }).catch(err => {
            setLoading(false);
        });
    }

    const getFixtures = (date, sport, market) => {
        dispatch({type: LOADING})
        fetchFixturesByDateSport(date, sport, market).then(res => {
            dispatch({type: LOADING})
            setFixtures(res.fixtures);
            setPredictions(res.predictions);
            setGroups(res.groups);
            setActiveGroup(res.groups[0]);
            setMarkets(res.markets);
            setSelectedMarkets(res.market_def);
            setActiveMarket(res.markets[0]);
        }).catch(err => {
            dispatch({type: LOADING})

            toast.error('Unable to fetch fixtures');
        });
    }

    useEffect(() => {
        if (activeDate) {
            getSports();
        }
    }, [activeDate]);


    const setSport = (sport) => {
        setActiveSport(sport)
        getFixtures(activeDate.date, sport.sport_id);
    }

    const toggleInfo = e => {
        const parent = e.target.parentElement;
        parent.classList.toggle('show');
    }

    const changeMarket = (market) => {
        dispatch({type: LOADING});
        market.market_group_id = market.group_id;
        setActiveMarket(market);
        getMarkets(0, activeSport.sport_id, market.id, activeDate.date).then(res => {
            dispatch({type: LOADING});
            setPredictions(res.predictions);
            setFixtures(res.fixtures);
            setSelectedMarkets(res.market_def);
        }).catch(err => {
            dispatch({type: LOADING});
        });
    }

    return (
        <div className="explore-matches-page">
            <div className="title">
                <div className="explore-days">
                    <span>Show events for:</span>
                    {getDays().map((day, i) =>
                        <span className={`explore-day ${activeDate.label === day.label ? 'active' : ''}`}
                              key={i} onClick={() => setActiveDate(day)}>{day.label}</span>
                    )}
                </div>
            </div>
            <div className="choose-sports-holder">
                {loading ? <Loader/>
                    :
                    <div className="choose-sports">
                        <span>Choose the sport for which you would like to view {displayWeekDay(activeDate?.date)} Fixture:</span>
                        {sports?.map(sport =>
                            <div onClick={() => setSport(sport)}
                               key={`st${sport.sport_id}`}
                               className={`choose-sport ${sport.sport_id === activeSport?.sport_id ? 'active' : ''}`}
                            >{sport.sport_name}</div>
                        )}
                    </div>
                }
            </div>
            {!loading &&
            <div className="oddsViewPanel ">
                <div className={`divOdds ${predictions.length <= 9 ? 'r1 c'+predictions.length : 'r5 c6'}`}>
                    <ul className={`CGQ t${groups?.length}`}>
                        {groups.map((group, g) =>
                            <li
                                key={`group-${group.id}`}
                                onClick={() => setActiveGroup(group)}
                                className={`itm${g+1} ${group.id === activeGroup?.id ? 'sel preSel' : ''}`}
                            >
                                <span>{group.name}</span>
                                {group.id === activeGroup?.id &&
                                <ul className="CQ">
                                    {markets.map(market =>
                                        market.group_id === activeGroup?.id &&
                                        <li key={`event-markets-${market.id}`}
                                            className={activeMarket?.id === market.id ? 'sel' : ''}
                                            onClick={() => changeMarket(market)}>
                                            <span >{market.name}</span>
                                        </li>
                                    )}
                                </ul>}
                            </li>
                        )}
                    </ul>
                    <div className="oddClass" >
                        <div className="btnDisplay" onClick={toggleInfo} />
                        <div className="">
                            <div>
                                <span className="ng-binding">{activeMarket?.name}</span>
                                <span className="ng-binding">{activeMarket?.info}</span>
                            </div>
                        </div>
                    </div>
                    <div className="SEs">
                        <FixturesList
                            fixtures={fixtures}
                            predictions={predictions}
                            selectedMarkets={selectedMarkets}
                            coupon={coupon}
                            dispatch={dispatch}
                            history={history}
                        />
                    </div>
                </div>
            </div>
            }
        </div>
    )
}
