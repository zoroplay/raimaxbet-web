import React, { useEffect, useState} from 'react';
import CreateExpense from "../Components/Modals/CreateExpense";
import {useDispatch, useSelector} from "react-redux";
import {getAllExpenses} from "../../Redux/actions/expenses";

export default function Expenses() {
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false)
  const expenseData = useSelector((state) => state.expenses);
  const {expense, loading} = expenseData;
  const expenseDetail = expense && expense ? expense : [];


  useEffect(() => {
    dispatch(getAllExpenses())
    }, [dispatch]);


  const toggle = () => {
    setModal(!modal)
  }
  
  return (
    <div className="account">
       <div className="page__head">
         <div className="page__head-item app-flex-item">
           <h3> Expenses History</h3>
           <div className='account-head-btn'>
           <input
              type="button"
              name="expenses"
              value="+ Add Expense"
              id="ac_w_PC_PC_btnAvanti" className="button"
              onClick={toggle}
          />
           </div>
           </div>
      </div>
      <div>
        <table className="dgStyle" cellSpacing="0" border="0" id="ac_w_PC_PC_grid"
          style={{ borderWidth: '0px', borderStyle: 'None', width: '100%', borderCollapse: 'collapse' }}>
          <tbody >
            <tr className="dgHdrStyle">
              <th scope="col">S/N</th>
              <th align="center" scope="col">ID</th>
              <th align="center" scope="col">Date</th>
              <th className="dgHdrImporti" scope="col">Amount</th>
              <th align="center" scope="col">Transaction</th>
              <th align="center" scope="col">Comment</th>
            </tr>
            {loading ? 
            <tr  style={{ textAlign: 'center', width: "100%"}}><h3 >LOADING.....</h3> </tr>
             :
           expenseDetail && expenseDetail.map((expense, i) => (
            <tr className="dgItemStyle" >
              <td align="center"> {i+1}</td>
              <td align="center">
                {expense?.id}
              </td>
              <td align="center"> {expense?.date}</td>
              <td align="center">{expense?.amount}</td>
              <td align="center">
              {expense?.expensetype?.title}
              </td>
              <td align="center">{expense?.comment}</td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CreateExpense toggle={toggle} isModal={modal}/>
    </div>
  )
}
