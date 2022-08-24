/* eslint-disable no-extend-native */
import SlotKey from './SlotKey';
import CalculatedGroup from './CalculatedGroup';
import CalculatedCoupon from './CalculatedCoupon';
import {Combination, FastCombination as fastCombination} from './Combination';
// import store from '../Redux/store';
import { calculateBonus } from './couponHelpers';
// const { SportsbookGlobalVariable, SportsbookBonusList  } = store.getState();

const BetCouponGroup = (function () {
    function BetCouponGroup() {
    }
    return BetCouponGroup;
})();

Array.prototype.unique = function (key) {
    var unique = {};
    var distinct = [];
    for (var i = 0; i < this.length; i++) {
        var current = this[i];
        if (typeof (unique[current[key]]) == "undefined") {
            distinct.push(current);
        }
        unique[current[key]] = 0;
    }
    return distinct;
};
Array.prototype.sum = function (key) {
    var sum = 0;
    for (var i = 0; i < this.length; i++) {
        var current = this[i];
        sum += current[key];
    }
    return sum;
};
Array.prototype.min = function (key) {
    if (this.length > 1) {
        var res = this.reduce(function (p, v) {
            return (p[key] < v[key] ? p : v);
        });
        return res[key];
    }
    else {
        var x = this[0];
        return x[key];
    }
};
Array.prototype.max = function (key) {
    if (this.length > 1) {
        var res = this.reduce(function (p, v) {
            return (p[key] > v[key] ? p : v);
        });
        return res[key];
    }
    else {
        var x = this[0];
        return x[key];
    }
};
Array.prototype.take = function (count) {
    return this.slice(0, count);
};
Array.prototype.sortAsc = function (key) {
    return this.sort(function (a, b) {
        if (a[key] > b[key])
            return 1;
        if (a[key] < b[key])
            return -1;
        return 0;
    });
};
Array.prototype.sortMultipleAsc = function (key1, key2, key3) {
    var cmp = function (a, b) {
        if (a > b)
            return +1;
        if (a < b)
            return -1;
        return 0;
    };
    return this.sort(function (a, b) {
        return cmp(a[key1], b[key1]) || cmp(a[key2], b[key2]) || cmp(a[key3], b[key3]);
    });
};
Array.prototype.sortDesc = function (key) {
    return this.sort(function (a, b) {
        if (a[key] > b[key])
            return -1;
        if (a[key] < b[key])
            return 1;
        return 0;
    });
};
Array.prototype.remove = function (key, match) {
    for (var index = 0; index < this.length; index++) {
        var current = this[index];
        if (current[key] == match) {
            this.splice(index, 1);
            return true;
        }
    }
    return false;
};
Array.prototype.removeAll = function (key, match) {
    var count = 0;
    for (var index = 0; index < this.length; index++) {
        var current = this[index];
        if (current[key] == match) {
            this.splice(index, 1);
            count++;
        }
    }
    return count;
};
Array.prototype.find = function (predicate) {
    // 1. Let O be ? ToObject(this value).
    if (this == null) {
        throw TypeError('"this" is null or not defined');
    }
    var o = Object(this);
    // 2. Let len be ? ToLength(? Get(O, "length")).
    var len = o.length >>> 0;
    // 3. If IsCallable(predicate) is false, throw a TypeError exception.
    if (typeof predicate !== 'function') {
        throw TypeError('predicate must be a function');
    }
    // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
    var thisArg = arguments[1];
    // 5. Let k be 0.
    var k = 0;
    // 6. Repeat, while k < len
    while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
        // d. If testResult is true, return kValue.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
        }
        // e. Increase k by 1.
        k++;
    }
    // 7. Return undefined.
    return undefined;
};

export default class CouponCalculation {
    // const coupon;

