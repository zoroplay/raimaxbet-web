import {
    CANCEL_BET,
    SET_BET_PLACED,
    SET_COUPON_DATA,
    RESET_COUPON_AMOUNT,
    UPDATE_USER_BALANCE,
    LOADING,
    SET_TODAYS_BET,
    SHOW_LOGIN_MODAL,
    SET_BETSLIP_DATA,
    SET_WEEKLY_COUPON_DATA,
    SET_POOL_COUPON_DATA
} from "../types";
import {
    calculateBonus, calculateTotalOdds,
    calculateWinnings,
    checkBetType,
    checkIfHasLive,
    groupTournament
} from "../../Utils/couponHelpers";
import {Http} from "../../Utils";
import * as _ from 'lodash';
import {toast} from "react-toastify";
import {getSplitProps, loadCoupon} from "../../Services/apis";
import {calculateExclusionPeriod, checkNoOfDraws} from "../../Utils/helpers";
import CouponCalculation from "../../Utils/CouponCalculation";

const couponCalculation = new CouponCalculation();


export function addToCoupon(fixture, market_id, market_name, odds, odd_id, oddname, ele_id, type='pre') {
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();
        if (odds === '-' || odds === null)
            return false;

        dispatch({type: SET_BET_PLACED, payload: ''});

        const data = {
            provider_id: fixture.provider_id,
            event_id: fixture.event_id,
            event_name: fixture.event_name,
            market_id: market_id,
            market_name: market_name,
            oddname,
            odd_id: odd_id,
            odds: odds,
            element_id: ele_id,
            start_date: fixture.schedule,
            tournament: fixture.sport_tournament_name,
            category: fixture.sport_category_name,
            sport: fixture.sport_name,
            type,
            fixed: false
        };
        if (type === 'live') {
            data.in_play_time = fixture.live_data?.match_time;
            data.score = fixture.score;
            // data.ht_score = fixture.setscores;
        }

        let couponData = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];

        if(!couponData.selections.length){
            couponData = {
                selections: [],
                combos:[],
                totalOdds: 1,
                maxBonus: 0,
                minBonus: 0,
                maxWin: 0,
                minWin: 0,
                stake: 0,
                totalStake: 0,
                minOdds: 1,
                maxOdds: 1,
                event_type: type,
                channel: 'website',
                wthTax: 0,
                exciseDuty: 0,
            };
            couponData.bet_type = 'Single';
            couponData.selections.push(data);
            couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
            //calculate and get pot winnings with bonus
            const winnings = calculateWinnings(couponData, globalVars, bonusList);
            couponData.maxWin = winnings.maxWin;
            couponData.maxBonus = winnings.maxBonus;
            couponData.grossWin = winnings.grossWin;
            couponData.wthTax = winnings.wthTax;
            couponData.tournaments = groupTournament(couponData.selections);
            // couponData.fixtures = groupSelections(couponData.selections);
            // check if event is live
            if (type === 'live')
                couponData.hasLive = true;
            //update bets state in redux
            return dispatch({type: SET_COUPON_DATA, payload: couponData});

        }else{
            for (let i = 0; i < couponData.selections.length; i++) {
                //check if it's same event selected and remove it
                if (couponData.selections[i].element_id === data.element_id) {
                    //remove item
                    couponData.selections.splice(i, 1);
                    //check if couponData still has selections
                    if (couponData.selections.length > 0) {
                        const prevBetType = couponData.bet_type;
                        //group selections by match
                        couponData.tournaments = groupTournament(couponData.selections);
                         // check if has live
                         couponData.hasLive  = checkIfHasLive(couponData.selections);
                        //check bet type
                        couponData.bet_type = checkBetType(couponData);

                        if (couponData.bet_type === 'Split') {
                            couponData = await getSplitProps(couponData);
                            //calculate winnings
                            const minWinnings = parseFloat(couponData.minOdds) * parseFloat(couponData.minStake);
                            const maxWinnings = parseFloat(couponData.maxOdds) * parseFloat(couponData.minStake);
                            //calculate bonus
                            couponData.minBonus = calculateBonus(minWinnings, couponData, globalVars, bonusList);
                            couponData.maxBonus = calculateBonus(maxWinnings, couponData, globalVars, bonusList);
                            couponData.minGrossWin = parseFloat(couponData.minBonus) + minWinnings;
                            couponData.minWTH = (couponData.minGrossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                            couponData.minWin = couponData.minGrossWin - couponData.minWTH;
                            couponData.grossWin = parseFloat(couponData.maxBonus) + maxWinnings;
                            couponData.wthTax = (couponData.grossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                            couponData.maxWin = couponData.grossWin - couponData.wthTax;
                        } else {

                            // recalculate totalOdds if prev bet type was Split
                            if (prevBetType === 'Split') {
                                couponData.totalOdds = calculateTotalOdds(couponData.selections);
                            } else { // else remove selection from total odds
                                couponData.totalOdds = (parseFloat(couponData.totalOdds) / parseFloat(data.odds)).toFixed(2);
                            }
                            const calculatedGroup   = couponCalculation.calcCombinations(couponData);
                            couponData.combos       = calculatedGroup.Groups;
                            // couponData.combos = await getCombos(couponData);
                            //calculate and get pot winnings with bonus
                            if (couponData.bet_type === 'Combo') {
                                dispatch({type: SET_COUPON_DATA, payload: couponData});
                                if (couponData.Groupings && couponData.Groupings.length) {
                                    setTimeout(() => {
                                        return dispatch(updateComboWinningsFromTotal());
                                    }, 500);
                                }
                            } else {
                                const winnings = calculateWinnings(couponData, globalVars, bonusList);
                                couponData.maxWin = winnings.maxWin;
                                couponData.maxBonus = winnings.maxBonus;
                                couponData.wthTax = winnings.wthTax;
                                couponData.grossWin = winnings.grossWin;

                                return dispatch({type: SET_COUPON_DATA, payload: couponData});
                            }
                        }
                    } else {
                        return dispatch({type: CANCEL_BET})
                    }
                }
            }
            for (let i = 0; i < couponData.selections.length; i++) {
                if(couponData.selections[i].provider_id === data.provider_id){
                    //add selection to selections list
                    couponData.selections.push(data);
                    //group selections by match
                    couponData.tournaments = groupTournament(couponData.selections);
                    // couponData.fixtures = groupSelections(couponData.selections);
                    //bet type
                    couponData.bet_type = 'Split';
                    // remove item
                    // couponData.selections.splice(i, 1);
                    couponData = await getSplitProps(couponData);
                    //calculate winnings
                    const minWinnings = parseFloat(couponData.minOdds) * parseFloat(couponData.minStake);
                    const maxWinnings = parseFloat(couponData.maxOdds) * parseFloat(couponData.minStake);
                    //calculate bonus
                    couponData.minBonus = calculateBonus(minWinnings, couponData, globalVars, bonusList);
                    couponData.maxBonus = calculateBonus(maxWinnings, couponData, globalVars, bonusList);
                    couponData.minGrossWin = parseFloat(couponData.minBonus) + minWinnings;
                    couponData.minWTH = (couponData.minGrossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    couponData.minWin = couponData.minGrossWin - couponData.minWTH;
                    couponData.grossWin = parseFloat(couponData.maxBonus) + maxWinnings;
                    couponData.wthTax = (couponData.grossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                    couponData.maxWin = couponData.grossWin - couponData.wthTax;

                    return dispatch({type: SET_COUPON_DATA, payload: couponData});
                }
            }

            couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
            //add selection to selections list
            couponData.selections.push(data);

            //group selections by match
            couponData.tournaments = groupTournament(couponData.selections);
            // couponData.fixtures = groupSelections(couponData.selections);
            //check bet type
            couponData.bet_type = checkBetType(couponData);
            // check if event is live

            if (type === 'live')
                couponData.hasLive = true;

            if (couponData.bet_type === 'Split') {
                couponData = await getSplitProps(couponData);
                couponData.minStake = parseFloat(couponData.stake) / couponData.noOfCombos;

                //calculate winnings
                const minWinnings = parseFloat(couponData.minOdds) * parseFloat(couponData.minStake);
                const maxWinnings = parseFloat(couponData.maxOdds) * parseFloat(couponData.minStake);
                //calculate bonus
                couponData.minBonus = calculateBonus(minWinnings, couponData, globalVars, bonusList);
                couponData.maxBonus = calculateBonus(maxWinnings, couponData, globalVars, bonusList);
                couponData.minGrossWin = parseFloat(couponData.minBonus) + minWinnings;
                couponData.minWTH = (couponData.minGrossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                couponData.minWin = couponData.minGrossWin - couponData.minWTH;
                couponData.grossWin = parseFloat(couponData.maxBonus) + maxWinnings;
                const wthTax = (couponData.grossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
                couponData.wthTax = wthTax < 1 ? 0 : wthTax;
                couponData.maxWin = couponData.grossWin - couponData.wthTax;

                return dispatch({type: SET_COUPON_DATA, payload: couponData});
            } else {
                const calculatedGroup   = couponCalculation.calcCombinations(couponData);
                couponData.combos       = calculatedGroup.Groups;
                // couponData.combos = await getCombos(couponData);
                //calculate and get pot winnings with bonus
                if (couponData.bet_type === 'Combo') {
                    dispatch({type: SET_COUPON_DATA, payload: couponData});
                    if (couponData.Groupings && couponData.Groupings.length) {
                        setTimeout(() => {
                            return dispatch(updateComboWinningsFromTotal());
                        }, 500);
                    }
                } else {
                    const winnings = calculateWinnings(couponData, globalVars, bonusList);
                    couponData.maxWin = winnings.maxWin;
                    couponData.maxBonus = winnings.maxBonus;
                    couponData.wthTax = winnings.wthTax;
                    couponData.grossWin = winnings.grossWin;

                    return dispatch({type: SET_COUPON_DATA, payload: couponData});
                }
            }
        }
    }
}

export function addToPoolCoupon(sn, fixture, gameWeek) {
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();
        let couponData = {...state.couponData.poolCoupon};
        // const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        // const bonusList = [...state.sportsBook.SportsbookBonusList];
        // const game = {
        //     name: fixture.event_name,
        //     id: sn,
        // }
        if(!couponData.selections.length) {
            couponData.selections.push(sn);
            // couponData.fixtures.push(game);
            couponData.gameWeek = gameWeek;
            return dispatch({type: SET_POOL_COUPON_DATA, payload: couponData});
        } else {
            for (let i = 0; i < couponData.selections.length; i++) {
                //check if it's same event selected and remove it
                if (couponData.selections[i] === sn) {
                    const index = couponData.selections.findIndex(item => item === sn);
                    //remove item
                    couponData.selections.splice(index, 1);
                    return dispatch({type: SET_POOL_COUPON_DATA, payload: couponData});
                }
            }
            couponData.selections.push(sn);
            // couponData.fixtures.push(game);
            return dispatch({type: SET_POOL_COUPON_DATA, payload: couponData});
        }
    }
}

export function addToWeeklyCoupon(fixture, gameWeek, ele_id) {
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();
        let couponData = {...state.couponData.weeklyCoupon};

        const data = {
            event_id: fixture.id,
            element_id: ele_id,
            event_name: fixture.home_team + ' - ' + fixture.away_team,
            odds: fixture.odds,
            start_date: fixture.event_date + ' ' + fixture.event_time,
        };

        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};

        if(!couponData.selections.length){
            couponData.selections = [];
            couponData.totalOdds = 1;
            couponData.maxWin = 0;

            couponData.selections.push(data);
            couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
            //calculate and get pot winnings with bonus
            if (couponData.stake > 0) {
                const winnings = calculateWinnings(couponData, globalVars, []);
                couponData.maxWin = winnings.maxWin;
            }
            //update bets state in redux
            return dispatch({type: SET_WEEKLY_COUPON_DATA, payload: couponData});

        }else{
            for (let i = 0; i < couponData.selections.length; i++) {
                //check if it's same event selected and remove it
                if (couponData.selections[i].event_id === data.event_id) {
                    //remove item
                    const index = couponData.selections.findIndex(item => item.event_id === data.event_id);
                    //remove item
                    couponData.selections.splice(index, 1);
                    couponData.totalOdds = (parseFloat(couponData.totalOdds) / parseFloat(data.odds)).toFixed(2);

                    if (couponData.selections.length > 0) {
                        if (couponData.stake > 0) {
                            const winnings = calculateWinnings(couponData, globalVars, []);
                            couponData.maxWin = winnings.maxWin;
                        }
                        return dispatch({type: SET_WEEKLY_COUPON_DATA, payload: couponData});
                    } else {
                        return dispatch({type: CANCEL_BET})
                    }
                }
            }

            couponData.totalOdds = (parseFloat(couponData.totalOdds) * parseFloat(data.odds)).toFixed(2);
            //add selection to selections list
            couponData.selections.push(data);
            if (couponData.stake > 0) {
                const winnings = calculateWinnings(couponData, globalVars, []);
                couponData.maxWin = winnings.maxWin;
            }
            return dispatch({type: SET_WEEKLY_COUPON_DATA, payload: couponData});
        }
    }
}

export function fastAdd(amount){
    return (dispatch, getState) => {
        // grab current state
        const state = getState();

        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};

        const bonusList = [...state.sportsBook.SportsbookBonusList];

        let coupondata = {...state.couponData.coupon};

        if (amount === 0) {
            return dispatch({type: RESET_COUPON_AMOUNT})
        }

        if(coupondata.totalStake === '') {
            coupondata.totalStake = 0;
        }
        coupondata.totalStake = coupondata.totalStake + amount;
        coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        if (coupondata.bet_type !== 'Combo') {
            //calculate Winnings
            let winnings = calculateWinnings(coupondata, globalVars, bonusList);
            coupondata.maxWin       = winnings.maxWin;
            coupondata.maxBonus     = winnings.maxBonus;
            coupondata.grossWin     = winnings.grossWin;
            coupondata.wthTax       = winnings.wthTax;
        } else {
            if (coupondata.Groupings && coupondata.Groupings.length) {

                return dispatch(updateComboWinningsFromTotal(coupondata.stake));
            }
        }
        //set coupon data in redux
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});

    }
};

