import React, {useEffect, useState} from "react";
import '../Assets/scss/_live-details.scss';
import {getLiveFixtureData} from "../Services/apis";
import {useDispatch, useSelector} from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faChevronLeft} from "@fortawesome/free-solid-svg-icons";
import {matchStatus} from "../Utils/constants";
import {formatOdd, isSelected, liveScore} from "../Utils/helpers";
import {addToCoupon} from "../Redux/actions";
import {checkOddsChange, createID} from "../Utils/couponHelpers";
import useSWR from 'swr';

export function LiveEventDetails ({location, history}) {
    const urlParam = new URLSearchParams(location.search);
    const eventId = urlParam.get('EventID');
    const [fixture, setFixture] = useState(null);
    const [liveData, setLiveData] = useState(null);
    const [markets, setMarkets] = useState(null);
    const [loading, setLoading] = useState(true);
    const {SportsbookGlobalVariable, SportsbookBonusList} = useSelector((state) => state.sportsBook);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const { data } = useSWR("/sports/live/outcomes");
    const liveOutcomes = data?.data;

    const fetchFixture = () => {
        getLiveFixtureData(eventId).then(res => {
            setLoading(false);
            if (res.success && (res.data.match_status === 'ended' || res.data.match_status === 'interrupted'))
                history.push('/Live/LiveDefault');

            setFixture(res.data);
            setLiveData(res.data.live_data);
        }).catch(err => {
            setLoading(false)
            // console.log(err);
        })
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchFixture();
    }, []);

    useEffect(() => {

        const interval = setInterval(() => {
            fetchFixture();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(markets){
            let newMarkets = liveData.markets;

            newMarkets.forEach((item, key) => {
                // if(item.Status !== 0){
                    item.odds.forEach((selection, s) => {
                        if (markets[key]) {
                            let oldOdd = (markets[key].odds[s]) ? parseFloat(markets[key].odds[s].odds) : 0;
                            let oldOddChange = (markets[key].odds[s]) ? markets[key].odds[s].OddChanged : '';
                            let newOdd = parseFloat(selection.odds);

                            if (newOdd > oldOdd) {
                                selection.OddChanged = 'Increased';
                                selection.Animate = true;
                            } else if (newOdd < oldOdd) {
                                selection.OddChanged = 'Decreased'
                                selection.Animate = true;
                            } else if (newOdd === 0) {
                                selection.OddChanged = '';
                            } else {
                                selection.OddChanged = oldOddChange;
                            }

                            if (coupon.selections.length) {
                                checkOddsChange(coupon, [fixture], dispatch, SportsbookGlobalVariable, SportsbookBonusList);
                            }
                        }
                    });
                // }
                // console.log(item);
            });

            setMarkets(newMarkets.sort((market1, market2) => market1.id - market2.id));
        } else {
            setMarkets(liveData?.markets);
        }
    }, [liveData]);

    const selectOdds = (market, selection) => {
        if (selection.odds !== 0) {
            const outcome = getOutcome(market, selection);
            dispatch(
                addToCoupon(
                    fixture,
                    outcome.market_id,
                    outcome.market_name,
                    outcome.odds,
                    outcome.odd_id,
                    outcome.odd_name,
                    createID(
                        fixture.provider_id,
                        outcome.market_id,
                        outcome.odd_name, 
                        outcome.odd_id
                    ),
                    'live'
                )
            )
        }
    }

    const getOutcome = (market, selection) => {
        let outcome;
        liveOutcomes.forEach((liveOutcome) => {
            if (market.name === liveOutcome.market_name && selection.type == liveOutcome.name) {
                outcome = {
                    market_id: market.id,
                    market_name: `${market.name} ${
                        market.specialOddsValue && market.specialOddsValue !== '-1' ? 
                        market.specialOddsValue : ""}`,
                    odds: selection.odds,
                    odd_name: selection.type,
                    odd_id: liveOutcome.id,
                };
                return
            }
        });
        return outcome;
    }

    return (
        <div id="eventContainer">
            <div className="headerItem">
                <div className="arrow-icon" onClick={() => history.push('/Live/LiveDefault')}>
                    <FontAwesomeIcon icon={faChevronLeft} />
                </div>
                {fixture && <div className="breadcrumb">
                    {fixture.sport_name} / {fixture.sport_category_name} / {fixture.sport_tournament_name}
                </div> }
                {fixture && <div className="event-details">
                    <div className="time-status">
                        {liveData?.match_time !== 0 && <span className="time">{liveData?.match_time}<span className="timeFlash">'</span></span>}
                        &nbsp;<span className="status">{matchStatus(fixture?.match_status)}</span>
                    </div>
                    <div className="event-name-score">
                        <span className="event-name home">{fixture?.team_a}</span>
                        <span className="score">
                            <span className="home">{ liveScore(fixture?.score, 'home')}</span>
                            <span> - </span>
                            <span className="away">{ liveScore(fixture?.score, 'away')}</span>
                        </span>
                        <span className="event-name away">{ fixture?.team_b }</span>
                    </div>
                </div>}
            </div>
            <ol id="live-bets-grid" style={{letterSpacing: '-4px'}}>
                {markets?.map(market =>
                market.active === '1' &&
                <li className="Bet"
                    style={{paddingLeft: '0px', paddingRight: '0px', marginLeft: '0px', marginRight: '0px', width: '100%', letterSpacing: 'normal'}}
                    key={market.Id}
                >
                    <div className="BetContainer">
                        <div className="Header Relative">
                            <div className="Content">
                                <h4 data-bind="text: Caption">{market.name} {market.specialOddsValue && market.specialOddsValue !== '-1' ? market.specialOddsValue : ''}</h4>
                                <div className="ToggleButton" title="Collapse All Bets" />
                                <div className="ToggleButton Toggled" title="Expand All Bet" style={{display: 'none'}} />
                                <div className="FavoriteButton" title="preferred" />
                            </div>
                        </div>
                        <ol style={{letterSpacing: '-4px'}}>
                            {market.odds.length > 0 && market.odds.map(selection =>
                                <li className={`Odds Relative ${market.odds.length === 2 ? 'col-2' : 'col-3'}
                                    ${isSelected(createID(fixture.provider_id, market.id, selection.type, selection.id), coupon) ? 'sel' : ''}
                                `}
                                    key={selection.id}
                                >
                                <div
                                    className={`Content ${selection.odds.active === '0' ? 'Lock' : ''}`}
                                    onClick={() => selectOdds(market, selection)}
                                >
                                    <div className="Playability Ellipsed">
                                        <h5 title="1 (single)" className="Single">{selection.type}</h5>
                                    </div>
                                    <div className="Trend Ellipsed">
                                        <h6 title="37.00" className={`${selection.OddChanged} ${selection.Animate ? 'Animate' : ''}`}>{formatOdd(parseFloat(selection.odds))}</h6>
                                    </div>
                                </div>
                            </li>)}

                        </ol>
                    </div>
                </li>)}
                <li id="live-bets-empty" style={{display: 'none' }}>NoBets</li>
            </ol>
        </div>
    )
}
