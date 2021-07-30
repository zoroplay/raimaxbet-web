import React from "react";
import {calculateBonus} from "../../../../Utils/couponHelpers";
import {SET_COUPON_DATA} from "../../../../Redux/types";

export const Split = ({couponData, dispatch, globalVar, bonusList}) => {
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');

    const updateSystemWinnings = (stake, action) => {
        let coupondata = {...couponData};
        coupondata.totalStake = stake;

        if(stake !== '') {

            coupondata.exciseDuty = coupondata.totalStake * 0 / 100;
            coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;
            coupondata.minStake = parseFloat(stake) / coupondata.noOfCombos;

            //calculate winnings
            let minWinnings = parseFloat(coupondata.minOdds) * parseFloat(coupondata.minStake);
            let maxWinnings = parseFloat(coupondata.maxOdds) * parseFloat(coupondata.minStake);
            //calculate bonus
            coupondata.minBonus = calculateBonus(minWinnings, coupondata, globalVar, bonusList);
            coupondata.maxBonus = calculateBonus(maxWinnings, coupondata, globalVar, bonusList);
            coupondata.minGrossWin = parseFloat(coupondata.minBonus) + minWinnings;
            coupondata.minWTH = (coupondata.minGrossWin - coupondata.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.minWin = coupondata.minGrossWin - coupondata.minWTH;
            coupondata.grossWin = parseFloat(coupondata.maxBonus) + maxWinnings;
            const wthTax = (couponData.grossWin - couponData.stake) * process.env.REACT_APP_WTH_PERC / 100;
            coupondata.wthTax = wthTax < 1 ? 0 : wthTax;
            coupondata.maxWin = coupondata.grossWin - coupondata.wthTax;
        }
        return dispatch({type: SET_COUPON_DATA, payload: coupondata});

    }

    return (
        <div data-coupon-split="" className="combination-group">
            <table id="tableIntegral">
                {/*<thead>
                <tr>
                    <th className="group">Grp.</th>
                    <th className="combination">Com</th>
                    <th className="stake">Amount</th>
                    <th>Pot. Win.</th>
                </tr>
                </thead>
                <tbody id="combinationsIntegral">
                <tr>
                    <td className="group">5</td>
                    <td className="combination" id="integralCombination">2</td>
                    <td className="stake">
                        <input id="integralSingle" onChange="calculateIntegralFromStake();" onKeyUp="calculateIntegralFromStake();" type="text" value="undefined" />
                        <input type="hidden" id="intMinBonus" value="12.4505" />
                        <input type="hidden" id="intMaxBonus" value="40.786500000000004" />
                        <input type="hidden" id="intMinOdd" value="249.01" />
                        <input type="hidden" id="intMaxOdd" value="815.73" />
                    </td>
                    <td className="winnings">
                        <span id="intVinPotMin">13073.03</span>
                        <span id="intVinPotMax">42825.83</span>
                    </td>
                </tr>
                </tbody>*/}
                <tbody>
                <tr>
                    <td colSpan="2" className="selections">Selections: <a className="selectionss">{couponData.noOfCombos}</a></td>
                    <td colSpan="2" className="amount">
                        <span>Amount:</span>
                        <input
                            id="stakeIntegral"
                            type="text"
                            value={couponData.stake}
                            maxLength="5"
                            onChange={(e) => updateSystemWinnings(e.target.value,'max')} />
                        <div onClick="preReset_int();" className="small-button">Clear</div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div className="default-bets">
                            {amounts && amounts.map(amount => <div key={amount} className="single-bet" onClick={() => dispatch(updateSystemWinnings(parseInt(amount), 'max'))}>
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
