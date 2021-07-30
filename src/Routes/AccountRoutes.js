import React, {useEffect} from "react";
/**
 * packages
 */
import {Switch, Route, withRouter} from "react-router-dom";
import TransactionList from "../Views/Account/TransactionList";
import PersonalData from "../Views/Account/PersonalData";
import ChangePassword from "../Views/Account/ChangePassword";
import BetList from "../Views/Account/BetList";
import {Withdrawal} from "../Views/Account/Withdrawal";
import BetDetail from "../Views/Account/BetDetail";
import NewUser from "../Views/Account/NewUser";
import TransferFunds from "../Views/Account/TransferFunds";
import AgencyList from "../Views/Account/AgencyList";
import SportsFinancials from "../Views/Account/SportsFinancials";
import JackpotBetList from "../Views/Account/JackpotBetList";
import {useSelector} from "react-redux";
import {Deposit} from "../Views/Account/Deposit";
import BonusTransactionList from "../Views/Account/BonusTransactionList";
import {Bonuses} from "../Views/Account/Bonuses";

const AccountRoutes = ({history}) => {
    const {isAuthenticated} = useSelector(state => state.auth);

    useEffect(() => {
        if(!isAuthenticated)
            history.replace('/');

    },  [isAuthenticated]);

  return (
      <Switch>
        {/*<Redirect exact from="/Account" to="/Account/Overview" />*/}
        <Route exact path="/Account/TransactionList" component={TransactionList} />
        <Route exact path="/Account/ActiveBonus" component={TransactionList} />
        <Route exact path="/Account/BonusTransactionList" component={BonusTransactionList} />
        <Route exact path="/Account/Bonuses" component={Bonuses} />
        <Route exact path="/Account/BetDetail/:betslip" component={BetDetail} />
        <Route exact path="/Account/BetList" component={BetList} />
        <Route exact path="/Account/JackpotBets" component={JackpotBetList} />
        <Route exact path="/Account/PersonalInfo" component={PersonalData} />
        <Route exact path="/Account/ChangePassword" component={ChangePassword} />
        <Route exact path="/Account/Withdraw" component={Withdrawal} />
        <Route exact path="/Account/Deposit" component={Deposit} />
        <Route exact path="/Account/NewUser" component={NewUser} />
        <Route exact path="/Account/TransferFunds" component={TransferFunds} />
        <Route exact path="/Account/AgencyList" component={AgencyList} />
        <Route exact path="/Account/SportFinancial" component={SportsFinancials} />
      </Switch>
  );
}

export default withRouter(AccountRoutes);
