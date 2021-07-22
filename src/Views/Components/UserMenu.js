import {NavLink} from "react-router-dom";
import React from "react";

export default function UserMenu({user}) {
    return (
        <div className="uxr-drop" id="account-menu">
            <ul className="uxr-ul">
                <li className="uxr-li-head">My Account </li>
                <li className="uxr-li-link"><NavLink title="Bet List" to="/Account/BetList">Bet List</NavLink></li>
                <li className="uxr-li-link"><NavLink title="Jackpot Bet List" to="/Account/JackpotBets">Jackpot Bet List</NavLink></li>
                <li className="uxr-li-link"><NavLink title="Transactions List" to="/Account/TransactionList">Transactions List</NavLink></li>
                {(user.role === 'Master Agent' || user.role === 'Super Agent' || user.role === 'Agent' || user.role === 'Shop') &&
                <li className="uxr-li-link">
                    <NavLink to="/Account/SportFinancial" className="level-2">
                        Sport Financial
                    </NavLink>
                </li>}
                {user.role !== 'Cashier' &&
                <>
                    <li className="uxr-li-link"><NavLink title="Deposit" to="/Account/Deposit">Deposit</NavLink></li>
                    <li className="uxr-li-link"><NavLink title="Withdraw" to="/Account/Withdraw">Withdraw</NavLink></li>
                    <li className="uxr-li-link"><NavLink title="Messages" to="/Account/Messages">Messages</NavLink></li>
                </>
                }
                {(user.role === 'Master Agent' || user.role === 'Super Agent' || user.role === 'Agent' || user.role === 'Shop') &&
                <>
                    <li className="uxr-li-head">PDR</li>
                    <li className="uxr-li-link">
                        <NavLink to="/Account/NewUser?usertype=player">New User</NavLink>
                    </li>
                    {(user.role === 'Master Agent' || user.role === 'Super Agent' || user.role === 'Agent') &&
                    <li className="uxr-li-link">
                        <NavLink to="/Account/NewUser?usertype=shop">
                            New Shop
                        </NavLink>
                    </li>}
                    {(user.role === 'Master Agent' || user.role === 'Super Agent') &&
                    <li className="uxr-li-link">
                        <NavLink to="/Account/NewUser?usertype=agent">
                            New Agent
                        </NavLink>
                    </li>}
                    <li className="uxr-li-link">
                        <a href="https://globalbet.virtual-horizon.com/engine/backoffice/login_BU.htm#accounts"
                           target="_blank" className="level-2">
                            Virtual Credit
                        </a>
                    </li>
                    <li className="uxr-li-link">
                        <NavLink to="/Account/AgencyList">
                            Agency List
                        </NavLink>
                    </li>
                    <li className="uxr-li-link">
                        <NavLink to="/Account/TransferFunds">
                            Transfer Funds
                        </NavLink>
                    </li>
                </>
                }

                <li className="uxr-li-head">Account Detail</li>

                {user.role !== 'Cashier' && <li className="uxr-li-link"><NavLink to="/Account/PersonalInfo">Change Personal Data</NavLink></li>}
                <li className="uxr-li-link"><NavLink to="/Account/ChangePassword" >Change Password</NavLink></li>
            </ul>
        </div>
    )
}
