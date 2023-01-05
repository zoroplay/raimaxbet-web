import * as _ from "lodash";
import {CANCEL_BET, SET_COUPON_DATA} from "../Redux/types";
import {getSplitProps} from "../Services/apis";
import { updateComboWinningsFromTotal } from "../Redux/actions";
import CouponCalculation from "./CouponCalculation";
import { uniqBy } from "lodash";
const couponCalculation = new CouponCalculation();

export const calculateWinnings = (couponData, globalVars, bonusList) => {
    //calculate winnings
    let maxWin = parseFloat(couponData.totalOdds) * parseFloat(couponData.stake);
    //calculate bonus
    let maxBonus = calculateBonus(maxWin, couponData, globalVars, bonusList);
    //add bonus to max winnings
    let total = (parseFloat(maxWin) + parseFloat(maxBonus));
    // calculate With-holding tax
    let wthTax = (total - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;

    wthTax = wthTax < 1 ? 0 : wthTax;

    return {maxWin: parseFloat(total - wthTax).toFixed(2), grossWin: total, maxBonus:maxBonus, wthTax};
};

export const calculateTotalOdds = (selections) => {
    let totalOdds = 1;

    selections.forEach(selection => totalOdds = totalOdds * selection.odds);

    return totalOdds;
}

export const calculateBonus = (maxWin, coupondata, globalVars, bonusList) => {
    let minBonusOdd = globalVars.MinBonusOdd,
        bonusInfo = [],
        bonus = 0;
    
    const events = [];
    // get eligible events for bonus
    coupondata.selections.forEach((item, i) => {
        if(item.odds >= minBonusOdd) events.push(item);
    });

    // get unique events in case of split bet
    const uniqueEvents = uniqBy(coupondata.selections, 'provider_id');

    // console.log(minBonusOdd);
    //get bonus settings for ticket length
    bonusList.forEach((item, i) => {
        if (coupondata.bet_type === 'Combo') {
            const lastGrouping = coupondata.Groupings[coupondata.Groupings.length - 1];
            if(item.ticket_length === lastGrouping.Grouping)
                bonusInfo = item;
        } else {
            if(item.ticket_length === uniqueEvents.length)
                bonusInfo = item;
        }
    })
    //calculate total bonus
    if(bonusInfo.bonus !== undefined){
        bonus = (maxWin * parseFloat(bonusInfo.bonus))/100;
    }
    return bonus;
};

export const checkBetType = (coupon) => {

    let betType = coupon.bet_type === 'Combo' ? 'Combo' : 'Multiple';
    coupon.tournaments.forEach((item) => {
        item.fixtures.forEach(fixture => {
            if (fixture.selections.length > 1) {
                betType = 'Split';
                return false;
            }
        });
    })
    return betType;
};

export const checkIfHasLive = (selections) => {
    let hasLive = false;
    selections.forEach((item) => {
        if(item.type === 'live'){
            hasLive = true;
        }
    })
    return hasLive;
};

export const createID = (event_id, market_id, odd_name, odd_id) => {
    let oddname = String(odd_name).replace(/[^a-zA-Z0-9]/g,'_');
    return event_id+'_'+market_id+'_'+oddname+'_'+odd_id
};

export const printTicket = (ticket, type) => {
    let url;
    switch (type) {
        case 'pool':
            url = process.env.REACT_APP_BASEURL+'/print-pool-ticket/'+ticket;
            break;
        case 'coupon':
            url = process.env.REACT_APP_BASEURL+'/print-coupon-ticket/'+ticket
            break;
        default:
            url =  process.env.REACT_APP_BASEURL+'/print-ticket/'+ticket
            break;
    }
    window.open(url, 'mywin','left=350,top=250,width=250,height=300,toolbar=1,resizable=0');
}

export const groupSelections = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    if (data.length) {
        data.forEach(function (item) {
            ArrKeyHolder[item.provider_id] = ArrKeyHolder[item.provider_id] || {};
            let obj = ArrKeyHolder[item.provider_id];

            if (Object.keys(obj).length === 0)
                Arr.push(obj);

            obj.event_name = item.event_name;
            obj.event_id = item.event_id;
            obj.provider_id = item.provider_id;
            obj.type = item.type;
            // obj.hasError    = item.hasError;
            obj.selections = obj.selections || [];

            obj.selections.push(item);
        });
    }
    return Arr;
};

export const groupTournament = (data) => {
    let ArrKeyHolder = [];
    let Arr = [];
    data.forEach(function(item){
        ArrKeyHolder[item.tournament] = ArrKeyHolder[item.tournament]||{};
        let obj = ArrKeyHolder[item.tournament];

        if(Object.keys(obj).length === 0)
            Arr.push(obj);

        obj.tournamentName  = item.tournament;
        obj.category        = item.category;
        obj.events          = obj.events || [];

        obj.events.push(item);
        obj.fixtures = groupSelections(obj.events);
    });
    return Arr;
};

