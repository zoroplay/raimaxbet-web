import React, { useRef, useState } from "react";
import Others from "../layout/Others";
import { confirmVerification, sendVerification } from "../../Services/apis";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { UPDATE_USERNAME } from "../../Redux/types";
import { formattedPhoneNumber } from "../../Utils/helpers";

export default function RecoverPassword({ history }) {
  const [sending, setSending] = useState(false);
  const { SportsbookGlobalVariable } = useSelector((state) => state.sportsBook);
  const [otpStatus, setOtpStatus] = useState({ loading: false, status: "" });
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();

  const [otpRef, setOtpRef] = useState({
    otp1: useRef(),
    otp2: useRef(),
    otp3: useRef(),
    otp4: useRef(),
    otp5: useRef(),
    otp6: useRef(),
  });

  const sendSMS = async (username) => {
    if (username !== "") {
      const dialCode = SportsbookGlobalVariable.DialCode.substring(1);

      setSending(true);
      await sendVerification({ username: dialCode+''+username }, 'forgot-password')
        .then((res) => {
          setSending(false);
          if (res.success) {
            setUsername(username);
            toast.success("Please check your phone for your verification code");
          } else {
            toast.error(res.message);
          }
          // console.log(res);
        })
        .catch((err) => {
          setSending(false);

          toast.error("Unable to send SMS. Please try again");
        });
    }
  };

  const confirmOtp = async (otp) => {
    const dialCode = SportsbookGlobalVariable.DialCode.substring(1);

    const phone = dialCode+''+formattedPhoneNumber(username);

    setOtpStatus({ ...otpStatus, loading: true });

    await confirmVerification({ otp, username: phone })
      .then((res) => {
        setOtpStatus({ ...otpStatus, loading: false });
        if (res.success) {
          dispatch({ type: UPDATE_USERNAME, payload: username });
          setOtpStatus({ ...otpStatus, status: "true" });
          setTimeout(() => {
            history.push("/Auth/ResetPassword");
          }, 2000);
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
              <span>Forgot Password</span>
            </div>
            <div className="forgot-password-content">
              <p className="head-titl">
                Enter your registered phone number to reset your password{" "}
              </p>
              <div className="form-holder">
                <div className="input-group">
                  <p className="label">Phone Number:</p>
                  <input
                    type="text"
                    name="username"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  {/* <p className="aqx-loax-a-info">
                                        <i className="fa fa-info-circle aqx-loax-a-info-ico" /> Do not include 0 when
                                        entering your number; start with 7 or 1</p> */}
                </div>
                <div className="aqx-loax-b">
                  <button
                    className="aqx-loax-btn"
                    onClick={() => sendSMS(formattedPhoneNumber(username))}
                    disabled={sending}
                  >
                    Send code{" "}
                    {sending && <i className="fa fa-spin fa-spinner" />}
                  </button>
                </div>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Others>
  );
}
