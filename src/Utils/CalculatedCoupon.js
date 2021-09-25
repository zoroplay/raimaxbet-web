const CalculatedCoupon = (function () {
    function CalculatedCoupon() {
        this.Groups = [];
    }
    CalculatedCoupon.prototype.getMaxAllowedStake = function (lossThreshold, stakeThreshold, maxGrouping, selectedGroupings, totalCouponCombinations) {
        var totalCurrentLossForUnit = this.getTotalWinForUnit(selectedGroupings) + this.getTotalBonusForUnit(selectedGroupings);
        if (totalCurrentLossForUnit === 0) {
            totalCurrentLossForUnit = 1;
        }
        var newTotalStake = (lossThreshold / totalCurrentLossForUnit) * totalCouponCombinations;
        if (stakeThreshold > 0) {
            newTotalStake = newTotalStake > stakeThreshold ? stakeThreshold : newTotalStake;
        }
        newTotalStake = newTotalStake * 100;
        newTotalStake = Math.floor(newTotalStake);
        newTotalStake = newTotalStake / 100;
        //consider rounding later on 
        //Math.Round(newTotalStake, 2);
        return newTotalStake;
    };
    CalculatedCoupon.prototype.getTotalWinForUnit = function (selectedGroupings) {
        if (selectedGroupings.length > 0) {
            return this.Groups.filter(function (g) { return selectedGroupings.indexOf(g.Grouping) !== -1; }).sum("MaxWinForUnit");
        }
        else {
            return 0;
        }
    };
    CalculatedCoupon.prototype.getTotalBonusForUnit = function (selectedGroupings) {
        if (selectedGroupings.length > 0) {
            return this.Groups.filter(function (g) { return selectedGroupings.indexOf(g.Grouping) !== -1; }).sum("MaxBonusForUnit");
        }
        else {
            return 0;
        }
    };
    return CalculatedCoupon;
})();

export default CalculatedCoupon;