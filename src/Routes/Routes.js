import React, { Fragment } from "react";

/**
 * packages
 */
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import { useIdleTimer } from 'react-idle-timer'

import NotFound from "../Views/NotFound";

import SportRoutes from "./SportRoutes";
import Main from "../Views/layout/Main";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {authDetails, sendLogout} from "../Services/apis";
import {REMOVE_USER_DATA, UPDATE_USER_DATA} from "../Redux/types";
import Jackpot from "../Views/Jackpot";
import Register from "../Views/Auth/Register";
import RecoverPassword from "../Views/Auth/RecoverPassword";
import Account from "../Views/layout/Account";
import AccountRoutes from "./AccountRoutes";
import ResetPassword from "../Views/Auth/ResetPassword";
import InPlay from "../Views/layout/InPlay";
import LiveRoutes from "./LiveRoutes";
import BecomeAnAgent from "../Views/layout/BecomeAnAgent";
import AgentRegister from "../Views/BecomeAnAgent/AgentRegister";
import Index from "../Views/BecomeAnAgent/Index";
import Benefits from "../Views/BecomeAnAgent/Benefits";
import EasySteps from "../Views/BecomeAnAgent/EasySteps";
import Virtual from "../Views/Virtual";
import Casino from "../Views/Casino";
// import LiveRoutes from "./LiveRoutes";
// import Live from "../Views/Layout/Live";


export default function Routes() {
  const {isAuthenticated} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleOnIdle = event => {
    // if(isAuthenticated) {
    //   sendLogout().then(res => {
    //     dispatch({type: REMOVE_USER_DATA});
    //     document.body.classList.add("Anonymous");
    //     document.body.classList.remove("Logged");
    //   }).catch (err => {
    //     dispatch({type: REMOVE_USER_DATA});
    //     document.body.classList.add("Anonymous");
    //     document.body.classList.remove("Logged");
    //   });
    // }
  }

  const handleOnActive = event => {
    // console.log('user is active', event)
    // console.log('time remaining', getRemainingTime())
  }

  const handleOnAction = (e) => {
    // console.log('user did something', e)
  }

  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout: 1000 * 60 * 30,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  })

  useEffect(() => {
    if (isAuthenticated) {
      authDetails().then(resp => {
        if(resp.user) {
          const user = resp.user;
          dispatch({
            type: UPDATE_USER_DATA,
            payload: user
          });
        }
      })
    }
  }, [isAuthenticated]);

  return (
    <Fragment>
      <Router>
        <Switch>
          <Redirect from="/" to="/Sport/Default" exact />
          <Route path="/Auth/Register" component={Register} />
          <Route path="/Auth/RecoverPassword" component={RecoverPassword} />
          <Route path="/Auth/ResetPassword" component={ResetPassword} />
          <Route path="/Sport/Jackpot" component={Jackpot} />
          <Route path="/Sport/Virtual" component={Virtual} />
          <Route path="/Casino" component={Casino} />
          <Route path="/Sport/:path?/:extra?" exact>
            <Main>
              <SportRoutes />
            </Main>
          </Route>
          <Route path="/Live/:path?/:extra?" exact>
            <InPlay>
              <LiveRoutes />
            </InPlay>
          </Route>
          <Route path="/Account/:path?/:extra?" exact>
            <Account>
              <AccountRoutes />
            </Account>
          </Route>
          <Route x="/BecomeAnAgent/:path?/:extra?" exact>
            <BecomeAnAgent>
              <Switch>
                <Route exact path="/BecomeAnAgent/register" component={AgentRegister} />
                <Route exact path="/BecomeAnAgent/benefits" component={Benefits} />
                <Route exact path="/BecomeAnAgent/how-to-start" component={EasySteps} />
                <Route exact path="/BecomeAnAgent" component={Index} />
              </Switch>
            </BecomeAnAgent>
          </Route>
          <Route path={["/404", "*"]} component={NotFound} />
        </Switch>
      </Router>
    </Fragment>
  );
}
