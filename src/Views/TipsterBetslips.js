import React, { useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTipsterBetslips} from "../Services/apis";
import {SET_BETSLIP_DATA, SHOW_TIPSTER_BET} from "../Redux/types";
import Loader from "./Components/Loader";
import {formatName} from "../Utils/helpers";
import TipsterBet from "./Components/Modals/TipsterBet";

export default function TipsterBetslips({match}) {
    const user_id = match.params.id;
    const { tipsterBet} = useSelector((state) => state.sportsData);
    const { user} = useSelector((state) => state.auth);
    const [tipster, setTipster] = useState(null);
    const [betslip, setBetslip] = useState(null);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    const findTipster = () => {
        setLoading(true);
        getTipsterBetslips(user_id).then(res => {
            setLoading(false);
            setTipster(res);
        }).catch(err => {
            setLoading(false);
        });
    }

    useEffect(() => {
        if (user_id)
            findTipster();
    }, [user_id]);


    return (
        <>
            <div id="MainContent" className="sport">
                {loading ?
                    <Loader />
                    :
                    (tipster &&
                        <div className="oddsViewPanel ">
                            <div className={`divOdds`}>
                                <div className="title" style={{paddingLeft: '10px'}}>
                                    <span>Open Tickets for { formatName(tipster.username) }</span>
                                </div>
                            </div>
                            <table
                                className="dgStyle" cellSpacing="0" border="0"
                                style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                <tbody>
                                    <tr className="dgHdrStyle">
                                        <th scope="col" style={{textAlign: 'left'}}>
                                            <a href="javascript:;">Betslip ID</a>
                                        </th>
                                        <th scope="col">
                                            <a href="javascript:;">Total Odds</a>
                                        </th>
                                        <th scope="col">
                                            <a href="javascript:;">Minimum Stake</a>
                                        </th>
                                        <th scope="col">
                                            <a href="javascript:;">Percentage</a>
                                        </th>
                                        <th align="center" scope="col">
                                            <a href="javascript:;">Action</a>
                                        </th>
                                    </tr>
                                    {tipster.betslips.map((betslip, i) =>
                                        (
                                            betslip.length > 0 &&
                                            <tr style={{padding: '10px', borderBottom: '1px solid'}} key={i}>
                                                <td className="pl5">
                                                    <a href="javascript:;" className="text-13 text-info"
                                                       onClick={() => {
                                                           dispatch({type: SET_BETSLIP_DATA, payload: betslip})
                                                       }}
                                                    >{ `***********-${tipster.code}` } ({ betslip.selections.length } Events)</a>
                                                </td>
                                                <td style={{textAlign: 'center'}}>{betslip.odds}</td>
                                                <td style={{textAlign: 'center'}}>{betslip.minimum_stake}</td>
                                                <td style={{textAlign: 'center'}}>{betslip.percentage}</td>
                                                <td className="" style={{textAlign: 'center'}}>
                                                    <button
                                                        className="button btn-green"
                                                        disabled={user?.id === tipster.id}
                                                        onClick={() => {
                                                        dispatch({type: SHOW_TIPSTER_BET});
                                                        setBetslip(betslip)
                                                    }}>Rebet</button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>)
                }
            </div>
            {tipsterBet && <TipsterBet dispatch={dispatch} betslip={betslip} reset={() => setBetslip(null)} />}
        </>
    )
}
