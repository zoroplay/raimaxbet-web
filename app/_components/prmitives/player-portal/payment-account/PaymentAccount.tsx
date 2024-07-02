import React from "react";
import "./PaymentAccount.scss";
import { Button } from "@/_components";

const PaymentAccount = () => {
  return (
    <>
      <div className="pay_acc">
        <div className="pay_acc_title">ADD NEW PAYMENT ACCOUNT</div>
        <Button text="ADD PAYMENT" className="pay_acc_btn" />
      </div>
      <div className="pay_accounts">
        <div className="pay_accounts_texts between">
          <div className="pay_accounts_title">PAYSTACK</div>
          <div className="pay_accounts_title_one">CREDIT</div>
        </div>
      </div>
    </>
  );
};

export default PaymentAccount;
