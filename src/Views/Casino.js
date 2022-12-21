import React from "react";

import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";

export default function Casino() {
  const { user } = useSelector((state) => state.auth);

  return (
    <JackpotLayout>
      <iframe title="casino" style={{ width: '100%', border: 0, height: '100vh'}} src={`${process.env.REACT_APP_CASINO_URL}/?cid=1&token=${user?.code}-${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`} />
    </JackpotLayout>
  );
}
