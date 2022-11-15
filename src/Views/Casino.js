import React from "react";

import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";

export default function Casino() {
  const { user } = useSelector((state) => state.auth);

  return (
    <JackpotLayout>
      <iframe
        title="casino"
        style={{ width: "100%", border: 0, height: "100vh" }}
        src={`https://ui.io.co.ke/?cid=1&token=${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`}
      />
    </JackpotLayout>
  );
}
