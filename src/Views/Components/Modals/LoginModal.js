import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { LOADING, SET_USER_DATA, SHOW_LOGIN_MODAL } from "../../../Redux/types";
import { login } from "../../../Services/apis";
import { formattedPhoneNumber } from "../../../Utils/helpers";

export default function LoginModal({ dispatch }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState(false);

  const submitForm = (e) => {
    e.preventDefault();

    if (username === "" || password === "") {
      return;
    }

    dispatch({ type: LOADING });
    login(formattedPhoneNumber(username), password)
      .then((res) => {
        dispatch({ type: LOADING });

        dispatch({
          type: SET_USER_DATA,
          payload: {
            user: res.user,
            access_token: res.token,
            isAuthenticated: true,
          },
        });
        dispatch({ type: SHOW_LOGIN_MODAL });
      })
      .catch((err) => {
        console.log(err);
        dispatch({ type: LOADING });
        if (err?.response?.status === 401) {
          setErrMsg(true);
        }
      });
  };

  return (
    <div className="login-popup-wrapper" id="popupLogin">
      <div className="login-popup">
        <div
          className="close-coupon-popup"
          onClick={() => dispatch({ type: SHOW_LOGIN_MODAL })}
        >
          <i className="fa fa-times" aria-hidden="true" />
        </div>
        <div className="login-content">
          <div className="title">
            <img src="/img/check-icon.png" alt="" className="title-icon" />
            <span>Password reset successful</span>
          </div>
          <div className="alert-bar">
            <i className="fa fa-exclamation-triangle" aria-hidden="true" />
            Please login to continue
          </div>
          <form onSubmit={submitForm}>
            {errMsg && (
              <div className="row">
                <div className="info-error">Incorrect username or password</div>
              </div>
            )}
            <div className="row">
              <div className="label">Username</div>
              <input
                type="text"
                name="username"
                placeholder="Username"
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="label">Password</div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="off"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="row">
              <div className="forgot-text">
                Forgot Password?
                <NavLink
                  to="/Auth/RecoverPassword"
                  onClick={() => dispatch({ type: SHOW_LOGIN_MODAL })}
                >
                  {" "}
                  Click here
                </NavLink>{" "}
                to create a new one.
              </div>
            </div>
            <div className="button-holder">
              <NavLink
                to="/Auth/Register"
                onClick={() => dispatch({ type: SHOW_LOGIN_MODAL })}
              >
                <div className="register-button">Register</div>
              </NavLink>
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