export function updateWinnings(stake){
    return (dispatch, getState) => {
        // const stake = e.target.value;
        // grab current state
        const state = getState();
        const coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];
        coupondata.totalStake = stake;

        if (stake !== '') {
            coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            //calculate Winnings
            let winnings = calculateWinnings(coupondata, globalVars, bonusList);
            coupondata.maxWin = winnings.maxWin;
            coupondata.maxBonus = winnings.maxBonus;
            coupondata.wthTax = winnings.wthTax;
            coupondata.grossWin = winnings.grossWin;
        }
        //set coupon data in redux
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});
    }
};

export function updateCouponWinnings(stake){
    return (dispatch, getState) => {
        // const stake = e.target.value;
        // grab current state
        const state = getState();
        const coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        coupondata.stake = stake;

        if (stake !== '' && coupondata.selections.length) {
            // coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
            // coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            //calculate Winnings
            let winnings = calculateWinnings(coupondata, globalVars, []);
            coupondata.maxWin = winnings.maxWin;
        }
        //set coupon data in redux
        return dispatch({type: SET_WEEKLY_COUPON_DATA, payload: coupondata});
    }
};

export function updateComboWinningsFromTotal (stake) {
    return (dispatch, getState) => {
        const state = getState();

        let noOfCombos = 0
        let coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];

        coupondata.totalStake = stake ? stake : coupondata.totalStake;
        const Groupings = [];
        coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
        coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

        if(coupondata.stake !== '' && coupondata.stake !== 0) {
            for (let x = 0; x < coupondata.combos.length; x++) {

                const checkBox = document.getElementById('comb_'+x);
                if(checkBox.checked){
                    coupondata.combos[x].checked = true;
                    // document.getElementById('combo-'+x).classList.add('sel');
                    noOfCombos += coupondata.combos[x].Combinations
                }
            }
            let minStake = parseFloat(coupondata.stake) / noOfCombos;
            // let max = 0
            // let min_t = 0;
            // let tmp_min = 10000000;
            let comboLength = 0;

            for (let x = 0; x < coupondata.combos.length; x++) {

                const checkBox = document.getElementById('comb_'+x);
                if(checkBox.checked){
                    coupondata.combos[x].checked = true;
                    coupondata.combos[x].Stake = minStake;
                    comboLength += coupondata.combos[x].Grouping;
                    Groupings.push(coupondata.combos[x]);
                }else{
                    coupondata.combos[x].Stake =  '';
                    coupondata.combos[x].checked = false;
                    coupondata.combos[x].minWin = 0
                    coupondata.combos[x].maxWin = 0
                }

            }
            coupondata.comboSelection   = comboLength;
            coupondata.noOfCombos       = noOfCombos;
            coupondata.Groupings        = Groupings;
            coupondata.minStake         = parseFloat(coupondata.stake) / noOfCombos;

            if (coupondata.Groupings && coupondata.Groupings.length) {
                const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
                coupondata = couponCalculation.updateFromCalculatedCoupon(coupondata, calculatedCoupon, globalVars, bonusList);
                // update combos with max win
                coupondata.combos.forEach(combo => {
                    for (let i = 0; i < coupondata.Groupings.length; i++) {
                        if (combo.Grouping === coupondata.Groupings[i].Grouping) {
                            combo.minWIn = coupondata.Groupings[i].minWin;
                            combo.maxWin = coupondata.Groupings[i].maxWin;
                            combo.Stake  = coupondata.Groupings[i].Stake;
                        }
                    }
                })
            }
            return dispatch({type: SET_COUPON_DATA, payload: coupondata});
        } else {
            for (let x = 0; x < coupondata.combos.length; x++) {
                const checkBox = document.getElementById('comb_'+x);
                if(checkBox.checked){
                    coupondata.combos[x].checked = false;
                    // document.getElementById('combo-'+x).classList.add('sel');
                    noOfCombos += coupondata.combos[x].Combinations
                }
            }
            return dispatch({type: SET_COUPON_DATA, payload: coupondata});
        }
    }
}

