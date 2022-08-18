import React, {useEffect, useState} from 'react';
import {unSlugify} from "../Utils/helpers";
import {useSelector} from "react-redux";
import * as _ from 'lodash';


export default function TournamentSelector({history}) {
    const {sport} = useSelector((state) => state.sportsData);
    const [selections, setSelections] = useState([]);


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
        if(e.target.checked){
            newSelections.push(id);
            setSelections(newSelections);
        }else {
            let index = newSelections.findIndex(item => item === id);
            newSelections.splice(index, 1);
            setSelections(newSelections);
        }
    }

    useEffect(() => {
        if (!sport)
            history.push('/');

    }, [sport]);

    return (
        <div className="sports-book-page">
            <div className="filters-holder">
                <span>
                    Filter
                    <div className="filters-icon">
                        <img src="/img/star-icon.png" alt="" />
                    </div>
                </span>
                <div className="search-form">
                    <input type="submit" value=""/>
                    <input type="text" placeholder="Filter Tournament"/>
                </div>
                <div className="buttons-holder">
                    <div className="single-button">
                        <img src="/img/star-icon.png" alt="" />
                        Add To Favourites
                    </div>
                    <div className="single-button" onClick={() => {
                        console.log(selections)}}>
                        <img src="/img/proceed-button.png" alt="" />
                        Proceed
                    </div>
                </div>
            </div>
            <div className="title">
                <div className="title-icon">
                    <img src="/img/arrow-down.png" alt=""/>
                </div>
                <span>{unSlugify(sport?.name)}</span>
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
                {sport && sport.categories.map((category, index) =>
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
            </table>
        </div>
    )
}
