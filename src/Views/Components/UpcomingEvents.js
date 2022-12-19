import React, { useEffect, useState } from "react";
import useSWR from "swr/esm/use-swr";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  formatDate,
  getOdds,
  getStats,
  groupBy,
  groupFixtures,
  isSelected,
} from "../../Utils/helpers";
import { addToCoupon } from "../../Redux/actions";
import { createID } from "../../Utils/couponHelpers";

export default function UpcomingEvents() {
  const [sports, setSports] = useState([]);
  const [activeSport, setActiveSport] = useState(null);
  const dispatch = useDispatch();
  const coupon = useSelector(({ couponData }) => couponData.coupon);

  const { data, error } = useSWR(
    "/sports/web-content?sports=main&type=home&limit=10"
  );

  useEffect(() => {
    if (data) {
      setSports(data);
      setActiveSport(data[0]);
      // setPredictions(data[0]?.predictions);
    }
  }, [data]);

  return (
    <div className="match-data-container">
      <div className="upco-top">
        <h4>Upcoming Events</h4>
        <div className="upco-tab">
          {sports?.map((sport) => (
            <a
              onClick={() => setActiveSport(sport)}
              key={`st${sport.sport_id}`}
              className={`st${sport.sport_id} ${
                sport.sport_id === activeSport?.sport_id ? "st-on" : ""
              }`}
            >
              {sport.name}
            </a>
          ))}
        </div>
      </div>
      <table className="match-data-table">
        <tbody className="match-data-tbody">
          <tr className="stat-top">
            <th className="match">Match</th>
            {activeSport?.market_def.map((market) => (
              <th colSpan={market.outcomes.length} key={market.id}>
                {market.name}
              </th>
            ))}
          </tr>
          <tr className="stat-bottom">
            <th></th>
            {activeSport?.predictions.length > 0 &&
              activeSport?.predictions.map((prediction) => (
                <th key={`outcome-${prediction.odd_id}`}>
                  {prediction.odd_name}
                </th>
              ))}
          </tr>
          {activeSport?.fixtures &&
            groupFixtures(activeSport?.fixtures).map((fixture, i) => (
              <>
                <tr className="date" key={i}>
                  <td colSpan={9}>
                    {formatDate(fixture.event_date, "dddd DD, MMMM")}
                  </td>
                </tr>
                {fixture.events.map((match) => (
                  <>
                    <tr
                      className="stat-row"
                      key={`key_${match.provider_id}`}
                      id={`event_${match.provider_id}`}
                    >
                      <td className="match-teams-content">
                        <div className="match-teams-content">
                          <NavLink
                            className="match-teams-content-a"
                            to={`/Sport/EventDetail?EventID=${match.provider_id}`}
                          >
                            <span className="match-teams">{match.team_a}</span>
                            <span className="match-teams">{match.team_b}</span>
                          </NavLink>
                          <div className="match-teams-content-b">
                            <span className="match-date">{match.event_id}</span>
                            <span className="match-time">
                              {match.event_time}
                            </span>
                            <a
                              className="match-grap"
                              onClick={() => getStats(match)}
                              href="javascript:;"
                            />
                            <a className="head-grap" href="#" />
                          </div>
                        </div>
                      </td>
                      {activeSport?.predictions.length > 0 &&
                        activeSport?.predictions.map((row) => (
                          <td key={`prediction-${row.odd_id}`}>
                            <button
                              style={{
                                border: "none",
                                cursor: "pointer",
                              }}
                              disabled={
                                getOdds(row, match.odds) <= 1.1 ? true : false
                              }
                              onClick={() =>
                                dispatch(
                                  addToCoupon(
                                    match,
                                    row.market_id,
                                    row.market_name,
                                    getOdds(row, match.odds),
                                    row.odd_id,
                                    row.odd_name,
                                    createID(
                                      match.provider_id,
                                      row.market_id,
                                      row.odd_name,
                                      row.odd_id
                                    ),
                                    match.fixture_type
                                  )
                                )
                              }
                              className={`match-value odd quote 
                                                ${
                                                  getOdds(row, match.odds) ===
                                                    null ||
                                                  getOdds(row, match.odds) ===
                                                    "-"
                                                    ? "disabled"
                                                    : ""
                                                }
                                                ${
                                                  isSelected(
                                                    createID(
                                                      match.provider_id,
                                                      row.market_id,
                                                      row.odd_name,
                                                      row.odd_id
                                                    ),
                                                    coupon
                                                  )
                                                    ? "selected"
                                                    : ""
                                                }`}
                            >
                              {getOdds(row, match.odds) <= 1.1
                                ? "-"
                                : getOdds(row, match.odds)}
                            </button>
                          </td>
                        ))}
                    </tr>
                    <tr key={`c_${match.id}`}>
                      <td colSpan="11">
                        <div id={`SingleInsideStats_${match.provider_id}`} />
                      </td>
                    </tr>
                  </>
                ))}
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
}