export function removeSelection(selection){
    return async (dispatch, getState) => {
        // grab current state
        const state = getState();

        let  coupondata = {...state.couponData.coupon};
        const globalVars = {...state.sportsBook.SportsbookGlobalVariable};
        const bonusList = [...state.sportsBook.SportsbookBonusList];
        //find item index
        let index = coupondata.selections.findIndex(item => (item.event_id === selection.event_id && item.odd_id === selection.odd_id));
        //remove item from list
        coupondata.selections.splice(index, 1)
        //check if couponData still has selections
        if (coupondata.selections.length > 0) {
            const prevBetType = coupondata.bet_type;
            //group selections by match
            coupondata.tournaments = groupTournament(coupondata.selections);
            // coupondata.fixtures = groupSelections(coupondata.selections);
            //check bet type
            coupondata.bet_type = checkBetType(coupondata);

            if (coupondata.bet_type === 'Split') {
                coupondata = await getSplitProps(coupondata);
                //calculate winnings
                const minWinnings = parseFloat(coupondata.minOdds) * parseFloat(coupondata.minStake);
                const maxWinnings = parseFloat(coupondata.maxOdds) * parseFloat(coupondata.minStake);
                //calculate bonus
                coupondata.minBonus = calculateBonus(minWinnings, coupondata, globalVars, bonusList);
                coupondata.maxBonus = calculateBonus(maxWinnings, coupondata, globalVars, bonusList);
                coupondata.minGrossWin = parseFloat(coupondata.minBonus) + minWinnings;
                coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
                coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
                coupondata.grossWin = parseFloat(coupondata.maxBonus) + maxWinnings;
                coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
                coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
            } else {
                // recalculate totalOdds if prev bet type was Split
                if (prevBetType === 'Split') {
                    coupondata.totalOdds = calculateTotalOdds(coupondata.selections);
                } else { // else remove selection from total odds
                    coupondata.totalOdds = (parseFloat(coupondata.totalOdds) / parseFloat(selection.odds)).toFixed(2);
                }
                // check if has live
                coupondata.hasLive  = checkIfHasLive(coupondata.selections);

                const calculatedGroup   = couponCalculation.calcCombinations(coupondata);
                coupondata.combos       = calculatedGroup.Groups;
                // couponData.combos = await getCombos(couponData);
                //calculate and get pot winnings with bonus
                if (coupondata.bet_type === 'Combo') {
                    dispatch({type: SET_COUPON_DATA, payload: coupondata})
                    if (coupondata.Groupings && coupondata.Groupings.length) {
                        const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
                        coupondata = coupondata.updateFromCalculatedCoupon(coupondata, calculatedCoupon);
                        // update combos with max win
                        coupondata.combos.forEach(combo => {
                            for (let i = 0; i < coupondata.Groupings.length; i++) {
                                if (combo.Grouping === coupondata.Groupings[i].Grouping) {
                                    combo.minWIn = coupondata.Groupings[i].minWin;
                                    combo.maxWin = coupondata.Groupings[i].maxWin;
                                    combo.Stake  = coupondata.Groupings[i].Stake;
                                }
                            }
                        })
                        setTimeout(() => {
                            return dispatch(updateComboWinningsFromTotal());
                        }, 500);
                    }
                } else {
                    const winnings = calculateWinnings(coupondata, globalVars, bonusList);
                    coupondata.maxWin = winnings.maxWin;
                    coupondata.maxBonus = winnings.maxBonus;
                    coupondata.wthTax = winnings.wthTax;
                    coupondata.grossWin = winnings.grossWin;
                    return dispatch({type: SET_COUPON_DATA, payload: coupondata});
                }
            }
        } else {
            return dispatch({type: CANCEL_BET})
        }
    }
};

