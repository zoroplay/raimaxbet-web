import React, {Fragment, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import * as _ from 'lodash';
import moment from "moment";
import {getSportMenu} from "../Services/apis";
import {LOADING} from "../Redux/types";

const listType = [
    {value: 'today', label: 'Today'},
    {value: 'tomorrow', label: 'Tomorrow'},
    {value: 'week', label: 'Week'},
    {value: 'all', label: 'All'},
];
export default function TournamentSelector({history}) {
    const {sports: data} = useSelector((state) => state.sportsData);
    const [sports, setSports] = useState([]);
    const [selections, setSelections] = useState([]);
    const [viewType, setViewType] = useState('all');
    const dispatch = useDispatch();

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

    const getSports = (period) => {
        setViewType(period);

        dispatch({type: LOADING});

        getSportMenu(period).then(res => {
            dispatch({type: LOADING});
            setSports(res.menu);
        }).catch(err => {
            dispatch({type: LOADING});
        })
    }

    useEffect(() => {
        if (data) {
            setSports(data);
        }
    }, [data]);

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
            <div className="iSBox ctrl_ViewModeSelector">
                <div className="viewModeSelector">
                    <div className="typeVisbutton">
                        <ul className="labelSteps">
                            {listType.map((step, index) =>
                                <li className={`s${index} ${step.value === viewType ? 'sel' : ''}`} key={`step-${index}`}
                                    onClick={() => getSports(step.value)}
                                >
                                    <div >{step.label}</div>
                                </li>
                            )}
                        </ul>
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
