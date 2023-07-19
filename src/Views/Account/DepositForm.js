import { useEffect, useState } from "react";
import React, { useSelector } from "react-redux";
import { useParams } from "react-router";
import { initializeTransaction } from "../../Services/apis";

const DepositForm = ({ history}) => {
    const [amount, setAmount] = useState("");
    const [busy, setBusy] = useState(false);
    const [errMsg, setErrMsg] = useState(null);
    const { SportsbookGlobalVariable } = useSelector((state) => state.sportsBook);
    const { user } = useSelector((state) => state.auth);
    const {type} = useParams();
    const [paymentSuccess, setPaymentSuccess] = useState("");
  
    useEffect(() => {
      if (type !== 'sbengine' && user?.email === null) {
        history.replace("/Account/PersonalInfo");
      }
    }, [type]);

  const updateAmount = (value) => {
    if (value === 0) {
      setAmount(0);
      return;
    }
    let currentAmount = amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = currentAmount + value;
    setAmount(newAmount);
  };

  const submit = (e) => {
    e.preventDefault();
    setBusy(true);
    // dispatch({ type: SET_LOADIN, payload: { show: true, message: "" } });
    initializeTransaction({ amount: amount, payment_method: type })
      .then((res) => {
        setBusy(false);
        if (res.success) {
          setAmount("");
          if(type === 'sbengine') {
            setPaymentSuccess(res.data);
          } else {
            window.location.href = res.url;
          }
        } else {
          setErrMsg(res?.message);
        }
      })
      .catch((err) => {
        setBusy(false)
      });
  };

    return (
        <>
        <div id="MainContent" className="">
          <div className="Riquadro">
            <div className="CntSX">
              <div className="CntDX">
                <div className="payments">
                  <div className="RiquadroSrc">
                    <div className="Cnt">
                      <div>
                        <div className="page__head">
                          <div className="page__head-item">
                            <h1> Instant Deposit Cards</h1>
                          </div>
                        </div>
                        {paymentSuccess !== "" && (
                          <div className="info-box green">
                            {" "}
                            Your Deposit Pin is:{" "}
                            <strong>{paymentSuccess?.reference_no}</strong>
                            <br />
                            Take to any shop to complete your deposit.
                          </div>
                        )}
                        <div className="page__body pt15 pb15">
                          {/* <div className="wrap mt10">
                            <div className="pull-right txt-deepgray">
                              {" "}
                              All fields are required
                            </div>
                          </div> */}
                          <div className="divide-holder">
                            <div className="one-half">
                              <div
                                className="form-row"
                                style={{ paddingRight: "1rem" }}
                              >
                                <div className="form-label">
                                  <strong>
                                    {" "}
                                    Deposit Amount(
                                    {SportsbookGlobalVariable.Currency})
                                  </strong>
                                </div>
                                <div className="form-input">
                                  <input
                                    name="amount"
                                    className="big"
                                    type="number"
                                    autoComplete="off"
                                    step="100"
                                    maxLength="5"
                                    min="100"
                                    max="10000"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                  />
                                  <div className="form-input--stake">
                                    {" "}
                                    Min 100
                                  </div>
                                </div>
                                <div className="quickstake mt10">
                                  <div
                                    className="quickstake__item"
                                    onClick={() => updateAmount(0)}
                                  >
                                    {" "}
                                    Clear
                                  </div>
                                  <div
                                    className="quickstake__item"
                                    onClick={() => updateAmount(100)}
                                  >
                                    {" "}
                                    +100
                                  </div>
                                  <div
                                    className="quickstake__item"
                                    onClick={() => updateAmount(200)}
                                  >
                                    {" "}
                                    +200
                                  </div>
                                  <div
                                    className="quickstake__item"
                                    onClick={() => updateAmount(500)}
                                  >
                                    {" "}
                                    +500
                                  </div>
                                  <div
                                    className="quickstake__item"
                                    onClick={() => updateAmount(1000)}
                                  >
                                    {" "}
                                    +1000
                                  </div>
                                </div>
                              </div>
                              <button
                                className="btn green mt20 mb20"
                                onClick={submit}
                                    disabled={busy}
                                >
                                    {" "}
                                    {busy ? 'Processing...' : 'Make Payment'}
                            </button>
                            </div>
                            <div className="mt20 txt-deepgray">
                              <h3 className="txt-darkgreen ">
                                {" "}
                                Instant  Deposit
                              </h3>
                              <p className="">
                                There is <strong>no fee for deposits</strong> with
                                this payment method.<br></br> If your transaction
                                is authorized, your account will be credited
                                immediately.
                              </p>
                              <p className="">
                                You can <strong>cancel withdrawals</strong> that
                                have not yet been processed.
                              </p>
                              <p className="">
                                <strong className="txt-blue undefined">
                                  {" "}
                                  View Pending Withdrawals
                                </strong>
                              </p>
                            </div>
                          </div>
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
    )
}
export default DepositForm;