export function placeBet(e, type, giftCode){
    return (dispatch, getState) => {
        dispatch({type: LOADING});
        // console.log(e);
        // set button ele
        let ele = e.target;
        // grab current state
        const state = getState();

        const coupondata = {...state.couponData.coupon};
        // add giftCode to coupondata
        coupondata.giftCode = giftCode;

        if (coupondata.stake === 0){
            dispatch({type: LOADING});
            toast.error('Stake cannot be 0');
            return;
        }

        if (coupondata.selections.length === 2 && coupondata.stake > 2000){
            dispatch({type: LOADING});
            toast.error('Maximum stake for 2 selections is N2,000');
            return;
        }

        const hasMoreDraws = checkNoOfDraws(coupondata.selections);

        if (hasMoreDraws) {
            toast.error(`You cannot play more than 5 draws in one ticket`);
            return;
        }

        if (coupondata.hasLive)
            ele = document.getElementById('placeBetBtn');

        let url;
        if (type === 'bet') {
            url = `sports/place-bet?channel=website`;
            // check if user has been self excluded
            const {user} = {...state.auth};

            if (user.settings?.self_exclusion_period) {
                toast.error(`You have been temporary locked out for the next ${calculateExclusionPeriod(user.settings?.self_exclusion_period)} days due to your responsible gaming self exclusion settings.`)
                return;
            }

        } else {
            url = '/sports/book-bet?channel=website'
        }
        ele.disabled = true;
        ele.innerHTML = 'Submitting...';

        Http.post(url, coupondata).then(res => {
            ele.disabled = false;
            dispatch({type: LOADING});
            if (res.success) {

                if (type === 'bet') {
                    ele.innerHTML = 'Proceed';

                    // update user balance
                    dispatch({type: UPDATE_USER_BALANCE, payload: res.available_balance});
                    // update todays bet
                    dispatch({type: SET_TODAYS_BET, payload: res.coupon});
                    // dispatch({type: CANCEL_BET});
                } else {
                    ele.innerHTML = 'Book';
                }
                return dispatch({type: SET_BET_PLACED, payload: res});
            } else if (res.message === 'auth_fail') {
                if (type === 'bet') {
                    ele.innerHTML = 'Proceed';
                } else {
                    ele.innerHTML = 'Book';
                }
                return dispatch({type: SHOW_LOGIN_MODAL})
            } else if (res.error === 'odds_change') {
                // let bets = this.$store.getters.bets;
                _.each(coupondata.selection, function (value) {
                    _.each(res.events, function (item) {
                        if (value.provider_id === item.provider_id && value.odd_name === item.odd_name) {
                            value.hasError = true;
                        }
                    });
                });
                toast.error('Attention! some odds have been changed');

                coupondata.errorMsg = 'Attention! some odds have been changed';
                coupondata.hasError = true;

                if (type === 'bet') {
                    ele.innerHTML = 'Proceed';
                } else {
                    ele.innerHTML = 'Book';
                }
                //update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else if (res.error === 'events_started') {
                _.each(coupondata.selections, (value) => {
                    _.each(res.events, (item) => {
                        if (value.event_id === item.event_id) {
                            value.hasError = true
                        }
                    });
                });
                toast.error('Attention! Some events have started');

                coupondata.errorMsg = 'Attention! Some events have started';
                coupondata.hasError = true;
                coupondata.tournaments = groupTournament(coupondata.selections);
                // coupondata.fixtures = groupSelections(coupondata.selections);
                if (type === 'bet') {
                    ele.innerHTML = 'Proceed';
                } else {
                    ele.innerHTML = 'Book';
                }
                //update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else if (res.error === 'events_finished') {
                _.each(coupondata.selections, (value) => {
                    _.each(res.events, (item) => {
                        if (value.event_id === item.event_id) {
                            value.hasError = true
                        }
                    });
                });
                toast.error('Attention! Some events have ended. Remove them to continue.');

                coupondata.errorMsg = 'Attention! Some events have ended. Remove them to continue.';
                coupondata.hasError = true;
                coupondata.tournaments = groupTournament(coupondata.selections);
                // coupondata.fixtures = groupSelections(coupondata.selections);
                if (type === 'bet') {
                    ele.innerHTML = 'Proceed';
                } else {
                    ele.innerHTML = 'Book';
                }
                // update bets state in redux
                return dispatch({type: SET_COUPON_DATA, payload: coupondata});

            } else {
                dispatch({type: LOADING});

                ele.disabled = false;
                if (type === 'bet') {
                    ele.innerHTML = 'Place Bet';
                } else {
                    ele.innerHTML = 'Book';
                }
                toast.error(res.message || 'Something went wrong. We were unable to accept betslip.');
            }
        }).catch(err => {
            dispatch({type: LOADING});

            ele.disabled = false;
            if (type === 'bet') {
                ele.innerHTML = 'Place Bet';
            } else {
                ele.innerHTML = 'Book';
            }
            if(err.response.status === 401){
                toast.error('Please login to place bets');
            }
            // console.log(err);
        });
    }
};

