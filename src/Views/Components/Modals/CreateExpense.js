import React, { useState, useEffect } from 'react';
import { formatDate, formatNumber } from "../../../Utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { CANCEL_BET, SHOW_EXPENSE_MODAL, CONFIRM_BET, SET_BET_PLACED, SHOW_LOGIN_MODAL, SHOW_TIPSTER_MODAL } from "../../../Redux/types";
import { placeBet, updateWinnings } from "../../../Redux/actions";
import { checkOddsChange, printTicket } from "../../../Utils/couponHelpers";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";
import { getAllExpenseType } from "../../../Redux/actions/expenses";
import { date } from 'yup';
import { postExpense, getExpenses } from '../../../Services/apis';

export default function ConfirmSlip({ toggle, isModal }) {
    const dispatch = useDispatch();
    const [inputObject, setObject] = useState({});
    const expenseData = useSelector((state) => state.expenses);
    const { user } = useSelector((state) => state.auth);
    const { expenseType, loading } = expenseData;
    const expenseTypes = expenseType && expenseType ? expenseType : [];

    useEffect(() => {
        dispatch(getAllExpenseType())
    }, [dispatch]);

    const close = () => {

        dispatch({ type: CONFIRM_BET, payload: false });
        dispatch({ type: SET_BET_PLACED, payload: null });
    }

    const handleChange = (e) => {
        e.preventDefault();
        setObject({
            ...inputObject,
            [e.target.name]: e.target.value
        });
    }

    const creatExpense = async (e) => {
        e.preventDefault();
        const payload = {
            date: new Date(),
            expenseType_id: inputObject.expense,
            branch_id: user?.id,
            user_id: user?.id,
            amount: inputObject.amount,
            comment: inputObject.comment
        }
        await dispatch(postExpense(payload))
        await dispatch(getExpenses())
        await toggle()
    }

    console.log(expenseTypes, user)

    // const confirmBet = async (e) => {
    //     if (coupon.hasLive) {
    //         // set button ele
    //         const ele = document.getElementById('placeBetBtn');
    //         ele.disabled = true;
    //         ele.innerHTML = 'Verifying...';

    //         try {
    //             const oddsChanged = await checkOddsChange(coupon, dispatch, SportsbookGlobalVariable, SportsbookBonusList);

    //             if (oddsChanged) { // if odds have changed, close modal
    //                 ele.disabled = false;
    //                 ele.innerHTML = 'Place Bet';
    //                 close();
    //                 toast.error('Some odds have changed. Please confirm your bets to proceed');
    //             } else {
    //                 dispatch(placeBet(ele, 'bet', giftCode));
    //             }
    //         } catch (e) {
    //             ele.disabled = false;
    //             ele.innerHTML = 'Place Bet';
    //             toast.error('We were unable to process your bet. Please try again');
    //         }
    //     }else {
    //         // console.log(e)
    //         dispatch(placeBet(e,'bet', giftCode));
    //     }
    // }

    return (
        <>
            {isModal ?
                <>
                    <div id="popupPrenotatoreSco">
                        <div className='expense-modal-header'>
                            <div className="divTitle close-icon" id="PCDTitle"><a onClick={toggle} id="popupPrenotatoreScoClose"></a></div>
                        </div>
                        <div className='modal-header'>
                            <h2>New Expense</h2>
                        </div>
                        <div id="divBody">
                            <div className="prenSco" id="prenSco">
                                <div id="bookDett">
                                    <form className='expense-form'>
                                        <div className='expense-input'>
                                            <label>EXPENSE</label>
                                            <select onChange={handleChange} name="expense">
                                                <option value="">Select</option>
                                                {loading ? "Loading..." : expenseTypes.map(type => (
                                                    <option value={type?.id}>{type?.title}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='expense-input'>
                                            <label>AMOUNT</label>
                                            <input type="number" onChange={handleChange} name="amount" />
                                        </div>
                                        <div className='expense-input'>
                                            <label>COMMENT</label>
                                            <input type="text" onChange={handleChange} name="comment" />
                                        </div>
                                        <div className='expense-btn'>
                                            <input
                                                type="button"
                                                name="expenses"
                                                value=" CREATE"
                                                id="ac_w_PC_PC_btnAvanti" className="button"
                                                onClick={(e) => creatExpense(e)}
                                            />
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="backgroundPrenotatoreSco" onClick={close} />
                </>
                : ""}
        </>
    )
}
