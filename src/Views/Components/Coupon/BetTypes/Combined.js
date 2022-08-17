import React from "react";
import {fastAdd, updateComboWinningsFromTotal} from "../../../../Redux/actions";
import {SET_COUPON_DATA} from "../../../../Redux/types";
import CouponCalculation from "../../../../Utils/CouponCalculation";
import {formatNumber} from "../../../../Utils/helpers";

export const Combined = ({couponData, dispatch, globalVar, bonusList}) => {
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');
    const couponCalculation = new CouponCalculation();

    const minMaxWin = (e, combo, i) => {
        let val = e.target.value
        let coupondata = {...couponData};

        if(val !== '' && val !== 0){
            combo.Stake= val;
            combo.checked = true;
            if (!coupondata.Groupings) {
                coupondata.Groupings = [combo];
            } else {
                coupondata.Groupings.push(combo);
            }

            const calculatedCoupon = couponCalculation.calcPotentialWins(coupondata, bonusList);
            coupondata = couponCalculation.updateFromCalculatedCoupon(coupondata, calculatedCoupon, globalVar, bonusList);
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


            let total = 0;

            for (let x = 0; x < coupondata.combos.length; x++) {
                // console.log(coupondata.combos[x].minOdds)
                if(coupondata.combos[x].Stake !== undefined && coupondata.combos[x].Stake !== ''){
                    total += parseFloat(coupondata.combos[x].Combinations) * parseFloat(coupondata.combos[x].Stake)

                }
            }

            coupondata.totalStake =  total;
            coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

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
                            {combo.Grouping}
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
                        <td className="combination">{ combo.Combinations }</td>
                        <td className="stake">
                            <input
                                name={`imp_comb_${c_index}`}
                                type="text"
                                maxLength="5"
                                className="TextBox"
                                value={combo.Stake}
                                onChange={(e) => minMaxWin(e, combo, c_index)}
                            />
                        </td>
                        <td className="winnings">
                            <span id={`minw_${c_index}`}>{combo.minWin ? formatNumber(combo.minWin) : 0}</span>
                            <span id={`maxw_${c_index}`}>{combo.maxWin ? formatNumber(combo.maxWin) : 0}</span>
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
                            {amounts && amounts.map(amount => <div key={amount} className="single-bet btn-color-blue" onClick={() => dispatch(fastAdd(parseInt(amount)))}>
                                {/* {globalVar.Currency} */}
                                {amount}
                            </div>)}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
