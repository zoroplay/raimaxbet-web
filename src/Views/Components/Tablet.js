import React, { useState } from "react";
import { getMarkets } from "../../Services/apis";
import { LOADING } from "../../Redux/types";
import { useDispatch, useSelector } from "react-redux";
import { removeTournament } from "../../Redux/actions";
import FixturesList from "./FixturesList";

export default function Tablet({ tournament, index, history }) {
  const [activeMarket, setActiveMarket] = useState(tournament?.markets[0]);
  const [activeGroup, setActiveGroup] = useState(tournament?.groups[0]);
  const [markets, setMarkets] = useState(tournament?.markets);
  const [selectedMarkets, setSelectedMarkets] = useState(
    tournament?.market_def
  );
  const [predictions, setPredictions] = useState(tournament?.predictions);
  const [fixtures, setFixtures] = useState(tournament?.fixtures);
  const dispatch = useDispatch();
  const coupon = useSelector(({ couponData }) => couponData.coupon);

  const changeMarket = (market) => {
    dispatch({ type: LOADING });
    market.market_group_id = market.group_id;
    setActiveMarket(market);
    getMarkets(tournament.sport_tournament_id, tournament.sport_id, market.id)
      .then((res) => {
        dispatch({ type: LOADING });
        setPredictions(res.predictions);
        setFixtures(res.fixtures);
        setSelectedMarkets(res.market_def);
        document
          .getElementById(`event-wrapper-${tournament.sport_tournament_id}`)
          .scrollIntoView();
      })
      .catch((err) => {
        dispatch({ type: LOADING });
      });
  };

  const toggleInfo = (e) => {
    const parent = e.target.parentElement;
    parent.classList.toggle("show");
  };
  return (
    <div className="oddsViewPanel ">
      <div
        className={`divOdds ${
          predictions.length <= 9 ? "r1 c" + predictions.length : "r5 c6"
        }`}
      >
        <div className="title">
          <span>
            <span>{tournament?.sport_category_name}</span>
            <span>{tournament?.sport_tournament_name}</span>
          </span>
          <div className="btns">
            <a
              className="lnkOddsCls"
              onClick={() => dispatch(removeTournament(index))}
            />
            <a className="lnkOddsPrn" />
            <a className="lnkOddsRfh" />
            <a className="lnkOddsBack" />
          </div>
        </div>
        <div className="OddsBreadbrum">
          <ul>
            <li className="sportItem">
              <a title="Soccer">{tournament?.sport_name} </a>
            </li>
            <li className="groupItem">
              <a>{tournament?.sport_category_name}</a>
            </li>
            <li className="eventItem">
              <a>{tournament?.sport_tournament_name}</a>
            </li>
          </ul>
        </div>
        <ul className={`CGQ t${tournament?.groups.length}`}>
          {tournament?.groups.map((group, g) => (
            <li
              key={`group-${group.id}`}
              onClick={() => setActiveGroup(group)}
              className={`itm${g + 1} ${
                group.id === activeGroup.id ? "sel preSel" : ""
              }`}
            >
              <span>{group.name}</span>
              {group.id === activeGroup.id && (
                <ul className="CQ">
                  {markets.map(
                    (market) =>
                      market.group_id === activeGroup.id && (
                        <li
                          key={`event-markets-${market.id}`}
                          className={
                            activeMarket?.id === market.id ? "sel" : ""
                          }
                          onClick={() => changeMarket(market)}
                        >
                          <span>{market.name}</span>
                        </li>
                      )
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
        <div className="oddClass">
          <div className="btnDisplay" onClick={toggleInfo} />
          <div className="">
            <div>
              <span className="ng-binding">{activeMarket?.name}</span>
              <span className="ng-binding">{activeMarket?.info}</span>
            </div>
          </div>
        </div>
        <div
          className="SEs"
          id={`event-wrapper-${tournament?.sport_tournament_id}`}
        >
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
  );
}
