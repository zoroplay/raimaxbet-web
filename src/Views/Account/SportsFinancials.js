import React, {useEffect, useState} from "react";
import {formatDate, formatNumber} from "../../Utils/helpers";
import DatePicker from "react-datepicker";
import moment from "moment";
import {sportsReport} from "../../Services/apis";
import {toast} from "react-toastify";
import {useSelector} from "react-redux";

export default function SportsFinancials() {
    const [commissionReport, setCommissionReport] = useState({});
    const [openBetsReport, setOpenBetsReport] = useState({});
    const [salesSummary, setSalesSummary] = useState([]);
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    const [filterData, setFilterData] = useState({
        from: moment().toDate(),
        to: moment().toDate(),
        page_size: 15
    });


    const fetchResult = () => {
        const data = {...filterData};
        data.from = formatDate(data.from, 'DD-MM-YYYY');
        data.to = formatDate(data.to, 'DD-MM-YYYY');

        sportsReport(data).then(res => {
            setCommissionReport(res.commissionReport);
            setOpenBetsReport(res.openBetsReport);
            setSalesSummary(res.salesSummary);
        }).catch(err => toast.error('Unable to fetch results'));
    }

    useEffect(() => {
       fetchResult();
    }, []);

    const handleChange = (name, value) => {
        setFilterData({...filterData, [name]: value });
    }

    const setDateRange = (e) => {
        const period = e.target.value;
        switch(period) {
            case 'today':
                setFilterData({
                    ...filterData,
                    from: moment().toDate(),
                    to: moment().toDate()
                });
                break;
            case 'yesterday':
                setFilterData({
                    ...filterData,
                    from: moment().subtract(1, 'day').toDate(),
                    to: moment().subtract(1, 'day').toDate()
                });
                break;
            case 'current_week':
                setFilterData({
                    ...filterData,
                    from: moment().startOf('isoWeek').toDate(),
                    to: moment().endOf('isoWeek').toDate()
                });
                break;
            case 'last_week':
                setFilterData({
                    ...filterData,
                    from: moment().subtract(1, 'week').startOf('isoWeek').toDate(),
                    to: moment().subtract(1, 'week').endOf('isoWeek').toDate()
                });
                break;
            case 'current_month':
                setFilterData({
                    ...filterData,
                    from: moment().startOf('month').toDate(),
                    to: moment().endOf('month').toDate()
                });
                break;
            case 'last_month':
                setFilterData({
                    ...filterData,
                    from: moment().subtract(1, 'month').startOf('month').toDate(),
                    to: moment().subtract(1, 'month').endOf('month').toDate()
                });
                break;
            case 'last_30_days':
                setFilterData({
                    ...filterData,
                    from: moment().subtract(30, 'days').toDate(),
                    to: moment().toDate()
                });
                break;
            default:
                setFilterData({
                    ...filterData,
                    from: moment().toDate(),
                    to: moment().toDate()
                });
        }
        // fetchResult();
    }

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
                                                <table className="SearchContainerStyle" >
                                                    <tbody>
                                                    <tr className="SearchSectionStyle">
                                                        <td className="SearchDescStyle">
                                                            Period
                                                            <select
                                                                name="ac$w$PC$PC$BetList$ddlFiltoData"
                                                                id="ac_w_PC_PC_BetList_ddlFiltoData"
                                                                className="dropdownFiltoData"
                                                                onChange={setDateRange}
                                                                style={{width:'100px'}}
                                                            >
                                                                <option value="today">Today</option>
                                                                <option value="yesterday">Yesterday</option>
                                                                <option value="current_week">Current Week</option>
                                                                <option value="last_week">Last Week</option>
                                                                <option value="current_month">Current Month</option>
                                                                <option value="last_month">Last Month</option>
                                                                <option value="last_30_days">Last 30 Days</option>
                                                                <option value="date_range">Date Range</option>
                                                            </select>
                                                        </td>
                                                        <td className="SearchDescStyle">
                                                            From
                                                            <DatePicker
                                                                dateFormat="dd/MM/yyyy"
                                                                selected={filterData.from}
                                                                className="dropdownFiltoData"
                                                                style={{width:'75px' }}
                                                                onChange={date => handleChange('from', date)} />
                                                        </td>
                                                        <td className="SearchControlsStyle">
                                                            <td className="SearchDescStyle">
                                                                To
                                                                <DatePicker
                                                                    dateFormat="dd/MM/yyyy"
                                                                    selected={filterData.to}
                                                                    className="dropdownFiltoData"
                                                                    style={{width:'75px' }}
                                                                    onChange={date => handleChange('to', date)} />
                                                            </td>
                                                        </td>
                                                        <td className="tdSrcDX">
                                                            <input
                                                                type="submit" name="ac$w$PC$PC$BetList$btnAvanti"
                                                                value="Search"
                                                                onClick={fetchResult}
                                                                id="ac_w_PC_PC_BetList_btnAvanti" className="button" />
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                            <div className="divDg">
                                                <h3 className="pl5">
                                                    Sales Summary
                                                </h3>
                                                <div className="p-0">
                                                    <table className="dgStyle" style={{borderWidth:'1px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                                        <thead>
                                                        <tr className="dgHdrStyle">
                                                            <th className="txt-c">User</th>
                                                            <th className="txt-r">Sold</th>
                                                            <th className="txt-r">Won</th>
                                                            <th className="txt-r">Cash at Hand</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {salesSummary && salesSummary.map((summary, i) =>
                                                            <tr className="dgItemStyle">
                                                                <td className="txt-c">{summary.username}</td>
                                                                <td className="txt-r">{formatNumber(summary.sold)}</td>
                                                                <td className="txt-r">{formatNumber(summary.won)}</td>
                                                                <td className="txt-r">{formatNumber(summary.balance)}</td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <h3 className="pl5">
                                                    General Report on Open Bet
                                                </h3>
                                                <div className="p-0 card-body">
                                                    <table className="dgStyle" style={{borderWidth:'1px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                                        <thead className="txt-c">
                                                        <tr className="dgHdrStyle">
                                                            <th>Detail</th>
                                                            <th>Date</th>
                                                            <th>No. of Sales</th>
                                                            <th>Tot. Sold</th>
                                                            <th>Tot. Potential Win</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr className="dgItemStyle">
                                                            <td className="txt-c">
                                                                <a href="javascript:;" className="text-dark">
                                                                    {/*<fa icon="search"></fa>*/}
                                                                </a>
                                                            </td>
                                                            <td className="txt-c">{ `From ${formatDate(filterData.from, 'DD-MM-YYYY') } To ${ formatDate(filterData.to, 'DD-MM-YYYY')}`}</td>
                                                            <td className="txt-c">{ openBetsReport?.totalPlayed }</td>
                                                            <td className="txt-r pr-2">{SportsbookGlobalVariable.Currency} { (openBetsReport?.totalAmountPlayed === 0) ? '0.00' : formatNumber(openBetsReport?.totalAmountPlayed) }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { (openBetsReport?.potWinnings === 0) ? '0.00' : formatNumber(openBetsReport?.potWinnings) }</td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <h3 className="pl5">
                                                    Open Bet Report By Client
                                                </h3>
                                                <div className="p-0">
                                                    <table className="dgStyle" style={{borderWidth:'1px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                                        <thead className="txt-c">
                                                        <tr className="dgHdrStyle">
                                                            <th>Detail</th>
                                                            <th>User Name</th>
                                                            <th>No. of Sales</th>
                                                            <th>Tot. Sold</th>
                                                            <th>Possible Win</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {openBetsReport?.lists && openBetsReport?.lists.map((bet, i) =>
                                                            <tr className="dgItemStyle" key={i}>
                                                            <td className="txt-c">
                                                                <a href="javascript:;" className="text-dark">
                                                                    {/*<fa icon="search"></fa>*/}
                                                                </a>
                                                            </td>
                                                            <td className="txt-c">{ bet.username }</td>
                                                            <td className="txt-c">{ bet.total }</td>
                                                            <td className="txt-r pr-2">{SportsbookGlobalVariable.Currency} { (bet.stake === 0) ? '0.00' : formatNumber(bet.stake) }</td>
                                                            <td className="txt-r pr-2">{SportsbookGlobalVariable.Currency} { (bet.winnings === 0) ? '0.00' : formatNumber(bet.winnings) }</td>
                                                            </tr>
                                                        )}
                                                        </tbody>
                                                        <tfoot className="bg-dark text-white">
                                                        <tr className="dgTotalsStyle">
                                                            <td colSpan="2" className="txt-c">Total</td>
                                                            <td className="txt-c">{ openBetsReport?.totalPlayed }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { formatNumber(openBetsReport?.totalAmountPlayed) }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { formatNumber(openBetsReport?.potWinnings) }</td>
                                                        </tr>
                                                        </tfoot>
                                                    </table>
                                                </div>
                                                <h3 className="pl5">
                                                    General Report on Valid Bets For Commissions
                                                </h3>
                                                <div className="p-0 card-body">
                                                    <table className="dgStyle" style={{borderWidth:'1px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                                        <thead>
                                                        <tr className="dgHdrStyle txt-c">
                                                            <th>Detail</th>
                                                            <th>Date</th>
                                                            <th>No. of Sales</th>
                                                            <th>Tot. Sold</th>
                                                            <th>Tot. Won</th>
                                                            <th>Commission</th>
                                                            <th>Bonus Perc.</th>
                                                            <th>Bonus</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr className="dgItemStyle">
                                                            <td className="txt-c">
                                                                <a href="javascript:;" className="text-dark">
                                                                    {/*<fa icon="search"></fa>*/}
                                                                </a>
                                                            </td>
                                                            <td className="txt-c">{ `From ${formatDate(filterData.from, 'DD-MM-YYYY') } To ${ formatDate(filterData.to, 'DD-MM-YYYY')}`}</td>
                                                            <td className="txt-c">{ commissionReport?.no_of_tickets }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { (commissionReport?.played === 0) ? '0.00' : formatNumber(commissionReport?.played) }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { (commissionReport?.won === 0) ? '0.00' : formatNumber(commissionReport?.won) }</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} { (commissionReport?.total_commission === 0) ? '0.00' : formatNumber(commissionReport?.total_commission) }</td>
                                                            <td className="txt-r">0%</td>
                                                            <td className="txt-r">{SportsbookGlobalVariable.Currency} 0.00</td>
                                                        </tr>
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