export function placePoolBet(e) {
    return (dispatch, getState) => {
        let ele = e.target;
        // grab current state
        const state = getState();

        const coupondata = {...state.couponData.poolCoupon};
        ele.disabled = true;
        ele.innerHTML = 'Submitting...';
        Http.post(`/sports/pool/place-bet?channel=website`, coupondata).then(res => {
            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if (res.success) {
                // update user balance
                dispatch({type: UPDATE_USER_BALANCE, payload: res.available_balance});

                dispatch({type: CANCEL_BET});
                window.scrollTo({
                    top: 100,
                    left: 100,
                    behavior: 'smooth'
                });
                return dispatch({type: SET_BET_PLACED, payload: {
                        type: 'bet',
                        ticketType: 'pool',
                        coupon: {
                            betslip_id: res.coupon.coupon_no
                        }
                    }});
            } else if (res.message === 'auth_fail') {
                ele.innerHTML = 'Place Bet';
                return dispatch({type: SHOW_LOGIN_MODAL})
            } else {
                dispatch({type: LOADING});

                ele.disabled = false;
                ele.innerHTML = 'Place Bet';
                toast.error(res.message || 'Something went wrong. We were unable to accept betslip.');
            }
        }).catch(err => {

            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if(err.response.status === 401){
                toast.error('Please login to place bets');
            }
            // console.log(err);
        });
    }
}

