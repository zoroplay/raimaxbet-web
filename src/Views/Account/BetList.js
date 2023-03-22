import React, {useEffect, useState} from "react";
import moment from "moment";
import {cancelTicket, getBetList} from "../../Services/apis";
import {formatDate, formatNumber} from "../../Utils/helpers";
import BetListFilter from "../Components/BetListFilter";
import BetListOutcome from "../Components/BetListOutcome";
import {NavLink} from "react-router-dom";
import Pagination from "../Components/Pagination";
import {LOADING} from "../../Redux/types";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

export default function BetList({match, history}) {
    const [isCancel, setCancel] = useState({show: false, ticketId: ''});
    const dispatch = useDispatch();

    const [filterData, setFilterData] = useState({
        from: moment().subtract(1, 'w').toDate(),
        to: moment().toDate(),
        period: '',
        status: '',
        betslip_id:'',
        page_size: 15,
    });

    const [pagination, setPagination] = useState({
        total: 0,
        per_page: 2,
        from: 1,
        to: 0,
        current_page: 1,
        last_page: 0
    });

    const [totalStake, setTotalStake] = useState(0);
    const [totalWinnings, setTotalWinnings] = useState(0);
    const [loading, setLoading] = useState(true);
    const [bets, setBets] = useState([]);
    const {user} = useSelector(state => state.auth);

    const fetchBetList = (page) => {
        setLoading(true);
        const data = {
            type: filterData.type,
            from: moment(filterData.from).format('YYYY-MM-DD'),
            to: moment(filterData.to).format('YYYY-MM-DD'),
            page_size: filterData.page_size,
            betslip_id: filterData.betslip_id,
            status: filterData.status
        }
        getBetList(data, page).then(res => {
            setPagination({
                total: res.tickets.total,
                per_page: res.tickets.per_page,
                from: res.tickets.from,
                to: res.tickets.to,
                current_page: res.tickets.current_page,
                last_page: res.tickets.last_page
            })
            setBets(res.tickets.data);
            setTotalWinnings(res.totalWon);
            setTotalStake(res.totalSales);
            setLoading(false);

        }).catch(err => {
            setLoading(false);

        })
    }

    useEffect(() => {
        fetchBetList(1);
    }, []);

    const handleChange = (name, value) => {
        setFilterData({...filterData, [name]: value });
    }

    const confirmCancel = (ticketId) => {
        setCancel({
            ...isCancel,
            show: true,
            ticketId
        });
    }

    const doCancel = () => {
        dispatch({type: LOADING});
        cancelTicket(isCancel.ticketId).then(res => {
            dispatch({type: LOADING});
            closeModal();
            if(res.success) {
                toast.success('Ticket has been canceled');
                fetchBetList(pagination.current_page);
            } else {
                toast.error(res.message);
            }
        })
    }

    const closeModal = () => {
        setCancel({...isCancel, show: false});
    }

    return (
        <>
            <div id="MainContent" className="">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div className="betlist">
                                <BetListFilter filterData={filterData} handleChange={handleChange} fetchResult={fetchBetList} ticketsLength={bets.length} />
                                <div className="divDg">

                                    {/*<div>
                                        <table
                                            className="dgStyle" cellSpacing="0" border="0"
                                            id="ac_w_PC_PC_BetList_grid"
                                            style={{
                                                borderWidth:'0px',
                                                borderStyle:'None',
                                                width: '100%',
                                                borderCollapse:'collapse'
                                            }}>
                                            <tbody>
                                            <tr className="dgEmptyStyle">
                                                <td colSpan="12">
                                                    No record found
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>*/}
                                    <div>
                                        <table className="dgStyle" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
                                               style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                            <tbody>
                                            <tr className="dgHdrStyle">
                                                {user.role === 'Cashier' && <th></th> }
                                                <th scope="col" style={{textAlign: 'left'}}>Betslip</th>
                                                <th scope="col">User</th>
                                                <th scope="col">Bet Type</th>
                                                <th scope="col">Date</th>
                                                <th scope="col">Result Date</th>
                                                <th className="dgHdrImporti" scope="col">Amount</th>
                                                <th scope="col">Outcome</th>
                                                <th className="dgHdrImporti" scope="col">Winnings</th>
                                            </tr>
                                            {loading ? (
                                                <tr className="dgItemStyle">
                                                    <td colSpan="12">Loading...Please wait!</td>
                                                </tr>
                                            ):(
                                                bets.length > 0 ? (
                                                    bets.map((bet, i) =>
                                                        <tr className="dgItemStyle" key={bet.betslip_id}>
                                                            {user.role === 'Cashier' && (bet.active_selections.length === bet.selections.length) &&
                                                            <td style={{cursor: 'pointer'}}>
                                                                {bet.status === 0 && <img onClick={() => confirmCancel(bet.id)} src="/img/cancel-button.png" alt="" /> }
                                                            </td>}
                                                            <td className="btnsec codcoupon">
                                                                <NavLink
                                                                   title="Dislpay Betslip"
                                                                   to={`/Account/BetDetail/${bet.betslip_id}`}>{bet.betslip_id}</NavLink>
                                                            </td>
                                                            <td align="center">{bet.username}</td>
                                                            <td align="center">{bet.bet_type}</td>
                                                            <td align="center">{formatDate(bet.created_at, 'DD/MM/YYYY HH:mm:ss')}</td>
                                                            <td align="center">{bet.settled_at ? formatDate(bet.settled_at,  'DD/MM/YYYY HH:mm:ss') : ''}</td>
                                                            <td align="right">{formatNumber(bet.stake)}</td>
                                                            <td align="center">
                                                                <BetListOutcome outcome={bet.status} />
                                                            </td>
                                                            <td align="right">{bet.status === 0 ? formatNumber(bet.pot_winnings) : formatNumber(bet.winnings)}</td>
                                                        </tr>
                                                    )
                                                ):(
                                                    <tr className="dgEmptyStyle">
                                                        <td colSpan="12">
                                                            No record found
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            <tr className="dgTotalsStyle">
                                                <td className="btnsec" colSpan="4" style={{width: '100%'}}>- Total Page -
                                                </td>
                                                <td className="dgTotalsImpPos" colSpan="2" style={{whiteSpace:'nowrap'}}>{formatNumber(totalStake)}</td>
                                                <td colSpan="1"></td>
                                                <td className="dgTotalsImpNeg" colSpan="1" style={{whiteSpace:'nowrap'}}>{formatNumber(totalWinnings)}</td>
                                                <td colSpan="4"></td>
                                            </tr>
                                            {/*<tr className="dgTotalsStyle">
                                                <td className="btnsec" colSpan="4" style={{width: '100%'}}>- Total -</td>
                                                <td className="dgTotalsImpPos" colSpan="2" style={{whiteSpace:'nowrap'}}></td>
                                                <td colSpan="1"></td>
                                                <td className="dgTotalsImpNeg" colSpan="1" style={{whiteSpace:'nowrap'}}></td>
                                                <td colSpan="4"></td>
                                            </tr>*/}
                                            <Pagination
                                                colspan={9}
                                                data={pagination}
                                                offset={10}
                                                changePage={fetchBetList} />
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isCancel.show && <div className="bet-confirm-popup-wrapper">
            <div className="bet-confirm-popup">
                <div className="close-bet-confirm-popup" onClick={closeModal}>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <div className="bet-confirm-content">
                    <div className="title">
                        <img src="/img/bet-confirm-info.png" alt="" />
                        <span>Are you sure you want to cancel this ticket?<br />
                        <small style={{color: 'red'}}>Note: You can only cancel tickets within 5 mins after registering the ticket</small>
                        </span>
                    </div>
                    <div className="buttons">
                        <div className="cancel-button button" onClick={closeModal}>
                            No
                        </div>
                        <div className="confirm-button button" onClick={doCancel}>
                            Yes
                        </div>
                    </div>
                </div>
            </div>
        </div>}
        </>
    );
}
