import React from "react";
import "./Kyc.scss";
import { Button } from "@/_components";

const Kyc = () => {
  return (
    <div className="kyc">
      <div className="kyc_title">PLEASE INSERT A DOCUMENT</div>
      <Button text="ADD KYC" className="kyc_btn" />
    </div>
  );
};

export default Kyc;
