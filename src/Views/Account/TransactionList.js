import React, {useEffect, useState} from "react";
import moment from "moment";
import {getTransactions} from "../../Services/apis";
import {formatDate, formatNumber} from "../../Utils/helpers";
import DatePicker from "react-datepicker";
import Pagination from "../Components/Pagination";

export default function TransactionList() {
    const [filterData, setFilterData] = useState({
        type: '',
        from: moment().subtract(1, 'w').toDate(),
        to: moment().toDate(),
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

    const [totalCredit, setTotalCredit] = useState(0);
    const [loading, setLoading] = useState(true);
    const [totalDebit, setTotalDebit] = useState(0);
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = (page) => {
        setLoading(true);
        const data = {
            type: filterData.type,
            from: moment(filterData.from).format('DD/MM/YYYY'),
            to: moment(filterData.to).format('DD/MM/YYYY'),
            page_size: filterData.page_size
        }
        getTransactions(data, page).then(res => {
            setPagination({
                total: res.transactions.total,
                per_page: res.transactions.per_page,
                from: res.transactions.from,
                to: res.transactions.to,
                current_page: res.transactions.current_page,
                last_page: res.transactions.last_page
            })
            setTransactions(res.transactions.data);
            setTotalCredit(res.page_credit);
            setTotalDebit(res.page_debit);
            setLoading(false);

        }).catch(err => {
            setLoading(false);
        })
    }

    useEffect(() => {
        fetchTransactions(1);
    }, []);

    return (
        <>
            <div id="MainContent">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div className="transactionList">
                                <div className="RiquadroSrc">
                                    <div className="Cnt">
                                        <div>
                                            <table className="SearchContainerStyle">
                                                <tbody>
                                                <tr className="SearchSectionStyle">
                                                    <td className="SearchDescStyle">
                                                        Amounts
                                                    </td>
                                                    <td className="SearchControlsStyle">
                                                        <table width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td width="19%" align="left">
                                                                    Type
                                                                </td>
                                                                <td width="81%" align="left" colSpan="3">
                                                                    <table id="ac_w_PC_PC_rblTipoImporto" border="0">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    id="ac_w_PC_PC_rblTipoImporto_0"
                                                                                    type="radio"
                                                                                    name="ac$w$PC$PC$rblTipoImporto"
                                                                                    value="-1" />
                                                                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_0">All</label>
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    id="ac_w_PC_PC_rblTipoImporto_1"
                                                                                    type="radio"
                                                                                    name="ac$w$PC$PC$rblTipoImporto"
                                                                                    value="1" />
                                                                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_1">Credits</label>
                                                                            </td>
                                                                            <td>
                                                                                <input
                                                                                    id="ac_w_PC_PC_rblTipoImporto_2"
                                                                                    type="radio"
                                                                                    name="ac$w$PC$PC$rblTipoImporto"
                                                                                    value="2" />
                                                                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_2">Debits</label>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr className="SearchSectionStyle">
                                                    <td className="SearchDescStyle">
                                                        Transaction
                                                    </td>
                                                    <td className="SearchControlsStyle">
                                                        <table width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td width="20%" align="left">
                                                                    Type
                                                                </td>
                                                                <td width="30%" align="left">
                                                                    <select name="ac$w$PC$PC$ddlCausale"
                                                                        id="ac_w_PC_PC_ddlCausale"
                                                                        value={filterData.type}
                                                                        onChange={(e) => setFilterData({...filterData, type: e.target.value})}
                                                                        className="dropdown" style={{width: '150px'}}>
                                                                        <option selected="selected" value=""></option>
                                                                        <option value="Bet Deposit">Sports Deposit</option>
                                                                        <option value="Deposit">Deposits</option>
                                                                        <option value="Withdrawal">Withdrawals</option>
                                                                    </select>
                                                                </td>
                                                                <td width="20%"></td>
                                                                <td width="30%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr className="SearchSectionStyle">
                                                    <td className="SearchDescStyle">
                                                        Transaction Type
                                                    </td>
                                                    <td className="SearchControlsStyle">
                                                        <table width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td width="20%" align="left">
                                                                    Type
                                                                </td>
                                                                <td width="30%" align="left">
                                                                    <table id="ac_w_PC_PC_chklTipoCausale" border="0">
                                                                        <tbody>
                                                                        <tr>
                                                                            <td>
                                                                                <input id="ac_w_PC_PC_chklTipoCausale_0"
                                                                                       type="checkbox"
                                                                                       name="ac$w$PC$PC$chklTipoCausale$0"
                                                                                       checked="checked" />
                                                                                <label htmlFor="ac_w_PC_PC_chklTipoCausale_0">Normal</label>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>
                                                                                <input
                                                                                    id="ac_w_PC_PC_chklTipoCausale_1"
                                                                                    type="checkbox"
                                                                                    name="ac$w$PC$PC$chklTipoCausale$1"
                                                                                    checked="checked" />
                                                                                <label htmlFor="ac_w_PC_PC_chklTipoCausale_1">Virtual Bets</label></td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td width="20%">

                                                                </td>
                                                                <td width="30%">

                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr className="SearchSectionStyle">
                                                    <td className="SearchDescStyle">
                                                        Transaction Date
                                                    </td>
                                                    <td className="SectionControlStyle">
                                                        <table width="100%">
                                                            <tbody>
                                                            <tr>
                                                                <td width="20%" align="left"
                                                                    className="SearchControlsStyleFrom">
                                                                    From
                                                                </td>
                                                                <td width="30%" align="left">
                                                                    <DatePicker
                                                                        dateFormat="dd/MM/yyyy"
                                                                        selected={filterData.from}
                                                                        className="textbox"
                                                                        style={{width:'75px' }}
                                                                        onChange={date => setFilterData({...filterData, from: date})} />
                                                                </td>
                                                                <td width="20%" align="right"
                                                                    className="SearchControlsStyleTo">
                                                                    To
                                                                </td>
                                                                <td width="30%" align="left">
                                                                    <DatePicker
                                                                        dateFormat="dd/MM/yyyy"
                                                                        selected={filterData.to}
                                                                        className="textbox"
                                                                        style={{width:'75px' }}
                                                                        onChange={date => setFilterData({...filterData, to: date})} />
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="SearchDescStyle">
                                                        Page Size
                                                    </td>
                                                    <td className="SearchControlsStyle">
                                                        <table className="SearchControlsContainerStyle">
                                                            <tbody>
                                                            <tr>
                                                                <td width="20%" className="SearchControlDesc">
                                                                    &nbsp;
                                                                </td>
                                                                <td width="80%" colSpan="3">
                                                                    <select name="ac$w$PC$PC$ddlPageSize"
                                                                            id="ac_w_PC_PC_ddlPageSize"
                                                                            value={filterData.page_size}
                                                                            onChange={(e) => setFilterData({...filterData, page_size: e.target.value})}
                                                                            className="dropdown" style={{width: '75px' }}>
                                                                        <option value={15}>15</option>
                                                                        <option value={50}>50</option>
                                                                        <option value={100}>100</option>

                                                                    </select>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table className="SearchButtonsStyle">
                                                <tbody>
                                                <tr>
                                                    <td>

                                                    </td>
                                                    <td className="tdSrcSX">
                                                        <input type="button"
                                                               name="ac$w$PC$PC$btnCancella"
                                                               value="Cancel"
                                                               className="button" />
                                                    </td>
                                                    <td className="tdSrcDX">
                                                        <input
                                                            onClick={() => fetchTransactions(1)}
                                                            type="button"
                                                            name="ac$w$PC$PC$btnAvanti"
                                                            value="Continue"
                                                            id="ac_w_PC_PC_btnAvanti" className="button"
                                                        />
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <table id="tblSearch2" className="SearchContainerStyle RiepilogoMovimenti">
                                    <tbody>
                                    <tr className="SearchSectionStyle">
                                        <td className="SearchDescStyle">
                                            <div style={{position:'relative'}}>
                                                Credit
                                                <div className="Dati">
                                                    <span id="ac_w_PC_PC_lblDare">{formatNumber(totalCredit)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="SearchControlsStyle"></td>
                                    </tr>
                                    <tr className="SearchSectionStyle">
                                        <td className="SearchDescStyle">
                                            <div style={{position:'relative'}}>
                                                Debit
                                                <div className="Dati">
                                                    <span id="ac_w_PC_PC_lblAvere">{formatNumber(totalDebit)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="SearchControlsStyle"></td>
                                    </tr>
                                    <tr className="SearchSectionStyle">
                                        <td className="SearchDescStyle">
                                            <div style={{position:'relative'}}>
                                                Total Balance
                                                <div className="Dati">
                                                    <span id="ac_w_PC_PC_lblTotale">{formatNumber(parseFloat(totalCredit) - parseFloat(totalDebit))}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="SearchControlsStyle"></td>
                                    </tr>
                                    </tbody>
                                </table>
                                <br />
                                <div className="divDg">
                                    <div>
                                        {transactions.length > 0 &&
                                        <table className="dgStyle" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
                                               style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                            <tbody>
                                            <tr className="dgHdrStyle">
                                                <th scope="col">&nbsp;</th>
                                                <th align="center" scope="col">ID</th>
                                                <th align="center" scope="col">Date</th>
                                                <th align="center" scope="col">Transaction</th>
                                                <th align="center" scope="col">Betslip</th>
                                                <th className="dgHdrImporti" scope="col">Credit</th>
                                                <th className="dgHdrImporti" scope="col">Debit</th>
                                                <th align="center" scope="col">Subject</th>
                                                <th className="dgHdrImporti" scope="col">Balance</th>
                                            </tr>
                                            {!loading && transactions.map(transaction =>
                                            <tr className="dgItemStyle" key={transaction.reference_no}>
                                                <td align="center">
                                                    <a title="See detail"
                                                       href="#">
                                                        <img title="See detail" src="/img/Dettagli.gif"
                                                        style={{ borderWidth:'0px'}} />
                                                     </a>
                                                </td>
                                                <td align="center">{transaction.reference_no}</td>
                                                <td align="center">
                                                    <span id="ac_w_PC_PC_grid_ctl02_lblData">{formatDate(transaction.created_at, 'DD/MM/YYYY HH:mm:ss')}</span>
                                                </td>
                                                <td align="center">{transaction.subject}</td>
                                                <td align="center">
                                                    {(transaction.subject === 'Bet Deposit' || transaction.subject === 'Sport Win') &&
                                                    <a title="See coupon" href="#">{transaction.description}</a>}
                                                </td>
                                                <td align="right">{transaction.tranx_type === 'credit' ? formatNumber(transaction.amount) : ''}</td>
                                                <td align="right">{transaction.tranx_type === 'debit' ? formatNumber(transaction.amount) : ''}</td>
                                                <td align="center">{transaction.description}</td>
                                                <td className="dgHdrImporti" align="right">{(transaction.tranx_type === 'credit')? transaction.to_user_balance : transaction.from_user_balance}</td>
                                            </tr>)}
                                            <Pagination
                                                colspan={10}
                                                data={pagination}
                                                offset={10}
                                                changePage={fetchTransactions}
                                            />

                                            {loading && <tr className="dgItemStyle">
                                                <td colSpan="10">Loading...Please wait!</td>
                                            </tr>}

                                            </tbody>
                                        </table> }
                                        {transactions.length === 0 && !loading &&
                                        <table className="dgStyle" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
                                               style={{borderWidth:'0px', borderStyle:'None', width:'100%',borderCollapse: 'collapse'}}>
                                        <tbody>
                                            <tr className="dgEmptyStyle">
                                                <td colSpan="10" align="center">
                                                No record found
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                        }
                                    </div>
                                    <br />
                                    <br />
                                    <div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