    getSlotKeyFromString = function (key) {
        var splitKey = key.split("_");
        var matchId = parseInt(splitKey[0]);
        var index = parseInt(splitKey[1]);
        return new SlotKey(matchId, index);
    };
    getOddsForSlotKeyMap = function (coupon) {
        var oddsForSlotKeyMap = {};
        for (var i = 0; i < coupon.selections.length; i++) {
            var odd = coupon.selections[i];
            var keys = [];
            for (var key in oddsForSlotKeyMap) {
                var slotKey = this.getSlotKeyFromString(key);
                if (slotKey.MatchId === odd.provider_id && slotKey.Index === 0)
                    keys.push(slotKey);
                else if (slotKey.MatchId === odd.provider_id && slotKey.Index > 0)
                    throw new Error("Mixed CompatibilityLevel on odds");
            }
            if (keys.length > 1)
                throw new Error("Wrong oddsForSlotKeyMap construction");
            if (keys.length === 0) {
                var sk = new SlotKey(odd.provider_id, 0);
                var x = [];
                x.push(odd);
                oddsForSlotKeyMap[sk.getKey()] = x;
            }
            else {
                var sk = keys[0];
                var currentSK = oddsForSlotKeyMap[sk.getKey()];
                currentSK.push(odd);
            }
        }
        return oddsForSlotKeyMap;
    };
    calcCombinations = function (coupon) {
        // console.log('calculating combinations');
        var maxCombinationForCoupon = Math.min(process.env.REACT_APP_MaxCombinationsByGrouping, process.env.REACT_APP_MaxCouponCombinations);
        if (coupon.selections.length > 0 && coupon.selections.filter(function (o) { return o.fixed; }).length === coupon.selections.length)
            coupon.selections[0].fixed = false;
        var calculatedCouponGroups = [];
        var oddsForSlotKeyMap = this.getOddsForSlotKeyMap(coupon);
        var bankers = [];
        var nonBankers = [];
        var slotKeyCount = 0;
        var integrale = false;
        var numSelectionsPerEvent = [];

        for (var key in oddsForSlotKeyMap) {
            var currentSK = oddsForSlotKeyMap[key];
            if (currentSK[0].Fixed)
                bankers.push(currentSK[0]);
            else {
                nonBankers.push(currentSK);
                numSelectionsPerEvent.push(currentSK.length);
            }
            slotKeyCount += 1;
            if (currentSK.length > 1)
                integrale = true;
        }
        var firstGroup = bankers.length > 0 ? bankers.length : 1;

        for (var groupIndex = 0; groupIndex <= slotKeyCount; groupIndex++) {
            var group = null;
            if (groupIndex > 0) {
                group = new CalculatedGroup(groupIndex);
                if (groupIndex < firstGroup)
                    group.Combinations = 0;
            }
            calculatedCouponGroups.push(group);
        }
        if (bankers.length > 0) {
            calculatedCouponGroups[bankers.length].Combinations = 0;
        }
        if (!integrale) {
            for (var k = nonBankers.length; k > 0; k--) {
                var n = nonBankers.length;
                var nc = new Combination().choose(n, k);
                if (maxCombinationForCoupon > nc)
                    calculatedCouponGroups[k + bankers.length].Combinations = nc;
                else
                    calculatedCouponGroups[k + bankers.length].Combinations = -1;
            }
        }
        else {
            for (var k = nonBankers.length; k > 0; k--) {
                var combinationsCount = this.calcCombinationsForCrossCombinationsBetGroup(k, numSelectionsPerEvent, maxCombinationForCoupon);
                calculatedCouponGroups[k + bankers.length].Combinations = combinationsCount;
            }
        }
        const maxPossibleGroupings = this.MaxGrouping(coupon.selections);
        for (var index = 0; index < calculatedCouponGroups.length; index++) {
            if (calculatedCouponGroups[index] == null || calculatedCouponGroups[index].Grouping > maxPossibleGroupings) {
                calculatedCouponGroups.splice(index, 1);
                index--;
            }
        }
        var calculatedCoupon = new CalculatedCoupon();
        calculatedCouponGroups.forEach(function (g) { return calculatedCoupon.Groups.push(g); });
        return calculatedCoupon;
    };
    calcCombinationsForCrossCombinationsBetGroup = function (k, numSelectionsPerEvent, maxCombinationForCoupon) {
        var choosen = fastCombination.chooseFromSets(numSelectionsPerEvent, k);
        if (choosen > maxCombinationForCoupon)
            return -1;
        return choosen;
    };
    calcPotentialWins = function (coupon, bonusList) {
        var maxCombinationForCoupon = Math.min(process.env.REACT_APP_MaxCombinationsByGrouping, process.env.REACT_APP_MaxCouponCombinations);
        var oddsForSlotKeyMap = this.getOddsForSlotKeyMap(coupon);
        var bankers = [];
        var nonBankers = [];
        for (var key in oddsForSlotKeyMap) {
            var currentSK = oddsForSlotKeyMap[key];
            if (currentSK[0].Fixed)
                bankers.push(currentSK[0]);
            else {
                nonBankers.push(currentSK);
            }
        }

        var maxCombination = [];
        var minCombination = [];
        for (var nonBankerIndex = 0; nonBankerIndex < nonBankers.length; nonBankerIndex++) {
            maxCombination[nonBankerIndex] = nonBankers[nonBankerIndex].sortDesc("odds")[0];
            minCombination[nonBankerIndex] = nonBankers[nonBankerIndex].sortAsc("odds")[0];
        }
        var calculatedCouponGroups = [];
        for (var i = 0; i < coupon.Groupings.length; i++) {
            var betCouponGroup = coupon.Groupings[i];
            if (betCouponGroup.Combinations > 0) {
                
                var calculatedGroup = new CalculatedGroup(betCouponGroup.Grouping);
                calculatedGroup.Combinations = betCouponGroup.Combinations;
                calculatedGroup.StakeForCombination = betCouponGroup.Stake;
                calculatedCouponGroups.push(calculatedGroup);
            }
        }
        if (coupon.Groupings.length === 0 && bankers.length + nonBankers.length === 1) {
            var combinations = 1;
            if (nonBankers.length > 0) {
                combinations = nonBankers[0].length;
            }
            var calculatedGroup = new CalculatedGroup(1);
            calculatedGroup.Combinations = combinations;
            calculatedGroup.StakeForCombination = coupon.stake / combinations;
            calculatedCouponGroups.push(calculatedGroup);
        }
        var bankersValidEventForBonus = 0;
        var bankersTotalOdds = 1.0;
        for (var i = 0; i < bankers.length; i++) {
            var b = bankers[i];
            bankersTotalOdds *= b.odds;
            bankersTotalOdds = Number(bankersTotalOdds.toFixed(10)); // Attempting to work around the javascript precision issue
            if (b.OddValue >= process.env.REACT_APP_MinBonusOdd)
                bankersValidEventForBonus++;
        }
        for (var i = 0; i < calculatedCouponGroups.length; i++) {
            var calculatedGroup = calculatedCouponGroups[i];
            var n = nonBankers.length;
            var k = calculatedGroup.Grouping - bankers.length;
            var nc = new Combination().choose(n, k);
            var maxWinForUnit = 0.0;
            var maxBonusForUnit = 0.0;
            if (maxCombinationForCoupon > nc) {
                var combination = new Combination(n, k);
                for (var j = 0; j < nc; j++) {
                    var validEventsForBonus = bankersValidEventForBonus;
                    var winForUnit = bankersTotalOdds;
                    var combOdds = combination.applyTo(maxCombination);
                    for (var l = 0; l < combOdds.length; l++) {
                        var odd = combOdds[l];
                        winForUnit *= odd.odds;
                        winForUnit = Number(winForUnit.toFixed(10)); // Attempting to work around the javascript precision issue
                        if (odd.odds >= process.env.REACT_APP_MinBonusOdd)
                            validEventsForBonus++;
                    }
                    var percBonus = this.bonusPercentageFromNumberOfEvents(bonusList, validEventsForBonus);
                    maxWinForUnit += winForUnit;
                    maxBonusForUnit += winForUnit * percBonus;
                    combination = combination.successor();
                    calculatedGroup.MaxPercentageBonus = percBonus;
                }
            }
            calculatedGroup.MaxWinForUnit = maxWinForUnit;
            calculatedGroup.MaxBonusForUnit = maxBonusForUnit;
            var minWinForUnit = bankersTotalOdds;
            var minEventForBonus = bankersValidEventForBonus;
            var sortedMinComb = minCombination.sortAsc("odds");
            var subSortedMinComb = sortedMinComb.take(k);
            for (var j = 0; j < subSortedMinComb.length; j++) {
                var odd = subSortedMinComb[j];
                // PS: This multiplication (and possibly all others) suffer from the problem
                // of javascript floating point precision. This results in a total max win which
                // might vary slightly from the server's calculations.
                // A possible solution to this problem are libraries such as BigNumber and big.js
                minWinForUnit *= odd.odds;
                minWinForUnit = Number(minWinForUnit.toFixed(10)); // Attempting to work around the javascript precision issue
                if (odd.odds >= process.env.REACT_APP_MinBonusOdd)
                    minEventForBonus++;
            }
            var minPercBonus = this.bonusPercentageFromNumberOfEvents(bonusList, minEventForBonus);
            calculatedGroup.MinWinForUnit = minWinForUnit;
            calculatedGroup.MinBonusForUnit = minWinForUnit * minPercBonus;
            calculatedGroup.MinPercentageBonus = minPercBonus;
        }
        var calculatedCoupon = new CalculatedCoupon();
        calculatedCouponGroups.forEach(function (g) { return calculatedCoupon.Groups.push(g); });
        return calculatedCoupon;
    };
    bonusPercentageFromNumberOfEvents = function (bonusList, numberOfEvents) {
        if (bonusList.length === 0)
            return 0.0;
        if (numberOfEvents < bonusList.min("ticket_length"))
            return 0.0;
        if (numberOfEvents > bonusList.max("ticket_length")) {
            return 0.0;
        }
        var filteredBonusList = bonusList.filter(function (b) { return b.ticket_length === numberOfEvents; });
        if (filteredBonusList.length > 0) {
            var item = filteredBonusList[0];
            return item.bonus / 100.0;
        }
        throw new Error("Can't find the bonus percentage for " + numberOfEvents + " events");
    };
    updateFromCalculatedCoupon = function (betCoupon, calculatedCoupon, globalVar, bonusList) {

        if (betCoupon.Groupings.length > 0) {
            for (var i = 0; i < calculatedCoupon.Groups.length; i++) {
                var calculatedGroup = calculatedCoupon.Groups[i];
                var betCouponGroups = betCoupon.Groupings.filter(function (g) { return g.Grouping == calculatedGroup.Grouping; });
                if (betCouponGroups.length > 0) {
                    var betCouponGroup = betCouponGroups[0];
                    betCouponGroup.Combinations = calculatedGroup.Combinations;
                    betCouponGroup.MaxBonus = calculatedGroup.MaxBonus();
                    betCouponGroup.maxWin = calculatedGroup.MaxWin();
                    betCouponGroup.MaxWinNet = calculatedGroup.NetStakeMaxWin(); // Till this point only turnover tax is applied. Witholding tax is applied later
                    betCouponGroup.NetStakeMaxWin = calculatedGroup.NetStakeMaxWin();
                    betCouponGroup.MinBonus = calculatedGroup.MinBonus();
                    betCouponGroup.minWin = calculatedGroup.MinWin();
                    betCouponGroup.MinWinNet = calculatedGroup.NetStakeMinWin(); // Till this point only turnover tax is applied. Witholding tax is applied later
                    betCouponGroup.NetStakeMinWin = calculatedGroup.NetStakeMinWin();
                    betCouponGroup.MinPercentageBonus = calculatedGroup.MinPercentageBonus;
                    betCouponGroup.MaxPercentageBonus = calculatedGroup.MaxPercentageBonus;
                    betCouponGroup.NetStake = calculatedGroup.StakeForCombinationTaxed;
                }
                if (!betCouponGroup.Combinations > 0 && betCouponGroup.Grouping > 0) {
                    betCoupon = this.removeGroup(betCoupon, betCouponGroup);
                }
            }
        }
        //betCoupon.Odds.sortMultipleAsc("EventName", "TournamentName", "MatchName");
        betCoupon.TotalCombinations = this.getTotalCombinations(betCoupon);
        betCoupon.minWin = this.getMinWin(betCoupon);
        betCoupon.NetStakeMinWin = this.getNetStakeMinWin(betCoupon);
        betCoupon.maxWin = this.getMaxWin(betCoupon);
        betCoupon.NetStakeMaxWin = this.getNetStakeMaxWin(betCoupon);
        betCoupon.minBonus = calculateBonus(betCoupon.minWin, betCoupon, globalVar, bonusList);
        betCoupon.maxBonus = calculateBonus(betCoupon.maxWin, betCoupon, globalVar, bonusList);
        betCoupon.maxWin = betCoupon.maxBonus + betCoupon.maxWin;
        betCoupon.minWin = betCoupon.minBonus + betCoupon.minWin;

        betCoupon.MinPercentageBonus = this.getMinPercentageBonus(betCoupon);
        betCoupon.MaxPercentageBonus = this.getMaxPercentageBonus(betCoupon);
        betCoupon.minOdds = this.getMinOdd(betCoupon);
        betCoupon.maxOdds = this.getMaxOdd(betCoupon);
        return betCoupon;
    };
    MaxGrouping = function (selections) {
        var ret = Number.MAX_VALUE;
        //lottery skip for now
        var compatibleMarketsCount = 0;
        var incompatibleMarketsEventCount = selections.unique("provider_id").length;
        var temp_ret = compatibleMarketsCount + incompatibleMarketsEventCount;
        if (temp_ret > ret)
            return ret;
        else
            return temp_ret;
    };
    getTotalCombinations = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.sum("Combinations");
        }
        else {
            return 0;
        }
    };
    getMinWin = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.min("minWin");
        }
        else {
            return 0;
        }
    };
    getNetStakeMinWin = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.min("MinWinNet");
        }
        else {
            return 0;
        }
    };
    getMinOdd = function (betCoupon) {
        if (betCoupon.Groupings != null && betCoupon.Groupings.length > 0) {
            var minWinGroup = betCoupon.Groupings.filter(function (g) { return g.Stake > 0; }).sort(function (a, b) { return a.minWin - b.minWin; })[0];
            if (minWinGroup !== null) {
                return parseFloat((minWinGroup.minWin / minWinGroup.Stake).toFixed(2));
            }
        }
        return 0;
    };
    getMaxOdd = function (betCoupon) {
        if (betCoupon.Groupings != null && betCoupon.Groupings.length > 0) {
            var maxOddSum = betCoupon.Groupings.filter(function (g) { return g.Stake > 0; }).reduce(function (acc, g) { return acc + (g.maxWin / g.Stake); }, 0);
            return parseFloat(maxOddSum.toFixed(2));
        }
        return 0;
    };
    getMaxWin = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.sum("maxWin");
        }
        else {
            return 0;
        }
    };
    getNetStakeMaxWin = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.sum("MaxWinNet");
        }
        else {
            return 0;
        }
    };
    getMinBonus = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.min("MinBonus");
        }
        else {
            return 0;
        }
    };
    getMaxBonus = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.sum("MaxBonus");
        }
        else {
            return 0;
        }
    };
    getMinPercentageBonus = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.min("MinPercentageBonus");
        }
        else {
            return 0;
        }
    };
    getMaxPercentageBonus = function (betCoupon) {
        if (betCoupon.Groupings.length > 0) {
            return betCoupon.Groupings.max("MaxPercentageBonus");
        }
        else {
            return 0;
        }
    };
    truncateLastRoundedDecimalValue = function (num) {
        var pointerIdx = num.toString().indexOf('.');
        var precisionLength = num.toString().substring(pointerIdx + 1).length;
        var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (precisionLength - 1) + '})?');
        return parseFloat(num.toString().match(re)[0]);
    };
    setPossibleCouponStake = function (betCoupon) {
        for (var _d = 0, _e = betCoupon.Groupings; _d < _e.length; _d++) {
            const grpItem = _e[_d];
            if(!grpItem.Stake)
                grpItem.Stake = 0;
            //get ratio of inner stake to get minStake for grouping allowed
            var minInnerStakeAllowed = process.env.REACT_APP_MinGroupingsBetStake;
            if (betCoupon.stake !== 0) {
                var grpStakeRatio = grpItem.Stake / betCoupon.stake;
                grpStakeRatio = this.truncateLastRoundedDecimalValue(grpStakeRatio);
                minInnerStakeAllowed = Math.max(process.env.REACT_APP_MinGroupingsBetStake, (process.env.REACT_APP_MinBetStake * grpStakeRatio));
            }
            if ((process.env.REACT_APP_StakeInnerMod0Combination != null && process.env.REACT_APP_StakeInnerMod0Combination !== 0)) {
                var modValueItem = grpItem.Stake % process.env.REACT_APP_StakeInnerMod0Combination;
                //if correct then continue to next GroupItem
                if (modValueItem !== 0) {
                    //new Stake Value
                    var divValueItem = grpItem.Stake / process.env.REACT_APP_StakeInnerMod0Combination;
                    var rounded = Math.round(divValueItem);
                    if (rounded === 0)
                        rounded = 1;
                    grpItem.Stake = rounded * process.env.REACT_APP_StakeInnerMod0Combination;
                }
                if (grpItem.Stake < minInnerStakeAllowed) {
                    //new Stake Value
                    var divValueItemMin = minInnerStakeAllowed / process.env.REACT_APP_StakeInnerMod0Combination;
                    var roundedMin = Math.ceil(divValueItemMin);
                    if (roundedMin === 0)
                        roundedMin = 1;
                    grpItem.Stake = roundedMin * process.env.REACT_APP_StakeInnerMod0Combination;
                }
            }
            betCoupon.Groupings[_d] = grpItem;
        }
        return betCoupon;
        //recalculate coupon to use set stake values if not updateCouponWithNewValues
    };
    removeGroup = function (betCoupon, betCouponGroup) {
        return betCoupon.Groupings.remove("Grouping", betCouponGroup.Grouping);
    };
    setPossibleGroupings = (betCoupon, calculatedCoupon) => {
        var possibleMissingGrouping = [];
        for (var i = 0; i < calculatedCoupon.Groups.length; i++) {
            var calculatedGroup = calculatedCoupon.Groups[i];
            var combinations = calculatedGroup.Combinations;
            var betCouponGroups = betCoupon.Groupings.filter(function (g) { return g.Grouping == calculatedGroup.Grouping; });
            if (betCouponGroups.length > 1)
                throw new Error("Multiple Groupings defined!");
            //add all groupings
            if (betCouponGroups.length === 0) {
                var newGroup = new BetCouponGroup();
                newGroup.Grouping = calculatedGroup.Grouping;
                newGroup.Combinations = calculatedGroup.Combinations;
                possibleMissingGrouping.push(newGroup);
            }
            if (combinations <= 0 || combinations > betCoupon.BetCouponGlobalVariable.MaxCouponCombinations) {
                if (betCouponGroups.length > 0) {
                    this.removeGroup(betCoupon, betCouponGroups[0]);
                }
            }
            else {
                if (betCouponGroups.length > 0) {
                    betCouponGroups[0].Combinations = combinations;
                }
            }
        }
        // BTK-1297: ensure there is always 1 group selected if possible
        if (betCoupon.Groupings.length === 0 && possibleMissingGrouping.length >= 1) {
            // find the last available grouping which doesn't have grouping 1 or grouping equal
            // to number of odds in the coupon
            var validGroupings = possibleMissingGrouping.filter(function (g) { return g.Grouping > 0 && g.Grouping !== 1 && g.Grouping !== betCoupon.Odds.length; });
            var lastGrouping = validGroupings.pop();
            if (lastGrouping) {
                // create a new grouping based on the one found
                var newGrouping = new BetCouponGroup();
                newGrouping.Combinations = lastGrouping.Combinations;
                newGrouping.Grouping = lastGrouping.Grouping;
                betCoupon.Groupings.push(newGrouping);
                // remove the selected grouping from the list of possibleMissingGroupings
                possibleMissingGrouping = possibleMissingGrouping.filter(function (g) { return g.Grouping !== lastGrouping.Grouping || g.Combinations !== lastGrouping.Combinations; });
            }
        }
        betCoupon.PossibleMissingGroupings = possibleMissingGrouping;
        return betCoupon;
    }
}