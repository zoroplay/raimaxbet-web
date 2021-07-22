import React from "react";
/**
 * packages
 */
import {Switch, Route} from "react-router-dom";
import {LiveBetting} from "../Views/LiveBetting";
import {LiveEventDetails} from "../Views/LiveEventDetails";


export default function LiveRoutes() {

  return (
      <Switch>
          <Route exact path="/Live/LiveDefault" component={LiveBetting} />
          <Route exact path="/Live/LiveEventDetail" component={LiveEventDetails} />
      </Switch>
  );
}
