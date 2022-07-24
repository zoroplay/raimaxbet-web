import React from "react";
/**
 * packages
 */
import {Switch, Route, Redirect} from "react-router-dom";
import Home from "../Views/Home";
import EventDetails from "../Views/EventDetails";
import SearchResults from "../Views/SearchResults";
import OddsLessThan from "../Views/OddsLessThan";
import ExploreEvents from "../Views/ExploreEvents";
import TournamentSelector from "../Views/TournamentSelector";
import SportOdds from "../Views/SportOdds";
import PrintFixtures from "../Views/PrintFixtures";
import CMSPages from "../Views/CMSPages";
import Tipsters from "../Views/Tipsters";
import TipsterBetslips from "../Views/TipsterBetslips";
import PoolFixtures from "../Views/PoolFixtures";
import WeeklyCoupon from "../Views/WeeklyCoupon";
import Cashdesk from "../Views/Cashdesk";
import LiveScore from "../Views/LiveScore";

export default function SportRoutes() {

  return (
      <Switch>
          <Route exact path="/Sport/Default" component={Home} />
          <Route exact path="/Sport/Cashdesk" component={Cashdesk} />
          <Route exact path="/Sport/OddsLessThan" component={OddsLessThan} />
          <Route exact path="/Sport/Explore" component={ExploreEvents} />
          <Route exact path="/Sport/PreMatch/:sport" component={TournamentSelector} />
          <Route exact path="/Sport/Pages/:slug" component={CMSPages} />
          <Route exact path="/Sport/Pool" component={PoolFixtures} />
          <Route exact path="/Sport/Livescore" component={LiveScore} />
          <Route exact path="/Sport/Coupon" component={WeeklyCoupon} />
          <Route exact path="/Sport/Odds" component={SportOdds} />
          <Route exact path="/Sport/EventDetail" component={EventDetails} />
          <Route exact path="/Sport/SearchResults" component={SearchResults} />
          <Route exact path="/Sport/PrintFixtures" component={PrintFixtures} />
          <Route exact path="/Sport/Tipsters" component={Tipsters} />
          <Route exact path="/Sport/Tipsters/:id" component={TipsterBetslips} />
          <Redirect exact from="/" to="/Sport/Default"/>
      </Switch>
  );
}
