import React, {useEffect, useState} from "react";
import moment from "moment";
import {cancelTicket, getCouponTickets} from "../../Services/apis";
import {formatDate, formatNumber} from "../../Utils/helpers";
import BetListFilter from "../Components/BetListFilter";
import BetListOutcome from "../Components/BetListOutcome";
import {NavLink} from "react-router-dom";
import Pagination from "../Components/Pagination";
import {LOADING} from "../../Redux/types";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";

export default function CouponTicket({match, history}) {
    const [isCancel, setCancel] = useState({show: false, ticketId: ''});
    const [showConfirmPayout, setShowConfirmPayout] = useState({show: false, betslip: null});
    const dispatch = useDispatch();

    const [filterData, setFilterData] = useState({
        from: moment().subtract(1, 'w').toDate(),
        to: moment().toDate(),
        period: '',
        status: '',
        betslip_id:'',
        page_size: 15
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
            from: moment(filterData.from).format('DD/MM/YYYY'),
            to: moment(filterData.to).format('DD/MM/YYYY'),
            page_size: filterData.page_size,
            betslip_id: filterData.betslip_id
        }
        getCouponTickets(data, page).then(res => {
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

    const closeConfirmModal = () => {
        fetchBetList(pagination.current_page);
        setShowConfirmPayout({show: false, betslip: null});
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
                                                {(user.role === 'Cashier' || user.role === 'Shop' )&& <th></th> }
                                                <th><span>Coupon No.</span></th>
                                                {user?.role !== 'Cashier' && user?.role !== 'Player' &&
                                                <th>
                                                    <span>Username</span>
                                                </th>}
                                                <th>
                                                    <span>Total Odds</span>
                                                </th>
                                                <th>
                                                    <span>Stake</span>
                                                </th>
                                                <th>
                                                    <span>Pot. Winnings</span>
                                                </th>
                                                <th role="button">
                                                    <span>Date</span>
                                                </th>
                                                <th>
                                                    <span>Result Date</span>
                                                </th>
                                                <th>
                                                    <span>Status</span>
                                                </th>
                                                <th>
                                                    <span>Paid Status</span>
                                                </th>
                                            </tr>
                                            {loading ? (
                                                <tr className="dgItemStyle">
                                                    <td colSpan="10">Loading...Please wait!</td>
                                                </tr>
                                            ):(
                                                bets.length > 0 ? (
                                                    bets.map((bet, i) =>
                                                    <tr className="dgItemStyle" key={bet.coupon_no}>
                                                        {bet.status === 0 &&
                                                            <img src="/img/cancel-button.png" onClick={() => confirmCancel(bet.id)} alt="" />
                                                        }
                                                    <td>
                                                        <a
                                                            title="Dislpay Betslip"
                                                            href='#'>{bet.coupon_no}</a>
                                                    </td>
                                                    {user?.role !== 'Cashier' && user?.role !== 'Player' && <td align="center">{bet.username}</td>}
                                                    <td align="center">{bet.odds}</td>
                                                    <td align="right">{formatNumber(bet.stake)}</td>
                                                    <td align="right">{formatNumber(bet.pot_winnings)}</td>
                                                    <td align="center">{formatDate(bet.created_at, 'DD/MM/YYYY HH:mm:ss')}</td>
                                                    <td align="center">{bet.settled_at ? formatDate(bet.settled_at,  'DD/MM/YYYY HH:mm:ss') : ''}</td>
                                                    <td align="center">
                                                        <BetListOutcome outcome={bet.status} />
                                                    </td>
                                                    <td style={{padding: '5px'}}>
                                                        {user?.role === 'Shop' && bet.status === 1 && bet.paid_out === 0 ?
                                                            <button
                                                                onClick={() => setShowConfirmPayout({show: true, betslip: bet })}
                                                                className="btn btn-sm btn-success"
                                                                style={{ fontSize: '8px'}}
                                                            >Pay</button>
                                                            : <span className="nvs-status-color-11">Not Paid</span>
                                                        }
                                                        {bet.status === 1 && bet.paid_out === 1 && <span className="nvs-status-color-7">Yes</span> }
                                                    </td>
                                                </tr>
                                                    )
                                                ):(
                                                    <tr className="dgEmptyStyle">
                                                        <td colSpan="10">
                                                            No record found
                                                        </td>
                                                    </tr>
                                                )
                                            )}

                                            <tr className="dgTotalsStyle">
                                                <td className="btnsec" colSpan="2" >- Total Page -
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
        {/* {showConfirmPayout.show && <ConfirmPayoutModal closeModal={closeConfirmModal} betslip={showConfirmPayout.betslip} />} */}

        </>
    );
}
