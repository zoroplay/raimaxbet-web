import React, {useEffect, useState} from 'react';
import {oddsLessThan, oddsLessThanFixtures} from "../Services/apis";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import FixturesList from "./Components/FixturesList";
import {LOADING} from "../Redux/types";

export default function OddsLessThan({history}) {
    const [fixtures, setFixtures] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [selectedMarkets, setSelectedMarkets] = useState([]);
    const [sports, setSports] = useState(null);
    const [activeSport, setActiveSport] = useState(null);
    const [activeOdds, setActiveOdds] = useState(null);
    const [range, setRange] = useState(null);
    const [loading, setLoading] = useState(false);
    const coupon = useSelector(({couponData}) => couponData.coupon);
    const dispatch = useDispatch();

    const getSports = () => {
            setLoading(true);
        oddsLessThan({maxOdds: activeOdds, range}).then(res => {
            setLoading(false);
            setSports(res);
            if(res.length)
                setActiveSport(res[0]);
        }).catch(err => {
            toast.error('Unable to fetch results');
        });
    }

    const getFixtures = () => {
        dispatch({type: LOADING});
        oddsLessThanFixtures({maxOdds: activeOdds, range, sport: activeSport?.sport_id})
            .then(res => {
                dispatch({type: LOADING});
                setFixtures(res.fixtures);
                setPredictions(res.predictions);
                setSelectedMarkets(res.market_def);
        }).catch(err => {
            dispatch({type: LOADING});
            toast.error('Unable to fetch fixtures');
        })
    }

    useEffect(() => {
        if (activeOdds && range) {
            getSports();
        }
    }, [activeOdds, range]);

    useEffect(() => {
        getFixtures();
    }, [activeSport]);

    return (
        <div className="odds-less-wrapper">
            <div className="ranges">
                <div className="range">
                    <div className="label">Select your odds less than:</div>
                    <div className="ranges-holder">
                        <div className={`single-range index0 ${activeOdds === 1.25 ? 'selected' : ''}`}
                             onClick={() => setActiveOdds(1.25)}>
                            <span>1.25</span>
                        </div>
                        <div className={`single-range index1 ${activeOdds === 1.50 ? 'selected' : ''}`}
                             onClick={() => setActiveOdds(1.50)}>
                            <span>1.50</span></div>
                        <div className={`single-range index2 ${activeOdds === 1.75 ? 'selected' : ''}`}
                             onClick={() => setActiveOdds(1.75)}>
                            <span>1.75</span></div>
                        <div className={`single-range index3 ${activeOdds === 2.00 ? 'selected' : ''}`}
                             onClick={() => setActiveOdds(2.00)}><span>2.00</span></div>
                    </div>
                </div>
                <div className="range">
                    <div className="label">Select the time range to show:</div>
                    <div className="ranges-holder">
                        <div className={`single-range index0 ${range === '1hr' ? 'selected' : ''}`}
                             onClick={() => setRange('1hr')}>
                            <span>1 hr</span>
                        </div>
                        <div className={`single-range index1 ${range === '3hrs' ? 'selected' : ''}`}
                             onClick={() => setRange('3hrs')}>
                            <span>3 hrs</span>
                        </div>
                        <div className={`single-range index2 ${range === 'today' ? 'selected' : ''}`}
                             onClick={() => setRange('today')}>
                            <span>Today</span>
                        </div>
                        <div className={`single-range index3 ${range === '3days' ? 'selected' : ''}`}
                             onClick={() => setRange('3days')}>
                            <span>3 days</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="sports">
                {loading ? <div style={{margin: 'auto', textAlign: 'center'}}><i className="fa fa-spin fa-spinner fa-2x" /></div>
                    :
                    (sports &&
                    <>
                        <div className="label">Choose the sports you would like to view:</div>
                        <div className="sports-holder">
                            {sports.map(sport =>
                            <div
                                onClick={() => setActiveSport(sport)}
                                className={`single-sport-button ${sport.sport_id === activeSport?.sport_id ? 'selected' : ''}`}
                                key={`sport-${sport.sport_id}`}>
                                <span>{sport.name}</span>
                            </div>
                            )}
                        </div>
                    </>)
                }
            </div>
            {fixtures.length > 0 &&
            <div className="oddsViewPanel ">
                <div className={`divOdds ${predictions.length <= 9 ? 'r1 c'+predictions.length : 'r5 c6'}`}>

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
