const SlotKey = (function () {
    function SlotKey(_matchId, _index) {
        this.MatchId = _matchId;
        this.Index = _index;
    }
    SlotKey.prototype.getKey = function () {
        return this.MatchId + "_" + this.Index;
    };
    return SlotKey;
})();

export default SlotKey;