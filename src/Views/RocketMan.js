import React, { useEffect, useState } from "react";

import JackpotLayout from "./layout/JackpotLayout";
import { useDispatch, useSelector } from "react-redux";
import { SHOW_LOGIN_MODAL } from "../Redux/types";

export default function RocketMan() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [token, setToken] = useState("demo");
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      setToken(
        `${user?.code}-${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`
      );
    } else {
      dispatch({ type: SHOW_LOGIN_MODAL });
    }
  }, [isAuthenticated]);

  return (
    <JackpotLayout>
      <iframe
        title="casino"
        style={{ width: "100%", border: 0, height: "100vh" }}
        src={`https://cdn.rocketman.elbet.com/?token=${token}&version=desktop&companyId=170&language=en&currency=${process.env.REACT_APP_CURRENCY}`}
      />
    </JackpotLayout>
  );
}
