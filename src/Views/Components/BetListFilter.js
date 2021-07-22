import React from "react";
import DatePicker from "react-datepicker";

export default function BetListFilter({filterData, handleChange, fetchResult, ticketsLength}) {
    return (
        <div className="RiquadroSrc">
            <div className="Cnt">
                <div>
                    <div id="ac_w_PC_PC_BetList_panForm">
                        <table id="tblSearch" className="SearchContainerStyle">
                            <tbody>
                            <tr className="SearchSectionStyle">
                                <td className="SearchDescStyle">
                                    Date
                                    <select
                                        name="ac$w$PC$PC$BetList$ddlFiltoData"
                                        id="ac_w_PC_PC_BetList_ddlFiltoData"
                                        className="dropdownFiltoData"
                                        style={{width:'100px'}}>
                                        <option selected="selected" value="1">Bet</option>
                                        <option value="2">Outcome</option>
                                    </select>
                                </td>
                                <td className="SearchControlsStyle">
                                    <table width="100%">
                                        <tbody>
                                        <tr>
                                            <td width="20%" className="SearchControlDesc">
                                                From
                                            </td>
                                            <td width="30%">
                                                <table cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <DatePicker
                                                                dateFormat="dd/MM/yyyy"
                                                                selected={filterData.from}
                                                                className="textbox"
                                                                style={{width:'75px' }}
                                                                onChange={date => handleChange('from', date)} />
                                                        </td>
                                                        <td width="25px" align="center">
                                                            <img
                                                                id="ac_w_PC_PC_BetList_cpopDal_CalendarBase_imgCalendar"
                                                                src="/img/Calendar.gif"
                                                                alt="Display Calendar"
                                                                style={{ borderWidth: '0px', cursor: 'pointer' }} />
                                                        </td>
                                                        <td>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>


                                            </td>
                                            <td width="20%" className="SearchControlDesc">
                                                To
                                            </td>
                                            <td width="30%">
                                                <table cellPadding="0" cellSpacing="0">
                                                    <tbody>
                                                    <tr>
                                                        <td>
                                                            <DatePicker
                                                                dateFormat="dd/MM/yyyy"
                                                                selected={filterData.to}
                                                                className="textbox"
                                                                style={{width:'75px' }}
                                                                onChange={date => handleChange('to', date)} />
                                                        </td>
                                                        <td width="25px" align="center">
                                                            <img
                                                                id="ac_w_PC_PC_BetList_cpopAl_CalendarBase_imgCalendar"
                                                                src="/img/Calendar.gif"
                                                                alt="Display Calendar"
                                                                style={{ borderWidth: '0px', cursor: 'pointer' }} />
                                                        </td>
                                                        <td>

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
                                    Betslip
                                </td>
                                <td className="SearchControlsStyle">
                                    <table className="SearchControlsContainerStyle">
                                        <tbody>
                                        <tr>
                                            <td width="20%" className="SearchControlDesc">
                                                ID
                                            </td>
                                            <td width="20%">
                                                <input
                                                    name="ac$w$PC$PC$BetList$txtCodiceCoupon"
                                                    type="text"
                                                    value={filterData.betslip_id}
                                                    onChange={(e) => handleChange('betslip_id', e.target.value)}
                                                    id="ac_w_PC_PC_BetList_txtCodiceCoupon"
                                                    className="textbox" style={{width: '75px' }} />
                                            </td>
                                            <td width="20%" className="SearchControlDesc">
                                                Outcome
                                            </td>
                                            <td width="20%">
                                                <select
                                                    name="ac$w$PC$PC$BetList$ddlEsito"
                                                    id="ac_w_PC_PC_BetList_ddlEsito"
                                                    className="dropdown"
                                                    value={filterData.status}
                                                    onChange={(e) => handleChange('status', e.target.value)}
                                                    style={{width: '100px' }}>
                                                    <option value="all"></option>
                                                    <option value="0">Running</option>
                                                    <option value="1">Won</option>
                                                    <option value="2">Lost</option>
                                                    <option value="4">Cancelled</option>
                                                    <option value="3">Void</option>
                                                </select>
                                            </td>
                                            <td width="20%"></td>
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
                                            <td width="20%" className="SearchControlDesc">&nbsp;</td>
                                            <td width="80%" colSpan="3">
                                                <select
                                                    name="ac$w$PC$PC$BetList$ddlPageSize"
                                                    id="ac_w_PC_PC_BetList_ddlPageSize"
                                                    className="dropdown"
                                                    value={filterData.page_size}
                                                    onChange={(e) => handleChange( 'page_size', e.target.value)}
                                                    style={{width: '75px' }}>
                                                    <option selected="selected" value="15">15</option>
                                                    <option value="50">50</option>
                                                    <option value="100">100</option>
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
                                    <input type="submit" name="ac$w$PC$PC$BetList$btnCancella"
                                           value="Cancel"
                                           id="ac_w_PC_PC_BetList_btnCancella"
                                           className="button" />
                                </td>
                                <td className="tdSrcDX">
                                    <input
                                        type="submit" name="ac$w$PC$PC$BetList$btnAvanti"
                                        value="Continue"
                                        onClick={() => fetchResult(1)}
                                        id="ac_w_PC_PC_BetList_btnAvanti" className="button" />
                                </td>
                            </tr>
                            </tbody>
                        </table>

                    </div>
                    <table id="tblSearch2" className="SearchContainerStyle Secondary">
                        <tbody>
                        <tr className="SearchSectionStyle">
                            <td className="SearchDescStyle">
                                <div style={{position: 'relative' }}>
                                    No. Bets
                                    <div className="Dati">
                                        <span id="ac_w_PC_PC_BetList_lblNumSco">{ticketsLength}</span></div>
                                </div>
                            </td>
                            <td className="SearchControlsStyle"></td>
                        </tr>
                        </tbody>
                    </table>
                    <table className="SearchContainerStyle Secondary">
                        <tbody>
                        <tr className="SearchSectionStyle">
                            <td className="SearchDescStyle">
                                Key
                            </td>
                            <td className="SearchControlsStyle">
                                <table className="SearchControlsContainerStyle">
                                    <tbody>
                                    <tr>
                                        <td className="SearchControlDesc"
                                            style={{ textAlign: 'left' }}>
                                            Outcome:
                                        </td>
                                        <td>
                                            <img id="ac_w_PC_PC_BetList_imgLegEsito1"
                                                 src="/img/ScommesseEsito_1.gif"
                                                 style={{borderWidth: '0px' }} />                                                                </td>
                                        <td>
                                            Winning
                                        </td>
                                        <td>
                                            <img id="ac_w_PC_PC_BetList_imgLegEsito2"
                                                 src="/img/ScommesseEsito_2.gif"
                                                 style={{borderWidth: '0px' }} />
                                        </td>
                                        <td>
                                            Lost
                                        </td>
                                        <td>
                                            <img id="ac_w_PC_PC_BetList_imgLegEsito3"
                                                 src="/img/ScommesseEsito_3.gif"
                                                 style={{borderWidth: '0px' }} />                                                                </td>
                                        <td>
                                            Running
                                        </td>
                                        <td>
                                            <img id="ac_w_PC_PC_BetList_imgLegEsito4"
                                                 src="/img/ScommesseEsito_4.gif"
                                                 style={{borderWidth: '0px' }} />                                                                </td>
                                        <td>
                                            Cancelled
                                        </td>
                                        <td>
                                            <img id="ac_w_PC_PC_BetList_imgLegEsito5"
                                                 src="/img/ScommesseEsito_5.gif"
                                                 style={{borderWidth: '0px' }} />                                                                </td>
                                        <td>
                                            Being processed
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
