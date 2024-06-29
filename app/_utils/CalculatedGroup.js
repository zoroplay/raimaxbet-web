const CalculatedGroup = (function () {
    function CalculatedGroup(grouping, combinations, stakeForCombination, minPercentageBonus, maxPercentageBonus, minWinForUnit, maxWinForUnit, minBonusForUnit, maxBonusForUnit) {
        this.Grouping = grouping;
        this.Combinations = combinations || 0;
        this.StakeForCombination = stakeForCombination || 0;
        this.MinPercentageBonus = minPercentageBonus || 0;
        this.MaxPercentageBonus = maxPercentageBonus || 0;
        this.MinWinForUnit = minWinForUnit || 0;
        this.MaxWinForUnit = maxWinForUnit || 0;
        this.MinBonusForUnit = minBonusForUnit || 0;
        this.MaxBonusForUnit = maxBonusForUnit || 0;
    }
    CalculatedGroup.prototype.MinWin = function () {
        return this.MinWinForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.NetStakeMinWin = function () {
        return this.MinWinForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.MaxWin = function () {
        return this.MaxWinForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.NetStakeMaxWin = function () {
        return this.MaxWinForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.MinBonus = function () {
        return this.MinBonusForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.MaxBonus = function () {
        return this.MaxBonusForUnit * this.StakeForCombination;
    };
    CalculatedGroup.prototype.removeGroup = function (betCoupon, betCouponGroup) {
        return betCoupon.Groupings.remove("Grouping", betCouponGroup.Grouping);
    };
    return CalculatedGroup;
})();

export default CalculatedGroup