export function placeCouponBet(e) {
    return (dispatch, getState) => {
        let ele = e.target;
        // grab current state
        const state = getState();

        const coupondata = {...state.couponData.weeklyCoupon};
        ele.disabled = true;
        ele.innerHTML = 'Submitting...';
        Http.post(`/sports/pool/place-coupon-bet?channel=website`, coupondata).then(res => {
            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if (res.success) {
                // update user balance
                dispatch({type: UPDATE_USER_BALANCE, payload: res.available_balance});

                dispatch({type: CANCEL_BET});
                window.scrollTo({
                    top: 100,
                    left: 100,
                    behavior: 'smooth'
                });
                return dispatch({type: SET_BET_PLACED, payload: {
                        type: 'bet',
                        ticketType: 'coupon',
                        coupon: {
                            betslip_id: res.coupon.coupon_no
                        }
                    }});
            } else if (res.message === 'auth_fail') {
                ele.innerHTML = 'Place Bet';
                return dispatch({type: SHOW_LOGIN_MODAL})
            } else {
                dispatch({type: LOADING});

                ele.disabled = false;
                ele.innerHTML = 'Place Bet';
                toast.error(res.message || 'Something went wrong. We were unable to accept betslip.');
            }
        }).catch(err => {

            ele.disabled = false;
            ele.innerHTML = 'Place Bet';
            if(err.response.status === 401){
                toast.error('Please login to place bets');
            }
            // console.log(err);
        });
    }
}

export function reloadCoupon (betslip_id, action) {
    return async (dispatch, getState) => {
        loadCoupon(betslip_id, action).then(res => {
            dispatch({type: LOADING});

            if (res.message === 'found' && res.coupon.selections.length) {
                let couponData = res.coupon;
                couponData.totalStake = couponData.stake;
                // couponData.tipster_id = betslip.tipster_id;
                // couponData.fixtures = groupSelections(couponData.selections);
                couponData.tournaments = groupTournament(couponData.selections);

                const calculatedGroup   = couponCalculation.calcCombinations(couponData);
                couponData.combos       = calculatedGroup.Groups;

                dispatch({type: SET_COUPON_DATA, payload: couponData});
                dispatch({type: SET_BETSLIP_DATA, payload: null});
            } else {
                alert('Unable to rebet the selected coupon because all the events are expired');
            }
        }).catch(err => dispatch({type: LOADING}));
    }
}
