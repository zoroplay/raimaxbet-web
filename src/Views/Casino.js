import React, { useEffect, useState } from "react";

import JackpotLayout from "./layout/JackpotLayout";
import { useSelector } from "react-redux";

export default function Casino() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [token, setToken] = useState('demo');

  useEffect(() => {
    if (isAuthenticated) {
      setToken(`${user?.auth_code}-${process.env.REACT_APP_SITE_KEY}`)
    }
  }, [isAuthenticated]);

  return (
    <JackpotLayout>
      <iframe 
        title="casino" 
        style={{ width: '100%', border: 0, height: '100vh'}} 
        src={`${process.env.REACT_APP_CASINO_URL}/?cid=${process.env.REACT_APP_CASINO_ID}&token=${token}}`} 
      />
    </JackpotLayout>
  );
}
