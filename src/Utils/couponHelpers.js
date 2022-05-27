import * as _ from "lodash";
import {CANCEL_BET, SET_COUPON_DATA} from "../Redux/types";
import {getCombos, getLiveFixtureData, getSplitProps} from "../Services/apis";

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
    let ticket_length = 0,
        minBonusOdd = globalVars.MinBonusOdd,
        bonusInfo = [],
        bonus = 0;
    //count eligible tickets for bonus
    coupondata.selections.forEach((item, i) => {
        if(item.odds >= minBonusOdd){
            ticket_length++;
        }
    });
    // console.log(minBonusOdd);
    //get bonus settings for ticket length
    bonusList.forEach((item, i) => {
        if(item.ticket_length === ticket_length)
            bonusInfo = item;
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

export const checkOddsChange = async (couponData, dispatch, globalVars, bonusList) => {
    let updated = false;
    let coupon = {...couponData};
    const selections = coupon.selections;
    // loop through selection
    for (let i = 0; i < selections.length; i++){
        if (selections[i]?.type === 'live') {
            await getLiveFixtureData(selections[i]?.event_id).then(res => {
                if (res.Id !== 0) {
                    // get event
                    const match = res.Tournaments[0].Events[0];
                    // get markets
                    const markets = match.Markets;

                    markets.forEach((item, key) => {
                        item.Selections.forEach((newSelection, s) => {
                            if (newSelection.Id === selections[i]?.odd_id) {
                                selections[i].score = match.Score;
                                selections[i].ht_score = match.SetScores;

                                if (newSelection.Odds[0].Value === 0) {
                                    coupon.hasError = true;
                                    coupon.errorMsg = 'Attention! some odds have been changed';
                                    // remove selection from coupon
                                    selections.splice(i, 1);
                                    updated = true;
                                } else if (newSelection.Odds[0].Value !== selections[i]?.odds) {
                                    updated = true;
                                    selections[i].odds = newSelection.Odds[0].Value;
                                    selections[i].hasError = true;
                                }
                            }
                        });
                    });
                }
            });
        }
    }
    if (updated) {
        if (coupon.selections.length > 0) {
            coupon.totalOdds = calculateTotalOdds(coupon.selections);;
            coupon.selections = selections;
            coupon.hasError = true;
            coupon.errorMsg = 'Attention! some odds have been changed';
            coupon.tournaments = groupTournament(coupon.selections);
            coupon.fixtures = groupSelections(coupon.selections);
            //check bet type
            couponData.bet_type = checkBetType(couponData.fixtures);

            if (couponData.bet_type === 'Split') {
                coupon = await getSplitProps(coupon);
            } else {
                coupon.combos = await getCombos(coupon);
                // calculate winnings
                let maxWin = parseFloat(coupon.totalOdds) * parseFloat(coupon.stake);
                // calculate bonus
                let maxBonus = calculateBonus(maxWin, coupon, globalVars, bonusList);
                // add bonus to max winnings
                coupon.maxWin = (parseFloat(maxWin) + parseFloat(maxBonus));
                coupon.maxBonus = maxBonus;
            }
            // check if has live
            couponData.hasLive  = checkIfHasLive(couponData.selections);

            // update coupon
            dispatch({type: SET_COUPON_DATA, payload: coupon});
        } else {
            dispatch({type: CANCEL_BET});
        }
    }
    return updated;
}

export const getLiveEvents = (selections) => {
    const events = [];
    _.each(selections, (selection, index) => {
        if (selection.type === 'live') {
            // events.push({
            //     IsLive: true,
            //     MarketId: selection.market_id,
            //     MatchId: selection.event_id,
            //     SelectionId: selection.odd_id,
            //     SelectionValue: selection.odds
            // })
            events.push(selection);
        }
    });
    return events;
}
