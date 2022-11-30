import React, { useRef, useState, useEffect } from "react";
import Others from "../layout/Others";
import {
  confirmVerification,
  sendOtp,
  sendVerification,
  verifyCode,
} from "../../Services/apis";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";

export default function Verify({ history }) {
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const [otpStatus, setOtpStatus] = useState({ loading: false, status: "" });
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!isAuthenticated) history.replace("/");
  }, [isAuthenticated]);

  useEffect(() => {
    if (user?.verified === 1) {
      history.replace("/");
    }
  }, [user]);

  useEffect(() => {
    sendSMS();
  }, [isAuthenticated]);

  const sendSMS = async () => {
    setSending(true);
    if (user?.verified === 0) {
      await sendOtp()
        .then((res) => {
          setSending(false);
          toast.success("Please check your phone for your verification code");
        })
        .catch((err) => {
          setSending(false);
          toast.error("Unable to send SMS. Please try again");
        });
    }
  };

  const [otpRef, setOtpRef] = useState({
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
    otp5: useRef(),
    otp6: useRef(),
  });

  const confirmOtp = async (otp) => {
    setOtpStatus({ ...otpStatus, loading: true });
    await verifyCode({ verification_pin: otp })
      .then((res) => {
        setOtpStatus({ ...otpStatus, loading: false });
        if (res.status) {
          window.location.reload(false);
          setOtpStatus({ ...otpStatus, status: "true" });
          toast.success(res?.message);
          history.push("/");
        } else {
          setOtpStatus({ ...otpStatus, status: "false" });
          toast.error(res.message);
        }
      })
      .catch((err) => {
        setOtpStatus({ ...otpStatus, loading: false });
        toast.error("Invalid verification code.");
      });
  };

  const otpController = (e, next, prev, index) => {
    if (e.target.value.length < 1 && prev) {
      const code = otp.slice(0, -1);
      if (index === 1) {
        setOtp(code);
      } else {
        setOtp("");
      }
      prev.current.focus();
    } else if (next && e.target.value.length > 0) {
      const code = otp + e.target.value;
      // add value to code
      setOtp(code);
      next.current.focus();
    } else {
      const code = otp + e.target.value;
      // add value to code
      setOtp(code);
      if (index === 5) {
        confirmOtp(parseInt(code));
      }
      return 0;
    }
  };
  return (
    <Others>
      <div className="forgot-password-page">
        <div className="grid">
          <div className="forgot-password-holder">
            <div className="block-title">
              <img src="/img/arrow-down.png" alt="" className="title-icon" />
              <span>Phone Number Verification </span>
            </div>
            <div className="forgot-password-content">
              <p className="head-tit">Enter OTP sent to your phone </p>
              <div className="form-holder">
                <div className="input-group">
                  <div className="dnxreg-box">
                    <div className="dnxreg-box-a">
                      <label htmlFor="" className="nxlabel">
                        Code from SMS*
                      </label>
                    </div>
                    <div className="dnxreg-box-b smsx-code">
                      <input
                        type="text"
                        ref={otpRef.otp1}
                        className="nxfield"
                        onChange={(e) => otpController(e, otpRef.otp2, "", 0)}
                        placeholder="-"
                        maxLength={1}
                      />
                      <input
                        type="text"
                        ref={otpRef.otp2}
                        className="nxfield"
                        onChange={(e) =>
                          otpController(e, otpRef.otp3, otpRef.otp1, 1)
                        }
                        placeholder="-"
                        maxLength={1}
                      />
                      <input
                        type="text"
                        ref={otpRef.otp3}
                        className="nxfield"
                        onChange={(e) =>
                          otpController(e, otpRef.otp4, otpRef.otp2, 2)
                        }
                        placeholder="-"
                        maxLength={1}
                      />
                      <input
                        type="text"
                        ref={otpRef.otp4}
                        className="nxfield"
                        onChange={(e) =>
                          otpController(e, otpRef.otp5, otpRef.otp3, 3)
                        }
                        placeholder="-"
                        maxLength={1}
                      />
                      <input
                        type="text"
                        ref={otpRef.otp5}
                        className="nxfield"
                        onChange={(e) =>
                          otpController(e, otpRef.otp6, otpRef.otp4, 4)
                        }
                        placeholder="-"
                        maxLength={1}
                      />
                      <input
                        type="text"
                        ref={otpRef.otp6}
                        className="nxfield"
                        onChange={(e) => otpController(e, "", otpRef.otp5, 5)}
                        placeholder="-"
                        maxLength={1}
                      />
                      <div style={{ margin: "auto" }}>
                        {otpStatus.loading ? (
                          <i
                            className="fa fa-spin fa-spinner"
                            style={{ color: "white" }}
                          />
                        ) : (
                          {
                            true: (
                              <i
                                className="fa fa-check"
                                style={{ color: "green" }}
                              />
                            ),
                            false: (
                              <i
                                className="fa fa-times"
                                style={{ color: "red" }}
                              />
                            ),
                          }[otpStatus.status]
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="aqx-loax-b">
                  <button
                    className="aqx-loax-btn"
                    onClick={() => sendSMS()}
                    disabled={sending}
                  >
                    Re-Send OTP{" "}
                    {sending && <i className="fa fa-spin fa-spinner" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Others>
  );
}
