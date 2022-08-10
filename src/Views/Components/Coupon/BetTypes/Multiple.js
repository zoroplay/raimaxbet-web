import {fastAdd, updateWinnings} from "../../../../Redux/actions";
import React from "react";

export const Multiple = ({couponData, dispatch, globalVar}) => {
    const amounts = process.env.REACT_APP_FAST_ADD_AMOUNTS.split(',');

    return (
        <div className="combination-group">
            <table id="tableMultiple">
                <tbody>
                <tr>
                    <td colSpan="2" className="selections">Selections: <a className="selectionss">{couponData.selections.length}</a></td>
                    <td colSpan="2" className="amount">
                        <span>Amount:</span>
                        <input
                            id="stakeMultiple"
                            type="text"
                            onChange={(e) => dispatch(updateWinnings(e.target.value))}
                            value={couponData.totalStake} />
                        <div onClick={() => dispatch(fastAdd(0))} className="small-button">Clear</div>
                    </td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div className="default-bets">
                            {amounts && amounts.map(amount => <div key={amount} className="single-bet btn-color-blue" onClick={() => dispatch(fastAdd(parseInt(amount)))}> {amount}</div>)}
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    )
}
