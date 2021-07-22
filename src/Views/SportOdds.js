import React, {useEffect} from "react";
import Tablet from "./Components/Tablet";
import {useDispatch, useSelector} from "react-redux";
import {setTournaments} from "../Redux/actions";

export default function SportOdds({location, history}) {
    const urlParam = new URLSearchParams(location.search);
    const tid = urlParam.get('tid');
    const sid = urlParam.get('sid');
    const dispatch = useDispatch();

    const {tournaments } = useSelector(state => state.sportsData);

    useEffect(() => {
        if(tid) {
            const tournament = tournaments.find(tournament => tournament.sport_tournament_id === parseInt(tid));

            if (!tournament) { // if new tournament, add to store
                dispatch(setTournaments({tid, sid}));
            }
        }
    }, [dispatch, sid, tid]);

    return (
        <>
            <div id="MainContent" className="sport">
                {tournaments.length === 0 ? (
                    <div className="iSBox ctrl_oddsView" >
                        <div className="oddsViewPanel">
                            <div className="empty">
                                <span>No Events Selected</span>
                            </div>
                        </div>
                    </div>
                ):(
                    tournaments.map((tournament, i) => <Tablet
                        key={`tournament-${tournament.sport_tournament_id}`}
                        index={i}
                        history={history}
                        tournament={tournament}/>)
                )}
            </div>
        </>
    )
}
