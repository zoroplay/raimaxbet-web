import React from "react";
import {fastAdd, updateComboWinningsFromTotal} from "../../../../Redux/actions";
import {SET_COUPON_DATA} from "../../../../Redux/types";
import {calculateBonus} from "../../../../Utils/couponHelpers";
import {formatNumber} from "../../../../Utils/helpers";

export const Combined = ({couponData, dispatch, globalVar, bonusList}) => {
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');

    const minMaxWin = (e, combo, i) => {
        let val = e.target.value
        let coupondata = {...couponData};

        if(val !== '' && val !== 0){
            // document.getElementById('comb_'+i).checked = true
            let minWin = parseFloat(combo.minOdds) * val
            let maxWin = parseFloat(combo.maxOdds) * val

            coupondata.combos[i].minWins = minWin;
            coupondata.combos[i].maxWins = maxWin;
            coupondata.combos[i].minStake= val;
            coupondata.combos[i].checked = true;

            let total = 0;
            let min = 0;
            let max = 0;
            let min_t = 0;
            let tmp_min = 100000000;
            let comboLength = 0;
            let noOfCombos = 0;
            let minStake = 0
            for (let x = 0; x < coupondata.combos.length; x++) {
                // console.log(coupondata.combos[x].minOdds)
                if(coupondata.combos[x].minStake !== undefined && coupondata.combos[x].minStake !== ''){
                    comboLength += coupondata.combos[x].comboLength;
                    noOfCombos += coupondata.combos[x].numberOfCombos;
                    total += parseFloat(coupondata.combos[x].numberOfCombos) * parseFloat(coupondata.combos[x].minStake)
                    min = parseFloat(coupondata.combos[x].minOdds) * parseFloat(coupondata.combos[x].minStake)
                    max += parseFloat(coupondata.combos[x].maxOdds) * parseFloat(coupondata.combos[x].minStake)
                    if (min < tmp_min && min !== 0)
                        tmp_min = min;
                }
            }
            min_t = tmp_min;
            if (min_t === 100000000)
                min_t = 0;

            minStake = (total/noOfCombos);
            //calculate bonus
            coupondata.minBonus = calculateBonus((Math.round(min_t * 100) / 100), coupondata, globalVar, bonusList);
            coupondata.maxBonus =  calculateBonus(max, coupondata, globalVar, bonusList);

            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + Math.round(min_t * 100) / 100;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + max;
            coupondata.wthTax = (coupondata.grossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
            coupondata.totalStake =  total;
            coupondata.exciseDuty = coupondata.totalStake * 6.98 / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            coupondata.comboSelection = comboLength;
            coupondata.noOfCombos = noOfCombos;
            coupondata.minStake = minStake.toFixed(2);
            coupondata.bet_type = 'Combo';

            // document.getElementById('min_max_'+i).innerText = formatNumber(minWin) + '/' + formatNumber(maxWin);

            return dispatch({type: SET_COUPON_DATA, payload: coupondata});

        }
    }

    return (
        <div className="combination-group">
            <table id="tableCombination">
                <thead>
                <tr>
                    <th className="group">Grp.</th>
                    <th className="combination">Com</th>
                    <th className="stake">Amount</th>
                    <th>Pot. Win.</th>
                </tr>
                </thead>
                <tbody id="combinations">
                {couponData.combos.length > 0 && couponData.combos.map((combo, c_index) =>
                <tr key={`combo-${c_index}`}>
                    <td className="group">
                        {combo.comboLength}
                        <div className="check">
                            <input
                                type="checkbox"
                                name={`comb_${c_index}`}
                                id={`comb_${c_index}`}
                                checked={combo.checked}
                                onChange={() => dispatch(updateComboWinningsFromTotal())}
                            />
                            <span className="checkmark" />
                        </div>
                    </td>
                    <td className="combination">{ combo.numberOfCombos }</td>
                    <td className="stake">
                        <input
                            name={`imp_comb_${c_index}`}
                            type="text"
                            maxLength="5"
                            className="TextBox"
                            value={combo.minStake}
                            onChange={(e) => minMaxWin(e, combo, c_index)}
                        />
                    </td>
                    <td className="winnings">
                        <span id={`minw_${c_index}`}>{formatNumber(combo.minWins || 0)}</span>
                        <span id={`maxw_${c_index}`}>{formatNumber(combo.maxWins || 0)}</span>
                    </td>
                </tr>
                )}
                </tbody>
                <tbody>
                <tr>
                    <td colSpan="2" className="selections">Selections: <a className="selectionss">{couponData.selections.length}</a></td>
                    <td colSpan="2" className="amount">
                        <span>Amount:</span>
                        <input
                            id="stakeSystem"
                            type="text"
                            maxLength={5}
                            value={couponData.stake}
                            onChange={(e) => dispatch(updateComboWinningsFromTotal(e.target.value))} />
                        <div onClick={() => dispatch(fastAdd(0))} className="small-button">Clear</div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div className="default-bets">
                            {amounts && amounts.map(amount => <div key={amount} className="single-bet" onClick={() => dispatch(fastAdd(parseInt(amount)))}>{globalVar.Currency} {amount}</div>)}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
