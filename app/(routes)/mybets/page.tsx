import React, { useState } from "react";
import "./mybets.scss";
import { SelectTab } from "@/_components";
import { MyBetsBlock } from "@/_blocks";

const Page = () => {
  return (
    <div className="mybets">
      <MyBetsBlock />
    </div>
  );
};

export default Page;
