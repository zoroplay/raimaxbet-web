import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useSWR from "swr/esm/use-swr";
import {formatNumber} from "../../Utils/helpers";
import {SHOW_PASSWORD_MODAL} from "../../Redux/types";

export default function AgencyList() {
    const {user} = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [users, setUsers] = useState([]);
    const [filtered, setFiltered] = useState([]);

    const {data, error} = useSWR('/user/account/agent-users');
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    useEffect(() => {
        if (data) {
            setUsers(data);
            setFiltered(data);
        }
    }, [data]);

    return (
        <>
            <div id="MainContent" className="">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div className="betslist">
                                <div className="RiquadroSrc">
                                    <div className="Cnt">
                                        <div>
                                            <div className="pb15 pt15">
                                                <table className="SearchContainerStyle">
                                                    <tbody>
                                                    <tr className="SearchSectionStyle">
                                                        <td className="SearchDescStyle">
                                                            Filter By
                                                            <select
                                                                name="ac$w$PC$PC$BetList$ddlFiltoData"
                                                                id="ac_w_PC_PC_BetList_ddlFiltoData"
                                                                className="dropdownFiltoData"
                                                                style={{width:'150px'}}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    console.log(val)
                                                                    if (val === '') {
                                                                        setFiltered(users);
                                                                    } else {
                                                                        setFiltered(users.filter(user => user.rolename === e.target.value));
                                                                    }
                                                                }}
                                                            >
                                                                <option value="">All</option>
                                                                {(user.role === 'Super Agent' || user.role === 'Master Agent') && <option value="Agent" >Agent</option> }
                                                                {(user.role === 'Super Agent' || user.role === 'Master Agent' || user.role === 'Agent') && <option value="Shop">Shop</option>}
                                                                <option value="Cashier">Cashier</option>
                                                                <option value="Player">Player</option>
                                                            </select>
                                                        </td>
                                                        <td className="SearchControlsStyle">
                                                            <td className="SearchDescStyle">
                                                                Fast Search
                                                                <input
                                                                    name="ac$w$PC$PC$BetList$txtCodiceCoupon"
                                                                    type="text"
                                                                    defaultValue=""
                                                                    className="textbox dropdownFiltoData"
                                                                    style={{width: '150px' }}
                                                                    onKeyUp={(e) => {
                                                                        const q = e.target.value;

                                                                        if(q.length >= 3) {
                                                                            setFiltered(users.filter(user => user.username.includes(q)));
                                                                        }
                                                                        if (q === '')
                                                                            setFiltered(users);
                                                                    }}
                                                                />
                                                            </td>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="divDg">
                                                <div className="">
                                                    <table className="dgStyle" cellSpacing="0" border="0"
                                                               style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                                        <tbody>
                                                            <tr className="dgHdrStyle">
                                                                <th width="10%">Id</th>
                                                                <th>User Type</th>
                                                                <th>Username</th>
                                                                <th>Name</th>
                                                                <th>Balance</th>
                                                                <th />
                                                            </tr>
                                                        </tbody>
                                                        <tbody>
                                                            {filtered && !error && filtered.map((row, i) =>
                                                                <tr className="dgItemStyle txt-c" key={i}>
                                                                    <td>{ row.code }</td>
                                                                    <td>{ row.rolename }</td>
                                                                    <td>{ row.username }</td>
                                                                    <td>{ row.name }</td>
                                                                    <td>{SportsbookGlobalVariable.Currency}{ formatNumber(row.balance) }</td>
                                                                    <td>
                                                                        <a href="javascript:;" onClick={() => dispatch({
                                                                            type: SHOW_PASSWORD_MODAL,
                                                                            payload: {open: true, user_id: row.id }
                                                                        })}>
                                                                            <img src="/img/password.png" alt="" />
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {filtered && filtered.length === 0 &&
                                                            <tr className="dgItemStyle">
                                                                <td colSpan="8" className="txt-c">
                                                                    No result found
                                                                </td>
                                                            </tr>
                                                            }
                                                            {!filtered.length &&
                                                                <tr className="dgItemStyle">
                                                                    <td colSpan="8" className="txt-c">
                                                                        Loading...
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
