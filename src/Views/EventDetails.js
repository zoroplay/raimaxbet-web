import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getFixture} from "../Services/apis";
import {formatDate, isSelected} from "../Utils/helpers";
import {NavLink} from "react-router-dom";
import {addToCoupon} from "../Redux/actions";
import {createID} from "../Utils/couponHelpers";
import {toast} from "react-toastify";


export default function EventDetails({location, history}) {
    const urlParam = new URLSearchParams(location.search);
    const eventID = urlParam.get('EventID');
    const [fixture, setFixture] = useState(null);
    const dispatch = useDispatch();
    const coupon = useSelector(({couponData}) => couponData.coupon);

    const fetchFixture = useCallback(() => {
        getFixture(eventID).then(res => {
            if (res.success) {
                setFixture(res.data);
            } else {
                toast.error(res.message, {position: 'top-right'});
                history.goBack();
            }
        }).catch(err => {
            // setLoading(false)
        })
    }, [eventID]);

    useEffect(() => {
        fetchFixture();
    }, [fetchFixture]);

    const getClass = len => {
        if (len <= 2) {
            return 'c2';
        } else if(len === 3) {
            return 'c3';
        } else if (len === 4 || len === 8){
            return 'c4';
        } else if (len === 5 || len === 10) {
            return 'c5';
        } else if (len === 6 || len === 12) {
            return 'c6';
        } else if (len === 9 || len === 18) {
<<<<<<< HEAD
            return 'c5'
=======
            return 'c6'
>>>>>>> 69b141339cfc93786be933ea82bf76b9a86e8d87
        } else {
            return 'c4';
        }
    }

    const toggleMarket = e => {
        e.target.parentElement.classList.toggle('closed');
    }

    const toggleInfo = e => {
        e.target.classList.toggle('sel');
        e.target.nextElementSibling.classList.toggle('sel');
    }

    const getStats = (e) => {
        const statWrapper = document.getElementById(`SingleInsideStats_${fixture.provider_id}`);
        statWrapper.classList.toggle('brClosed');

        if(statWrapper.innerHTML === '') {
            statWrapper.innerHTML = 'Loading...';
            statWrapper.style.color = '#000';
            statWrapper.style.backgroundColor = '#fff';
            window.SRLive.addWidget("widgets.matchhead2head", {
                matchId: fixture.provider_id,
                showTitle: !1,
                container: `#SingleInsideStats_${fixture.provider_id}`
            });
        } else {
            statWrapper.innerHTML = '';
        }
    };

    return (
        <>
            <div id="MainContent" className="championship-page">
                <div id="divDett">
                    <div id="SEOddsDataSE" >{ formatDate(fixture?.schedule, 'DD/MM/YYYY HH:mm') }</div>
                    <div id="SEOddsDescSE" className="OddsDetailsSE">{fixture?.event_name}</div>
                    <div className="OddsBreadbrum">
                        <ul>
                            <li className="sportItem">
                                <a title={fixture?.sport_name}>{fixture?.sport_name} </a>
                            </li>
                            <li className="groupItem">
                                <a title={fixture?.sport_category_name} >{fixture?.sport_category_name}</a>
                            </li>
                            <li className="eventItem">
                                <NavLink to={`/Sport/Odds?tid=${fixture?.sport_tournament_id}&sid=${fixture?.sport_id}`} title={fixture?.sport_tournament_name}>{fixture?.sport_tournament_name}</NavLink>
                            </li>
                            <li className="subeventItem">
                                <a title={fixture?.event_name}>{fixture?.event_name}</a>
                            </li>
                        </ul>
                    </div>
                    <div className="subeventWidgets">
                        <div className="starters">
                            <div className="HeadToHead" onClick={getStats} />
                        </div>
                        <div className="widgetBody HeadToHead brClosed" id={`SingleInsideStats_${fixture?.provider_id}`} />
                    </div>
                    <div className="SETQCon stats">
                        {fixture?.markets.map((row, i) =>
                            <div className="SEItem" key={`market-${i}`}>
                                <div className="SECQ" onClick={(e) => toggleMarket(e)}>
                                    <span className="btnOpenClose"  />
                                    {row.market?.name}
                                </div>
                                <div className="DescPuls " onClick={(e) => toggleInfo(e)}>open</div>
                                <div className="DescInfo">
                                    {row.market?.description}
                                </div>
                                <div className={`SEOdds ${getClass(row.selections.length)}`}>
                                    {row.selections.map((selection, s) =>
                                        <div title="Singles" className={`SEOdd g1 
                                            ${(selection.odds === '-' || selection.odds == 'OFF') ? 'disabled' : ''}
                                            ${(isSelected(createID(fixture.provider_id, row.market?.id, selection.name, selection.id), coupon)) ? 'sel' : ''}`}
                                             key={`selection-${s}`}>
                                            <div className="SEOddsTQ ">{selection.name}</div>
                                            <div className="SEOddLnk"
                                                 onClick={() => dispatch(addToCoupon(fixture, row.market?.id, row.market.name, selection.odds, selection.id, selection.name,
                                                     createID(fixture.provider_id, row.market?.id, selection.name, selection.id), fixture.fixture_type))}>
                                                {selection.odds}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}
