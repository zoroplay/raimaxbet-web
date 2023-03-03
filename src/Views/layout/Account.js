import Header from "./partials/Header";
import Footer from "./partials/Footer";
import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import DepositModal from "../Components/Modals/DepositModal";
import "react-datepicker/dist/react-datepicker.css";
import { NavLink, withRouter } from "react-router-dom";
import { SHOW_DEPOSIT_MODAL } from "../../Redux/types";
import ConfirmBonusWithdrawal from "../Components/Modals/ConfirmBonusWithdrawal";

const Account = ({ children, history }) => {
  const { depositModal, bonusModal } = useSelector((state) => state.sportsData);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <Fragment>
      <Header />
      <main className="main-content">
        <section className="section-content">
          <div className="logged-page">
            <div className="side1 logged-menu">
              <ul className="">
                <li className="has-sub-menu">My Account </li>
                <li className="uxr-li-link">
                  <NavLink title="Bet List" to="/Account/BetList">
                    Bet List
                  </NavLink>
                </li>
                <li className="uxr-li-link">
                  <NavLink title="Bet List" to="/Account/JackpotBets">
                    Jackpot Bet List
                  </NavLink>
                </li>
                <li className="uxr-li-link">
                  <NavLink title="Bet List" to="/Account/CouponBets">
                    Coupon BetList
                  </NavLink>
                </li>
                <li className="uxr-li-link">
                  <NavLink
                    title="Transactions List"
                    to="/Account/TransactionList"
                  >
                    Transactions List
                  </NavLink>
                </li>
                {/* 
                                <li className="uxr-li-link"><NavLink title="Cash Ins" to="/Account/cash-in">Cash In</NavLink></li>
                                <li className="uxr-li-link"><NavLink title="Cash Out" to="/Account/cash-out">Cash Out</NavLink></li>
                                <li className="uxr-li-link"><NavLink title="Expenses" to="/Account/expenses">Expenses</NavLink></li> */}
                <li className="uxr-li-link">
                  <NavLink title="Bonuses" to="/Account/Bonuses">
                    Bonuses
                  </NavLink>
                </li>
                <li className="uxr-li-link">
                  <NavLink
                    title="Transactions List"
                    to="/Account/BonusTransactionList"
                  >
                    Bonus Transaction List
                  </NavLink>
                </li>

                {(user.role === "Master Agent" ||
                  user.role === "Super Agent" ||
                  user.role === "Agent" ||
                  user.role === "Shop") && (
                  <li className="uxr-li-link">
                    <NavLink to="/Account/SportFinancial" className="level-2">
                      Sport Financial
                    </NavLink>
                  </li>
                )}
                {user.role !== "Cashier" && (
                  <>
                    {/* <li className="uxr-li-link">
                      <NavLink title="Deposit" to="/Account/Deposit">
                        Deposit
                      </NavLink>
                    </li> */}
                    {/* <li className="uxr-li-link">
                      <NavLink title="Withdraw" to="/Account/Withdraw-to-bank">
                        Withdraw to Bank
                      </NavLink>
                    </li> */}
                    <li className="uxr-li-link">
                      <NavLink title="Withdraw" to="/Account/Withdraw">
                        Withdraw from Shop{" "}
                      </NavLink>
                    </li>
                    <li className="uxr-li-link">
                      <NavLink title="Messages" to="/Account/Messages">
                        Messages
                      </NavLink>
                    </li>
                  </>
                )}
                {(user.role === "Master Agent" ||
                  user.role === "Super Agent" ||
                  user.role === "Agent" ||
                  user.role === "Shop") && (
                  <>
                    <li className="has-sub-menu">PDR</li>
                    <li className="uxr-li-link">
                      <NavLink to="/Account/NewUser?usertype=player">
                        New User
                      </NavLink>
                    </li>
                    {(user.role === "Master Agent" ||
                      user.role === "Super Agent") && (
                      <li className="uxr-li-link">
                        <NavLink to="/Account/NewUser?usertype=shop">
                          New Shop
                        </NavLink>
                      </li>
                    )}
                    {(user.role === "Master Agent" ||
                      user.role === "Super Agent") && (
                      <li className="uxr-li-link">
                        <NavLink to="/Account/NewUser?usertype=agent">
                          New Agent
                        </NavLink>
                      </li>
                    )}
                    <li className="uxr-li-link">
                      <a
                        href="https://globalbet.virtual-horizon.com/engine/backoffice/login_BU.htm#accounts"
                        target="_blank"
                        className="level-2"
                      >
                        Virtual Credit
                      </a>
                    </li>
                    <li className="uxr-li-link">
                      <NavLink to="/Account/AgencyList">Agency List</NavLink>
                    </li>
                    <li className="uxr-li-link">
                      <NavLink to="/Account/TransferFunds">
                        Transfer Funds
                      </NavLink>
                    </li>
                  </>
                )}

                <li className="has-sub-menu">Account Detail</li>

                {user.role !== "Cashier" && (
                  <li className="uxr-li-link">
                    <NavLink to="/Account/PersonalInfo">
                      Change Personal Data
                    </NavLink>
                  </li>
                )}
                <li className="uxr-li-link">
                  <NavLink to="/Account/ChangePassword">
                    Change Password
                  </NavLink>
                </li>
              </ul>
            </div>

            <div className="logged-center full">{children}</div>
          </div>
        </section>
      </main>
      <Footer />
      {/*<div className="coupon-popup-wrapper" id="reservedCoupon"></div>
            <div className="coupon-popup-wrapper" id="searchEvents"></div>*/}
      {depositModal && <DepositModal dispatch={dispatch} />}
      {bonusModal.show && (
        <ConfirmBonusWithdrawal
          dispatch={dispatch}
          amount={bonusModal.amount}
        />
      )}
    </Fragment>
  );
};
export default withRouter(Account);
