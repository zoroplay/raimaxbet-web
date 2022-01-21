import React, {useState, useEffect} from "react";
import {NavLink} from "react-router-dom";
import {
    REMOVE_USER_DATA,
    SET_USER_DATA,
    SHOW_DEPOSIT_MODAL, UPDATE_USER_BALANCE,
    UPDATE_USER_DATA,
    UPDATE_USERNAME
} from "../../../Redux/types";
import {authDetails, login, sendLogout} from "../../../Services/apis";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from 'react-router-dom';
import {formatNumber, formattedPhoneNumber} from "../../../Utils/helpers";
import UserMenu from "../../Components/UserMenu";
import {toast} from "react-toastify";
import moment from "moment";
import {LEcho} from "../../../Utils/laravel-echo";

export default function Header() {
    const {user, isAuthenticated} = useSelector((state) => state.auth);
    const {loading} = useSelector((state) => state.login);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggingIn, setLogginIn] = useState(false);
    const [refreshing, setRefresh] = useState(false);
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        if (isAuthenticated) {
            LEcho.channel(`deposits.${user.username}`)
                .listen('DepositEvent', (e) => {
                    // console.log(e.user);
                    dispatch({type: UPDATE_USER_BALANCE, payload: e.user.balance});
                    toast.success('Your deposit request was successful')
                })
        }
    }, [isAuthenticated]);

    const submitForm = (e) => {
        e.preventDefault();

        if(username === '' || password === '') {
            return;
        }

        setLogginIn(true);

        login(formattedPhoneNumber(username), password).then(res => {
            setLogginIn(false);
            if (!res.success) {
                toast.error(res.message, {position: 'top-right'});
                if (res.error === 'password_not_set'){
                    dispatch({type: UPDATE_USERNAME, payload: username});
                    history.push('/Auth/RecoverPassword');
                }
                return;
            }

            dispatch({
                type:SET_USER_DATA,
                payload: {
                    user: res.user,
                    access_token: res.token,
                    isAuthenticated: true
                }
            });
        }).catch(err => {
            setLogginIn(false);
            if(err.response.status === 401) {
                toast.error('Invalid username or password', {position: 'top-right'})
            };
        })
    }

    const refreshBalance = () => {
        setRefresh(true);
        authDetails().then(resp => {
            setRefresh(false);
            if(resp.user) {
                const user = resp.user;
                dispatch({
                    type: UPDATE_USER_DATA,
                    payload: user
                });
            }
        }).catch(err => {
            setRefresh(false);

        });
    }

    const onKeyUp = (e) => {
        if (e.key === 'Enter') {
            submitForm(e);
        }
    }

    const logout = () => {
        sendLogout().then(res => {
            dispatch({type: REMOVE_USER_DATA});
            document.body.classList.add("Anonymous");
            document.body.classList.remove("Logged");
            history.push('/')
        }).catch(err => {
            dispatch({type: REMOVE_USER_DATA});
            document.body.classList.add("Anonymous");
            document.body.classList.remove("Logged");
            history.push('/')
        });
    }

    return (
        <header className="header">
            {loading &&
            <div className="MenuUpdate">
                <div id="h_w_ctl45_UpdateProgress"  role="status" aria-hidden="true">
                    Please wait&nbsp;
                    <img id="h_w_ctl45_imgWait" src="/img/wait_top.gif" align="absmiddle" style={{borderWidth:'0px'}} />
                </div>
            </div>}
            <div className="header-top-container">
                <div className="nav-top">
                    <div className="nav-logo-container">
                        <a href="/Sport/Default">
                            <img src="/img/logo.png"
                                 alt="pitch90" className="nav-logo" />
                        </a>
                    </div>
                    {!isAuthenticated ?
                        <div className="login-form-container">
                            <form onSubmit={submitForm} method="POST" className="login-form">
                                <div className="form-left">
                                    <input type="text" placeholder="Username" name="username"
                                           value={username}
                                           onChange={(e) => setUsername(e.target.value) }/>
                                    <NavLink tabIndex="-1" to="/Auth/RecoverPassword">Forgot password?</NavLink>
                                </div>
                                <div className="form-right">
                                    <input type="password" placeholder="Password" name="password"
                                           value={password}
                                           onChange={(e) => setPassword(e.target.value) }
                                           onKeyPress={onKeyUp}
                                    />
                                    <input name="action_flag" type="hidden" value="login" />
                                    <NavLink to="/Auth/Register">Register</NavLink>
                                </div>
                                <input type="submit" className="login-btn" disabled={loggingIn} value={loggingIn ? 'Logging in...' : 'Login'} />
                            </form>
                        </div>
                        :

                        <div className="uxr-container uzr-container">
                            <div className="uzr-inner">
                                <div className="uzr-a">
                                    <i className="uzr-a-ico" /> {user.username}
                                </div>
                                <div className="uzr-b">
                                    {!refreshing ? <i className="uzr-b-ico" onClick={refreshBalance} /> : <i className={`fa fa-spin fa-spinner`} /> }
                                    Availability: <span className="uzr-b-cur">{SportsbookGlobalVariable.Currency}</span><span className="uzr-b-num">{formatNumber(user.balance)}</span>
                                </div>
                                <div className="uzr-b">
                                    Balance: <span className="uzr-b-cur">{SportsbookGlobalVariable.Currency}</span><span className="uzr-b-num">{formatNumber(user.balance)}</span>
                                </div>
                                <div className="uzr-b">
                                    Bonus: <span className="uzr-b-cur">{SportsbookGlobalVariable.Currency}</span><span className="uzr-b-num">{formatNumber(user.bonus_balance)}</span>
                                </div>
                            </div>
                        </div>
                    }
                </div>

                <div className="nav-mid">
                    <ul className="nav-mid-list">
                        <li className="nav-mid-list-li">
                            <NavLink id="indexSport" to="/Sport/Default" className="sel">
                                <h1>Sport</h1>
                            </NavLink>
                        </li>
                        <li className="nav-mid-list-li"><NavLink id="indexLive" to="/Live/LiveDefault"><h1>In-Play</h1></NavLink></li>
                        <li className="nav-mid-list-li">
                            {user.role === 'Cashier' ?
                                <a
                                    target="_blank"
                                    href={`${process.env.REACT_APP_GLOBALBET_PROD}/engine/shop/autologin/account?login=${user.username}-BTK&code=${user.auth_code}&shopRedirectTo=/client/shop.jsp%3Flocale=en_US`}>
                                    <h1>Virtual</h1>
                                </a>
                                :
                                <NavLink to="/Sport/Virtual">
                                    <h1>Virtual</h1>
                                </NavLink>
                            }
                        </li>
                        <li className="nav-mid-list-li"><NavLink id="indexCasino" to="/Sport/PrintFixtures"><h1>Print Fixtures</h1></NavLink></li>
                        <li className="nav-mid-list-li"><NavLink  id="indexJackpot" to="/Sport/Jackpot"><h1>Jackpot</h1></NavLink></li>
                        <li className="nav-mid-list-li"><NavLink id="indexJackpot" to="/Sport/Explore"><h1>Today's</h1></NavLink></li>
                        <li className="nav-mid-list-li"><NavLink id="indexJackpot" to="/Sport/Tipsters"><h1>Tipsters</h1></NavLink></li>
                        <li className="nav-mid-list-li"><a href={process.env.REACT_APP_MOBILE_URL}><h1>Mobile</h1></a></li>
                    </ul>
                    {isAuthenticated &&
                    <div className="uxr-container">
                        <div className="uxr-inner">
                            <div className="uxr-a">
                                <NavLink to="/Account/Deposit" className="uxr-a-link">Deposit</NavLink>
                            </div>
                            <div className="uxr-b">
                                <span className="uxr-b-text">My Account</span>
                                <UserMenu user={user} />
                            </div>
                            <div className="uxr-a">
                                <a href="#" onClick={logout} className="uxr-a-link">Logout</a>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
            <div className="header-bottom-container">
                <div className="nav-bottom">
                    <ul className="nav-bottom-list">
                        {/*<li className="nav-bottom-list-li new"><a href="#" onClick="firebets();"><h2>Firebets</h2></a></li>
                        <li className="nav-bottom-list-li"><a href="/Sport/cms?mid=11&amp;sid=0"><h2>Help</h2></a></li>
                        <li className="nav-bottom-list-li"><a href="https://s5.sir.sportradar.com/netbetuof#" target="_blank"><h2>Statistics</h2></a></li>
                        <li className="nav-bottom-list-li"><a href="https://ls.sir.sportradar.com/netbetuof" target="_blank"><h2>Livescore</h2></a></li>
                        <li className="nav-bottom-list-li"><a href="./contact.html"><h2>Contact Us</h2></a></li>*/}
                        <li className="nav-bottom-list-li"><NavLink title="Home" to="/">Home</NavLink></li>
                        <li className="nav-bottom-list-li"><NavLink title="FAQ" to="/Sport/Pages/faq">FAQ</NavLink></li>
                        <li className="nav-bottom-list-li"><NavLink title="How to Deposit / Withdraw" to="/Sport/Pages/how-to-deposit">How to Deposit / Withdraw</NavLink></li>
                        <li className="nav-bottom-list-li"><NavLink title="Tutorials" to="/Sport/Pages/how-to-play">Tutorials</NavLink></li>
                        <li className="nav-bottom-list-li"><a className="free" href={`${process.env.REACT_APP_BASEURL}/Sport/weekly-coupons`} target="_blank">Weekly Coupon</a></li>
                        <li className="nav-bottom-list-li"><a title="Results">Results</a></li>
                        <li className="nav-bottom-list-li"><NavLink title="Contact Us" to="/Sport/Pages/contact-us" >Contact Us</NavLink></li>
                        <li className="nav-bottom-list-li new"><NavLink title="Become An Agent" to="/BecomeAnAgent" >Become an Agent</NavLink></li>
                    </ul>
                    <p className="nav-bottom-clock" id="THEtime">{moment().format('HH:mm')}</p>
                </div>
            </div>
        </header>
    )
}
