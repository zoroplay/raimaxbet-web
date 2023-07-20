import React from "react";
import { NavLink } from "react-router-dom";
import "../../Assets/scss/_deposit.scss";
import useSWR from "swr";
import { SHOW_INFO_UPDATE_MODAL } from "../../Redux/types";
import { useDispatch, useSelector } from "react-redux";


export function Deposit({ history }) {
  const {user} = useSelector(state => state.auth);
  const {data, error} = useSWR('utilities/payment-methods');
  const paymentMethods = data?.data || null;
  const dispatch = useDispatch();  

  const confirmDeposit = (provider) => {
    if (provider !== 'sbengine' && user?.email === null) {
      dispatch({type: SHOW_INFO_UPDATE_MODAL})
    } else {
      history.replace(`/Account/DepositWith/${provider}`)
    }
  }

  return (
    <>
      <div id="MainContent" className="">
        <div className="Riquadro">
          <div className="CntSX">
            <div className="CntDX">
              <div className="payments">
                <div className="RiquadroSrc">
                  <div className="Cnt">
                  <div className="deposit">
                    <div className="deposit-table">
                      <div className="deposit-table-head">
                        <div className="first">
                          <h3 className="table-head"></h3>
                        </div>
                        <div className="second">
                          <h4 className="table-head">Payment Method</h4>
                        </div>
                        <div className="third">
                          <h4 className="table-head">Fee</h4>
                        </div>
                        <div className="fourth">
                          <h4 className="table-head">Minimum Amount</h4>
                        </div>
                        <div className="fifth">
                          <h4 className="table-head"></h4>
                        </div>
                      </div>
                      {!paymentMethods ? 
                        <div className="deposit-table-body" style={{textAlign: 'center', width: '100%', display: 'block'}}>
                          <h1>Fetching Data...</h1>
                        </div>
                      :
                      paymentMethods?.map((item, index) => (
                        <div className="deposit-table-body" key={index}>
                          <div className="first">
                            <img src={`/img/${item?.provider}.png`} alt="logo" />
                          </div>
                          <div className="second">
                            <h4 className="">{item?.title}</h4>
                          </div>
                          <div className="third">
                            <h4 className="">None</h4>
                          </div>
                          <div className="fourth">
                            <h4 className="">1000</h4>
                          </div>
                          <div className="fifth">
                            <button className="btn">
                              <a onClick={() => confirmDeposit(item.provider)}>+ Deposit</a>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