export const checkOddsChange = async (couponData, fixtures, dispatch, globalVars, bonusList) => {
    let updated = false;
    let coupon = {...couponData};
    const selections = coupon.selections;
    // loop through selection
    fixtures.filter(fixture => {
        selections.filter((selection, i) => {
            if(selection.provider_id === fixture.provider_id) {
                // console.log('found fixture');
                if(fixture.live_data && fixture.live_data.markets.length) {
                    const markets = fixture.live_data.markets;
                    // console.log('looping through markets', markets)
                    markets.forEach(market => {
                        if (market.id === selection.market_id) {
                            // console.log('found market', market)

                            market.odds.forEach(odd => {
                                if(odd.type === selection.oddname ) {
                                    if(odd.active === '1' && odd.odds > selection.odds) {
                                        selection.classList = 'valueChanged valueIncreased flashSuccess';
                                        selection.oldOdds = selection.odds;
                                        selection.odds = odd.odds;
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        updated = true;
                                    } else if (odd.active === '1' && odd.odds < selection.odds) {
                                        selection.classList = 'valueChanged valueDecreased flashDanger';
                                        selection.oldOdds = selection.odds;
                                        selection.odds = odd.odds;
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        updated = true;
                                    } else if (odd.active === '0') {
                                        // selections.splice(i, 1);
                                        selection.classList = 'valueChanged valueDecreased flashDanger';
                                        coupon.hasError = true;
                                        coupon.errorMsg = 'Attention! some odds have been changed';
                                        selection.hasError = true;
                                        selection.disabled = true;
                                        updated = true;
                                    }
                                }
                            });
                        }
                    })
                    const findMarket = markets.filter(market => market.id === selection.market_id);
                    // console.log('not found', findMarket);
                    if(findMarket.length === 0) {
                        updated = true;
                        coupon.hasError = true;
                        coupon.errorMsg = 'Attention! some odds have been changed';
                        selection.error = true;
                        selection.disabled = true;
                    }
                }
            }
        })
    })
    
    if (updated) {
        coupon.hasLive  = checkIfHasLive(coupon.selections);
        // coupon.tournaments = groupTournament(coupon.selections);
        // coupon.fixtures = groupSelections(coupon.selections);
        // update coupon
        // dispatch({type: SET_COUPON_DATA, payload: coupon});
        if (coupon.selections.length > 0) {
            coupon.totalOdds = calculateTotalOdds(coupon.selections);;
            coupon.selections = selections;
            coupon.hasError = true;
            coupon.errorMsg = 'Attention! some odds have been changed';
            coupon.tournaments = groupTournament(coupon.selections);
            coupon.fixtures = groupSelections(coupon.selections);
            //check bet type
            coupon.bet_type = checkBetType(coupon);

            if (coupon.bet_type === 'Split') {
                coupon = await getSplitProps(coupon);
                coupon.minStake = parseFloat(coupon.stake) / coupon.noOfCombos;

                //calculate winnings
                const minWinnings = parseFloat(coupon.minOdds) * parseFloat(coupon.minStake);
                const maxWinnings = parseFloat(coupon.maxOdds) * parseFloat(coupon.minStake);
                //calculate bonus
                coupon.minBonus = calculateBonus(minWinnings, coupon, globalVars, bonusList);
                coupon.maxBonus = calculateBonus(maxWinnings, coupon, globalVars, bonusList);
                coupon.minGrossWin = parseFloat(coupon.minBonus) + minWinnings;
                coupon.minWTH = (coupon.minGrossWin - coupon.stake) * process.env.REACT_APP_WTH_PERC / 100;
                coupon.minWin = coupon.minGrossWin - coupon.minWTH;
                coupon.grossWin = parseFloat(coupon.maxBonus) + maxWinnings;
                const wthTax = (coupon.grossWin - coupon.stake) * process.env.REACT_APP_WTH_PERC / 100;
                coupon.wthTax = wthTax < 1 ? 0 : wthTax;
                coupon.maxWin = coupon.grossWin - coupon.wthTax;

                dispatch({type: SET_COUPON_DATA, payload: coupon});
            } else {
                const calculatedGroup   = couponCalculation.calcCombinations(coupon);
                coupon.combos       = calculatedGroup.Groups;
                // couponData.combos = await getCombos(couponData);
                //calculate and get pot winnings with bonus
                if (coupon.bet_type === 'Combo') {
                    dispatch({type: SET_COUPON_DATA, payload: coupon});
                    if (coupon.Groupings && coupon.Groupings.length) {
                        setTimeout(() => {
                            return dispatch(updateComboWinningsFromTotal());
                        }, 500);
                    }
                } else {
                    const winnings = calculateWinnings(coupon, globalVars, bonusList);
                    coupon.maxWin = winnings.maxWin;
                    coupon.maxBonus = winnings.maxBonus;
                    coupon.wthTax = winnings.wthTax;
                    coupon.grossWin = winnings.grossWin;

                    dispatch({type: SET_COUPON_DATA, payload: coupon});
                }
            }
            // check if has live
            coupon.hasLive  = checkIfHasLive(coupon.selections);
            coupon.tournaments = groupTournament(coupon.selections);
            coupon.fixtures = groupSelections(coupon.selections);
            // update coupon
            dispatch({type: SET_COUPON_DATA, payload: coupon});
        } else {
            dispatch({type: CANCEL_BET});
        }
    }
    // return updated;
}
