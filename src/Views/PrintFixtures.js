import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as _ from 'lodash';
import moment from "moment";
import {getSportMenu} from "../Services/apis";
import {LOADING} from "../Redux/types";
import '../Assets/scss/_print-fixtures.scss';
import DatePicker from "react-datepicker";

const listType = [
    {value: 'today', label: 'Today'},
    {value: 'tomorrow', label: 'Tomorrow'},
    {value: 'week', label: 'Week'},
    {value: 'all', label: 'All'},
];
export default function TournamentSelector({history}) {
    const [sports, setSports] = useState([]);
    const [selections, setSelections] = useState([]);
    const dispatch = useDispatch();
    const [filterData, setFilterData] = useState({
        from: moment().toDate(),
        to: moment().toDate(),
        period: 'all'
    });

    useEffect(() => {
        const dayINeed = 0; // for Thursday
        const today = moment().isoWeekday();

        if (today > dayINeed) {
            setFilterData({...filterData, to: moment().add(1, 'weeks').isoWeekday(dayINeed).toDate()});
        }
    }, []);

    const checkAll = () => {
        const container = document.getElementById('tournaments');
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const newSelections = [...selections];
        _.each(checkboxes, (checkbox) => {
            const id = checkbox.value;
            if(checkbox.checked){
                let index = newSelections.findIndex(item => item === id);
                newSelections.splice(index, 1);
                setSelections(newSelections);
                checkbox.checked = false;
            }else {
                newSelections.push(id);
                setSelections(newSelections);
                checkbox.checked = true;
            }
        })
    }

    const getSports = () => {
        dispatch({type: LOADING});

        getSportMenu(filterData.period, moment(filterData.from).format('YYYY-MM-DD'), moment(filterData.to).format('YYYY-MM-DD')).then(res => {
            dispatch({type: LOADING});
            setSports(res.menu);
        }).catch(err => {
            dispatch({type: LOADING});
        })
    }

    const checkChild = (cid) => {
        const container = document.getElementById(cid);
        const checkboxes = container.querySelectorAll('input[type="checkbox"]');
        const newSelections = [...selections];
        _.each(checkboxes, (checkbox) => {
            const id = checkbox.value;
            if(checkbox.checked){
                let index = newSelections.findIndex(item => item === id);
                newSelections.splice(index, 1);
                setSelections(newSelections);
                checkbox.checked = false;
            }else {
                newSelections.push(id);
                setSelections(newSelections);
                checkbox.checked = true;
            }
        });
    }

    const handleSingleClick = e => {
        const newSelections = [...selections];
        const id = e.target.value;
        // console.log(e.target.checked);
        if(e.target.checked){
            newSelections.push(id);
            setSelections(newSelections);
        }else {
            let index = newSelections.findIndex(item => item === id);
            newSelections.splice(index, 1);
            setSelections(newSelections);
        }
    }

    const print = () => {
        if (selections.length < 1) {
            alert('You have not made any selections. Please select a maximum of 40 events.')
            return;
        }
        if (selections.length > 40) {
            alert('You exceeded the 40 events limit. Please, select less events.')
            return;
        }
        window.open(`${process.env.REACT_APP_BASEURL}/print-fixtures?&leagues=${selections.join()}`, 'mywin',
                ''); return false;

    }

    return (
        <Fragment>
            <div className="header-container" style={{background: '#145a2b'}}>
                <div className="row choose-sports">
                    <div className="col-sm-12">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <div id="dateRange-checkBox"  className="row">
                                {listType.map((row, i) =>
                                    <div className="col-sm-3" key={`date-range-${i}`}>
                                        <div className="date-range">
                                            <input
                                                type="checkbox"
                                                id={`checkboxd${i}`}
                                                value={row.value}
                                                checked={filterData.period === row.value}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFilterData({...filterData, period: row.value})
                                                    } else {
                                                        setFilterData({...filterData, period: 'custom'})
                                                    }
                                                }}
                                            />
                                            <label htmlFor={`checkboxd${i}`}>{row.label}</label>
                                        </div>
                                    </div>
                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12" style={{paddingLeft: '0px'}}>
                        <div className="col-sm-3">
                            <div className="costumRange-checbox">
                                <input
                                    type="checkbox"
                                    id="checkboxCustom"
                                    value="custom" checked={filterData.period === 'custom'}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setFilterData({...filterData, period: 'custom'})
                                        } else {
                                            setFilterData({...filterData, period: 'all'})
                                        }
                                    }}
                                />
                                <label htmlFor="checkboxCustom">Custom Range</label>
                            </div>
                        </div>
                        <div className="col-sm-7">
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={filterData.from}
                                className="textbox"
                                style={{width:'75px' }}
                                disabled={filterData.period !== 'custom'}
                                onChange={date => setFilterData({...filterData, from: date})} />
                            <DatePicker
                                dateFormat="dd/MM/yyyy"
                                selected={filterData.to}
                                className="textbox"
                                disabled={filterData.period !== 'custom'}
                                style={{width:'75px' }}
                                onChange={date => setFilterData({...filterData, to: date})} />
                        </div>
                        <div className="col-sm-2">
                            <div className="form-group">
                                <button type="button" onClick={getSports} className="palimpsest-btn-button btn-block">Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {sports && sports.map(sport =>
                <div className="sports-book-page" key={sport.id}>
                    <div className="title">
                        <div className="title-icon">
                            <img src="/img/arrow-down.png" alt=""/>
                        </div>
                        <span>{sport?.name}</span>
                        <div className="select-events">
                            <div className="check" onClick={checkAll}>
                                <input id="sf1" className="sportFlag" type="checkbox"/>
                                <span className="checkmark" />
                            </div>
                            Select All
                        </div>
                    </div>
                    <table className="championship-table" id="tournaments">
                        <tbody>
                        {sport.categories.map((category, index) =>
                            <tr key={`sport-category-${index}`}>
                                <td>
                                    <div className="single-tournament">
                                        <div className="check" onClick={(e) => checkChild(`c-${category.sport_category_id}`)}>
                                            <input
                                                id={`cat-${category.sport_category_id}`}
                                                className="sportFlag"
                                                type="checkbox"
                                            />
                                            <span className="checkmark" />
                                        </div>
                                        <label htmlFor={`cat-${category.sport_category_id}`} className="tournament-name">{category.name}</label>
                                    </div>
                                </td>
                                <td>
                                    <div className="tournaments-group" id={`c-${category.sport_category_id}`}>
                                        {category.tournaments.map((tournament, t) =>
                                            <div className="single-tournament" key={`sport-t-${t}`}>
                                                <div className="check" >
                                                    <input
                                                        id={`t-${tournament.sport_tournament_id}`}
                                                        className="sportFlag"
                                                        type="checkbox"
                                                        onChange={(e) => handleSingleClick(e)}
                                                        value={tournament.sport_tournament_id}
                                                    />
                                                    <span className="checkmark" />
                                                </div>
                                                <label htmlFor={`t-${tournament.sport_tournament_id}`} className="tournament-name">{tournament.name}</label>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        )}
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colSpan={2}>
                                <div className="groupBtn">
                                    <a className="button" onClick={() => print()}>Print</a>
                                    <a className="button" onClick="Go(0)" title="">Display</a>
                                </div>
                            </td>
                        </tr>
                        </tfoot>
                    </table>

                </div>
            )}
        </Fragment>
    )
}
