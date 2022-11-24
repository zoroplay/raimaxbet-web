import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PaystackButton } from "react-paystack";
import { getGatewayKeys, saveTransaction } from "../../Services/apis";
import { UPDATE_USER_BALANCE } from "../../Redux/types";
import { formatNumber } from "../../Utils/helpers";
import { toast } from "react-toastify";

const gateways = [
  { slug: "rave", name: "Flutterwave" },
  { slug: "monnify", name: "Monnify" },
  { slug: "paystack", name: "Paystack" },
];

export function Deposit({ history }) {
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState({
    slug: "monnify",
    name: "Monnify",
  });
  const [config, setConfig] = useState({
    txref: new Date().getTime(),
    customer_email: user.email,
    customer_phone: "",
    amount: "",
    PBFPubKey: "",
    contractCode: "",
    production: process.env.NODE_ENV === "production",
  });
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const dispatch = useDispatch();

  const updateAmount = (value) => {
    if (value === 0) {
      setConfig({ ...config, amount: 0 });
      return;
    }
    let currentAmount = config.amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = currentAmount + value;
    setConfig({ ...config, amount: newAmount });
  };

  const verifyPayment = (response) => {
    if (config.amount > 0) {
      if (response.message === "Approved") {
        setPaymentSuccess(
          `Success!! Your account has been credited with ${formatNumber(
            config.amount
          )}`
        );
        // update user balance
        dispatch({
          type: UPDATE_USER_BALANCE,
          payload: user.available_balance + config.amount,
        });

        response.paymentMethod = "paystack";
        response.channel = "mobile";
        response.amount = config.amount;
        setConfig({ ...config, amount: "" });
        saveTransaction(response);
        // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'Your'}})
      } else {
        // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'error', message: 'We were unable to process your request'}})
      }
    }
  };

  const getGateway = (gateway) => {
    setActiveTab(gateway);
    getGatewayKeys(gateway.slug)
      .then((res) => {
        if (res.success) {
          setConfig({
            ...config,
            PBFPubKey: res.pub_key,
            contractCode:
              gateway.slug === "monnify" ? res.monnify_contract_code : "",
          });
        } else {
          toast.error(res.message);
        }
      })
      .catch((err) => {
        toast.error(err.message);
      });
  };

  const onSuccess = (response) => {
    response.paymentMethod = activeTab.slug;
    response.channel = "website";
    response.amount = config.amount;

    switch (activeTab.slug) {
      case "rave":
        // console.log(response);
        if (response.charge_response_code === "00") {
          response.reference = response.tx_ref;
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.available_balance + config.amount,
          });

          saveTransaction(response);
        }
        break;
      case "paystack":
        if (response.message === "Approved") {
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.available_balance + config.amount,
          });

          saveTransaction(response);
        } else {
        }
        break;
      case "monnify":
        if (response.status === "SUCCESS") {
          setPaymentSuccess(
            `Success!! Your account has been credited with ${formatNumber(
              config.amount
            )}`
          );
          // update user balance
          dispatch({
            type: UPDATE_USER_BALANCE,
            payload: user.available_balance + config.amount,
          });
          response.reference = response.transactionReference;

          saveTransaction(response);
        }
        break;
    }
    setConfig({ ...config, amount: "" });
  };

  const onClose = (resp) => {
    console.log('closed', resp);
  };

  useEffect(() => {
    getGateway(activeTab);
  }, []);

  function payWithMonnify() {
    window.MonnifySDK.initialize({
      amount: config.amount,
      currency: "NGN",
      reference: "" + Math.floor(Math.random() * 1000000000 + 1),
      customerEmail: user.email,
      apiKey: config.PBFPubKey,
      contractCode: config.contractCode,
      paymentDescription: "Gaming Account funding",
      isTestMode: config.production,
      paymentMethods: ["CARD", "ACCOUNT_TRANSFER"],
      onComplete: function (response) {
        //Implement what happens when transaction is completed.
        onSuccess(response);
      },
      onClose: function (data) {
        //Implement what should happen when the modal is closed here
        console.log(data);
      },
    });
  }

  function payWithRave() {
    const raveModal = window.FlutterwaveCheckout({
      public_key: config.PBFPubKey,
      tx_ref: "FLW_" + Math.floor(Math.random() * 1000000000 + 1),
      amount: config.amount,
      currency: "NGN",
      payment_options: "card, banktransfer, ussd",
      redirect_url: "",
      customer: {
        email: user?.email,
        // phone_number: "08102909304",
        name: user?.username,
      },
      callback: (response) => {
        console.log('completed', response)
        onSuccess(response);
        raveModal.close();
      },
      onclose: (incomplete) => {
        console.log('closed', incomplete)
        if (incomplete === true) {
          // Record event in analytics

        }
      }
    });
  }

  useEffect(() => {
    if (user?.email === null) {
      history.replace("/Account/PersonalInfo");
    }
  }, [user]);

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
                      <div className="t-menu pl30 pr30">
                        {gateways.map((gateway) => (
                          <a
                            className={`t-menu__item ${
                              gateway.slug === activeTab.slug ? "active" : ""
                            }`}
                            onClick={() => getGateway(gateway)}
                            key={gateway.slug}
                            href="#"
                          >
                            <strong className="t-menu__item-title">
                              {" "}
                              {gateway.name}
                            </strong>
                          </a>
                        ))}
                      </div>
                      {paymentSuccess !== "" && (
                        <div className="info-box green">{paymentSuccess}</div>
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
                                  {process.env.REACT_APP_CURRENCY})
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
                                  value={config.amount}
                                  onChange={(e) =>
                                    setConfig({
                                      ...config,
                                      amount: e.target.value,
                                    })
                                  }
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
                            {
                              {
                                rave: (
                                  <button
                                    className="btn green mt20 mb20"
                                    onClick={() => payWithRave()}
                                  >
                                    {" "}
                                    Make Payment
                                  </button>
                                ),
                                monnify: (
                                  <button
                                    className="btn green mt20 mb20"
                                    onClick={payWithMonnify}
                                  >
                                    {" "}
                                    Make Payment
                                  </button>
                                ),
                                paystack: (
                                  <PaystackButton
                                    amount={config.amount * 100}
                                    email={user?.email}
                                    publicKey={config.PBFPubKey}
                                    onSuccess={verifyPayment}
                                    text="Make Payment"
                                    disabled={parseInt(config.amount) === 0}
                                    className="btn green mt20 mb20"
                                  />
                                ),
                              }[activeTab.slug]
                            }
                          </div>
                          <div className="mt20 txt-deepgray">
                            <h3 className="txt-darkgreen ">
                              {" "}
                              Instant {activeTab.name} Deposit
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
  );
}
