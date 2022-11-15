import React, { useState, useEffect } from "react";
import "../../Assets/scss/_deposit.scss";
import { getAllBanks, bankWithdrawal } from "../../Services/apis";
import { ErrorPopUp, SuccessPopUp } from "../../Utils/toastify";
import { useSelector } from "react-redux";

export const WithdrawalToBank = ({ history }) => {
  const [loading, setLoading] = useState();
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState(0);
  const [errMsg, setErrMsg] = useState("");
  const [err, setErr] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [inputObject, setObject] = useState({
    amount: 0,
    bank_id: "",
    bankCode: "",
    account: 0,
  });

  const handleChange = (e) => {
    e.preventDefault();
    setObject({
      ...inputObject,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const fetchBanks = (page) => {
    setLoading(true);

    getAllBanks()
      .then((res) => {
        setLoading(false);
        setData(res);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const updateAmount = (value) => {
    if (value === 0) {
      setObject({ ...inputObject, amount: 0 });
      return;
    }
    let currentAmount = amount;
    if (currentAmount === "") {
      currentAmount = 0;
    }
    const newAmount = inputObject.amount + value;
    setObject({ ...inputObject, amount: newAmount });
  };

  const withdraw = () => {
    const bankItem = data.find((u) => u.code == inputObject?.bankCode);
    const payload = {
      amount: parseInt(inputObject.amount, 10),
      bank_id: bankItem?.bank_id,
      bank_code: inputObject?.bankCode,
      account_number: inputObject?.account,
      account_type: "nuban",
    };
    if (
      inputObject?.bankCode === "" ||
      inputObject?.account === "" ||
      inputObject?.bankCode === ""
    ) {
      setErrMsg("All fields are required");
      setErr(true);
    } else {
      bankWithdrawal(payload)
        .then((r) => {
          if (r.success) {
            SuccessPopUp(r.message);

            setLoading(false);
          } else {
            ErrorPopUp(r.message);
            setLoading(false);
          }
          setLoading(false);
          // SuccessPopUp("Successfully sent request");
        })
        .catch((err) => {
          ErrorPopUp("Error occured");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.email === null) {
      history.replace("/Account/PersonalDetails");
    }
  }, [user]);

  return (
    <div className="deposit">
      <div className="deposit-step">
        <div className="left">
          <h3>NOTE</h3>
          <p className="my-1 text-1">
            For easier and faster process verification, please ensure your bank
            account information matches the details in your OurBet account.
          </p>
          <p className="my-1 text-1">
            In line with the regulation, winings above <strong>#400,000</strong>
            require a valid means of ID for your withdrawal to be processed
            promptly. Simply email cs@...com with your user ID and a picture of
            your <strong> valid ID card.</strong>
          </p>
          <p className="my-1 text-1">
            <strong>IMPORTANT UPDATE</strong> Payouts to{" "}
            <strong>FIRST BANK </strong> accounts take longer than 48hours due
            to <strong>delays from the bank. </strong>
          </p>
        </div>
        <div className="right">
          <h3 className="">Withdrawal</h3>
          {/* <div className="flex by-1">
            <p onClick={() => updateAmount(1000)}>Total Balance: </p>
            <h5> N65,00000</h5>
          </div> */}
          <div>
            {/* <div className="form-input">
              <input
                name="amount"
                min={500}
                value={inputObject.amount}
                onChange={handleChange}
                type="number"
                className="deposit-input"
                step="100"
                maxLength={5}
                max="10000"
              />
              <div className="form-input--stake"> Min 100</div>
            </div> */}
            <div className=" my-1">
              <label className="">Amount:</label>
              <input
                name="amount"
                value={inputObject.amount}
                onChange={handleChange}
                type="number"
                className="deposit-input"
              />
            </div>
            <div className="quickstake mt10">
              <div className="quickstake__item" onClick={() => updateAmount(0)}>
                {" "}
                Clear
              </div>
              <div
                className="quickstake__item"
                onClick={() => updateAmount(1000)}
              >
                {" "}
                +1000
              </div>
              <div
                className="quickstake__item"
                onClick={() => updateAmount(2000)}
              >
                {" "}
                +2000
              </div>
              <div
                className="quickstake__item"
                onClick={() => updateAmount(5000)}
              >
                {" "}
                +5000
              </div>
              <div
                className="quickstake__item"
                onClick={() => updateAmount(10000)}
              >
                {" "}
                +10,000
              </div>
            </div>

            <div className=" my-1">
              <label className="">Bank:</label>
              <select
                name="bankCode"
                type="text"
                onChange={(e) => handleChange(e)}
              >
                <option value="Card">Select a bank..</option>
                {data &&
                  data?.map((item, i) => (
                    <option value={item.code} key={i}>
                      {item?.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className=" my-1">
              <label className="">Account Number:</label>
              <input name="account" type="text" className="deposit-input" />
            </div>
            <div className=" my-1">
              <label className="">Total Withdrawal:</label>
              <input
                name="amount"
                type="text"
                disabled={true}
                className="deposit-input"
                value="N1,0000"
              />
            </div>
          </div>
          {err && <p className="error">{errMsg}</p>}
          <div className="btn-bank">
            <button onClick={withdraw}>PROCEED</button>
          </div>
        </div>
      </div>
    </div>
  );
};
