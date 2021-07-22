import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import { getTipsters} from "../Services/apis";
import {LOADING} from "../Redux/types";
import {NavLink} from "react-router-dom";
import {formatName} from "../Utils/helpers";


export default function Tipsters({location}) {

    const [results, setResults] = useState([]);
    const {loading} = useSelector((state) => state.login);
    const dispatch = useDispatch();

    const find = () => {
        dispatch({type: LOADING});
        getTipsters().then(res => {
            dispatch({type: LOADING});
            setResults(res.data);
        }).catch(err => {

        })
    }

    useEffect(() => {
        find();
    }, []);

    return (
        <>
            <div id="MainContent" className="sport">
                {!loading && results.length === 0 &&
                <div className="iSBox ctrl_oddsView" >
                    <div className="oddsViewPanel">
                        <div className="empty">
                            <span>No tipster available yet</span>
                        </div>
                    </div>
                </div>}
                {!loading && results.length > 0 &&
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div id="s_w_PC_PC_panelSquare">
                                <div className="groupsDivMain">
                                    <p>Choose your tipster based on the most profitable, the most consistent or a combination. <br />
                                        Played (P), Won (W), Lost (L), Open Ticket (OT) stats all available to help you to choose the best tipster for you.<br />
                                        Click on the tipster name below for their current tips.
                                    </p>
                                    <div>
                                        <table
                                            className="dgStyle" cellSpacing="0" border="0"
                                            style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                            <tbody>
                                                <tr className="dgHdrStyle">
                                                    <th>POS</th>
                                                    <th className="l-table__team">Tipster Name</th>
                                                    <th>P</th>
                                                    <th>W</th>
                                                    <th>L</th>
                                                    <th>OT</th>
                                                </tr>
                                                {results.map((item, i) =>
                                                    (parseInt(item.ongoing) !== 0 &&
                                                    <tr className="dgItemStyle " key={`match-${item.id}`} style={{textAlign: 'center'}}>
                                                        <td>{i +1 }</td>
                                                        <td className="text-left">
                                                            <NavLink to={`/Sport/Tipsters/${item.user_id}`}>
                                                                <strong>{(item.user) ? formatName(item.user.username) : ' - '}</strong>
                                                            </NavLink>
                                                        </td>
                                                        <td>{item.played}</td>
                                                        <td>{item.won}</td>
                                                        <td>({item.lost})</td>
                                                        <td>{item.ongoing}</td>
                                                    </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </>
    )
}
