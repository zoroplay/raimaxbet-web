import React, { useEffect, useState } from "react";

import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";

export default function RocketMan() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [token, setToken] = useState('demo');

  useEffect(() => {
    if (isAuthenticated) {
      setToken(`${user?.code}-${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`)
    }
  }, [isAuthenticated]);

  return (
    <JackpotLayout>
      <iframe 
        title="casino" 
        style={{ width: '100%', border: 0, height: '100vh'}} 
        src={`https://cdn.rocketman.elbet.com/?token=${token}&version=desktop&companyId=170&language=en&currency=${process.env.REACT_APP_CURRENCY}`}
      />
    </JackpotLayout>
  );
}
