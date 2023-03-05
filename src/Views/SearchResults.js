import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {findFixtures} from "../Services/apis";
import {LOADING} from "../Redux/types";
import {formatDate} from "../Utils/helpers";
import {NavLink} from "react-router-dom";


export default function SearchResults({location}) {
    const urlParam = new URLSearchParams(location.search);
    const q = urlParam.get('q');
    const [results, setResults] = useState([]);
    const {loading} = useSelector((state) => state.login);
    const dispatch = useDispatch();

    const find = () => {
        dispatch({type: LOADING});
        findFixtures(q).then(res => {
            dispatch({type: LOADING});
            setResults(res);
        }).catch(err => dispatch({type: LOADING}))
    }

    useEffect(() => {
        if (q) {
            find();
        }
    }, [q]);



    return (
        <>
            <div id="MainContent" className="sport">
                {!loading && results.length === 0 &&
                <div className="iSBox ctrl_oddsView" >
                    <div className="oddsViewPanel">
                        <div className="empty">
                            <span>No Results Found</span>
                        </div>
                    </div>
                </div>}
                {!loading && results.length > 0 &&
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div id="s_w_PC_PC_panelSquare">
                                <div className="groupsDivMain">
                                    <div>
                                        <table
                                            className="dgStyle" cellSpacing="0" border="0"
                                            style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                            <tbody>
                                                <tr className="dgHdrStyle">
                                                <th scope="col">
                                                    <a href="javascript:;">Description</a>
                                                </th>
                                                <th align="center" scope="col">
                                                    <a href="javascript:;">Start Date</a>
                                                </th>
                                            </tr>
                                                {results.map((result, i) =>
                                                    <tr className="dgItemStyle" key={`match-${result.provider_id}`}>
                                                        <td className="ricercaSE">
                                                            <div className="ricercaEevento">{result.sport_tournament_name}</div>
                                                            <NavLink to={`/Sport/EventDetail?EventID=${result.provider_id}`}>{result.event_name}</NavLink>
                                                        </td>
                                                        <td className="ricercaData">
                                                            <span id="s_w_PC_PC_gridSottoEventi_ctl02_lblData">{formatDate(parseInt(result.schedule), 'DD/MM/YYYY HH:mm:ss')}</span>
                                                        </td>
                                                    </tr>
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
