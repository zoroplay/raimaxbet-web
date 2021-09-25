export const Combination = (function () {
    function Combination(n, k) {
        if (n && k) {
            if (n < 0 || k < 0)
                throw new Error("Negative parameter in constructor");
            this.n = n;
            this.k = k;
            this.data = [];
            for (var i = 0; i < k; i++) {
                this.data[i] = i;
            }
        }
    }
    Combination.prototype.successor = function () {
        if (this.data.length === 0 || this.data[0] === this.n - this.k)
            return null;
        var result = new Combination(this.n, this.k);
        var i = 0;
        for (i = 0; i < this.k; i++)
            result.data[i] = this.data[i];
        for (i = this.k - 1; i > 0 && result.data[i] === this.n - this.k + i;)
            i--;
        result.data[i]++;
        for (var j = i; j < this.k - 1; j++)
            result.data[j + 1] = result.data[j] + 1;
        return result;
    };
    Combination.prototype.first = function () {
        var result = new Combination(this.n, this.k);
        for (var i = 0; i < result.k; ++i)
            result.data[i] = i;
        return result;
    };
    Combination.prototype.applyTo = function (array) {
        if (array.length !== this.n)
            throw new Error("Array size not equal to Combination order in ApplyTo()");
        var result = [];
        for (var i = 0; i < this.k; i++) {
            result[i] = array[this.data[i]];
        }
        return result;
    };
    Combination.prototype.choose = function (n, k) {
        if (n < 0 || k < 0)
            throw new Error("Invalid negative parameter in Choose()");
        if (n < k)
            return 0;
        if (n === k || k === 0)
            return 1;
        var delta = 0, iMax = 0;
        if (k < n - k) {
            delta = n - k;
            iMax = k;
        }
        else {
            delta = k;
            iMax = n - k;
        }
        var result = delta + 1;
        for (var i = 2; i <= iMax; ++i) {
            result = (result * (delta + i)) / i;
        }
        return result;
    };
    return Combination;
})();

export const FastCombination = (function () {
    function FastCombination() {
    }
    FastCombination.prototype.create2Darray = function (rows) {
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        return arr;
    };
    FastCombination.prototype.chooseFromSets = function (setSizes, k) {
        var n = setSizes.length;
        if (k === 0 || k > n)
            return 0;
        var result = 0;
        var m = this.create2Darray(k + 1);
        for (var y = 1; y <= (n - k + 1); y++) {
            if (y === 1) {
                for (var x = 1; x <= k; x++) {
                    m[x][y] = setSizes.take(x).reduce(function (product, next) { return product * next; }, 1);
                    result = m[x][y];
                }
            }
            else {
                m[1][y] = setSizes.take(y).reduce(function (a, b) { return a + b; }, 0);
                result = m[1][y];
                for (var x = 2; x <= k; x++) {
                    m[x][y] = m[x][y - 1] + m[x - 1][y] * setSizes[x + y - 2];
                    result = m[x][y];
                }
            }
        }
        return result;
    };
    return FastCombination;
})();