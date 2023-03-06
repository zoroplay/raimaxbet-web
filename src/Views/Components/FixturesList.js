import React from "react";
import {
  formatDate,
  getOdds,
  isSelected,
  toggleExtraMarket,
} from "../../Utils/helpers";
import { createID } from "../../Utils/couponHelpers";
import { addToCoupon } from "../../Redux/actions";

export default function FixturesList({
  coupon,
  dispatch,
  predictions,
  fixtures,
  selectedMarkets,
  history,
}) {
  const getPredictions = (market) => {
    return predictions.filter(
      (prediction) => prediction.market_id === market.id
    );
  };
  const checkFixtureDate = (fixture, index) => {
    if (index > 0) {
      return fixture.event_date !== fixtures[index - 1].event_date
        ? "firstDate"
        : "";
    } else {
      return "firstDate";
    }
  };

  const openWidget = (fixture, widgetName) => {
    const statWrapper = document.getElementById(
      `${widgetName}_${fixture.provider_id}`
    );
    statWrapper.parentElement.classList.toggle("brClosed");

    if (statWrapper.innerHTML === "") {
      statWrapper.innerHTML = "Loading...";
      statWrapper.style.color = "#000";
      statWrapper.style.backgroundColor = "#fff";

      window.SRLive.addWidget(`widgets.${widgetName}`, {
        matchId: fixture.provider_id,
        showTitle: !1,
        container: `#${widgetName}_${fixture.provider_id}`,
      });
    } else {
      statWrapper.innerHTML = "";
    }
  };

  return (
    <>
      {/* <tr className="stat-bottom">
        <th></th>
        <th>1</th>
        <th>X</th>
        <th>2</th>
        <th>1X</th>
        <th>12</th>
        <th>X2</th>
        <th>GG</th>
        <th>NG</th>
      </tr> */}
      {fixtures.map((fixture, f) => (
        <div
          className={`item ${checkFixtureDate(fixture, f)}`}
          key={`fixture-${f}`}
        >
          <div className="sepData">
            {formatDate(fixture.schedule, "DD MMMM YYYY")}
          </div>
          <div className="ID">{fixture.event_id}</div>
          <div className="Time">
            <span>{formatDate(fixture.schedule, "HH:mm")}</span>
            <span>{formatDate(fixture.schedule, "DD MMM")}</span>
          </div>

          <div
            className="Event"
            onMouseEnter={() =>
              toggleExtraMarket(`extra-market-${fixture.event_id}`)
            }
            onMouseLeave={() =>
              toggleExtraMarket(`extra-market-${fixture.event_id}`)
            }
            onClick={() =>
              history.push(`/Sport/EventDetail?EventID=${fixture.provider_id}`)
            }
          >
            {fixture?.team_a.substring(0, 13)} -{" "}
            {fixture?.team_b.substring(0, 12)}
          </div>

          {/*<div className="stats innprojekt" ng-if="(subEvent.StatCode != '')"*/}
          {/*     ng-click="subEvent.openStatistics()"></div>*/}

          <div className="addedFunction">
            <div
              className="brStarted headToHead"
              onClick={(e) => openWidget(fixture, "matchhead2head")}
            ></div>
            <div
              className="brStarted tableLeague"
              onClick={() =>
                window.open(
                  `https://s5.sir.sportradar.com/betradar/en/match/${fixture.provider_id}`,
                  "stats",
                  "width=1078,height=768"
                )
              }
            ></div>
          </div>
          <div className="odds">
            <div className="gq gqid_">
              <div className="ng-isolate-scope">
                {selectedMarkets.map((market, i) => (
                  <div className={`cq t${i}`} key={`market-${i}`}>
                    <span>{market.name}</span>

                    {getPredictions(market).map((prediction, p) => (
                      <button
                        disabled={
                          getOdds(prediction, fixture.odds) <= 1.0
                            ? true
                            : false
                        }
                        style={{
                          border: "none",
                          cursor: "pointer",
                        }}
                        className={`odd r1 c1 g1 
                                                ${
                                                  predictions.length > 9 &&
                                                  p % 6 === 0
                                                    ? "firstInRow"
                                                    : ""
                                                } 
                                                ${
                                                  getOdds(
                                                    prediction,
                                                    fixture.odds
                                                  ) === "-" ||
                                                  getOdds(
                                                    prediction,
                                                    fixture.odds
                                                  ) == "OFF"
                                                    ? "disabled"
                                                    : ""
                                                }
                                                ${
                                                  isSelected(
                                                    createID(
                                                      fixture.provider_id,
                                                      prediction.market_id,
                                                      prediction.odd_name,
                                                      prediction.odd_id
                                                    ),
                                                    coupon
                                                  )
                                                    ? "sel"
                                                    : ""
                                                }`}
                        key={`prediction-${p}`}
                        onClick={() =>
                          dispatch(
                            addToCoupon(
                              fixture,
                              prediction.market_id,
                              prediction.market_name,
                              getOdds(prediction, fixture.odds),
                              prediction.odd_id,
                              prediction.odd_name,
                              createID(
                                fixture.provider_id,
                                prediction.market_id,
                                prediction.odd_name,
                                prediction.odd_id
                              ),
                              fixture.fixture_type
                            )
                          )
                        }
                      >
                        <div className="oddsType" title="1">
                          {prediction.odd_name}
                        </div>
                        <button
                          style={{
                            border: "none",
                            cursor: "pointer",
                            background: "transparent",
                          }}
                          disabled={
                            getOdds(prediction, fixture.odds) <= 1.0
                              ? true
                              : false
                          }
                        >
                          {getOdds(prediction, fixture.odds) <= 1.0
                            ? "-"
                            : getOdds(prediction, fixture.odds)}
                        </button>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="betaradarContent">
            <div className="brClosed">
              <div className="headWidget">
                Head To Head
                <div
                  className="btnClose"
                  onClick={(e) => openWidget(fixture, "matchhead2head")}
                ></div>
              </div>
              <div
                className={`widgetBody HeadToHead`}
                id={`matchhead2head_${fixture?.provider_id}`}
              ></div>
            </div>
          </div>
          <div className="betaradarContent">
            <div className="brClosed">
              <div className="headWidget">
                League Table
                <div
                  className="btnClose"
                  onClick={(e) => openWidget(fixture, "livetable")}
                ></div>
              </div>
              <div
                className={`widgetBody HeadToHead`}
                id={`livetable_${fixture?.provider_id}`}
              ></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
