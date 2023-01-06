import {
    SET_SPORT,
    SET_FIXTURE,
    SET_FIXTURES,
    SET_SPORTS,
    SET_CATEGORIES,
    SET_TOURNAMENTS,
    SET_ACTIVE_PERIOD,
    LOADING
} from '../types'
import {getFixtures} from "../../Services/apis";
import history from "../../Services/history";

export const setSports = payload => {
    return {
        type: SET_SPORTS,
        payload,
    };
};

export const setSport = payload => {
    return {
        type: SET_SPORT,
        payload,
    };
};

export const setActivePeriod = payload => {
    return {
        type: SET_ACTIVE_PERIOD,
        payload,
    };
};

export const setCategories = payload => {
    return {
        type: SET_CATEGORIES,
        payload,
    };
};

export const setTournaments = payload => {
    return (dispatch, getState) => {
        // grab current state
        const state = getState();
        // create new tournaments state object
        const tournaments = [...state.sportsData.tournaments];
        // get payloads
        const {tid, sid, period} = payload;
        // check if tournament exists

        dispatch({type: LOADING});
        getFixtures(tid, sid, period).then(res => {
            dispatch({type: LOADING});
            if(res){
                tournaments.unshift(res);
                //update state
                return dispatch({
                    type: SET_TOURNAMENTS,
                    payload: tournaments
                });
            }
        }).catch(err => {
            dispatch({type: LOADING});
        });

    }
};

export const removeTournament = payload => {
    return (dispatch, getState) => {
        // grab current state
        const state = getState();
        // create new tournaments state object
        const tournaments = state.sportsData.tournaments;
        tournaments.splice(payload, 1);

        if (tournaments.length === 0) {
            history.push('/');
            return dispatch({
                type: SET_TOURNAMENTS,
                payload: []
            });
        } else {
            return dispatch({
                type: SET_TOURNAMENTS,
                payload: tournaments
            });
        }
    }
}

export const setFixtures = payload => {
    return {
        type: SET_FIXTURES,
        payload,
    };
};

export const setFixture = payload => {
    return {
        type: SET_FIXTURE,
        payload,
    };
};
