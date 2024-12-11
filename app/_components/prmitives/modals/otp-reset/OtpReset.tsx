"use client";
import React, { useEffect, useState } from "react";
import "./OtpReset.scss";
import { rtkMutation } from "@/_utils";
import OtpInput from "react-otp-input";
import { IoArrowBack } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/_services/notification.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";

const OtpReset = () => {
  const [seconds, setSeconds] = useState(60);
  const [otp, setOtp] = useState("");

  const dispatch = useAppDispatch();

  const registerDetails = useAppSelector((state) => state.register);

  const [sendOtpMutation, { isLoading, isSuccess, isError, data, error }] =
    useSendOtpMutation();

  const [
    verifyOtpMutation,
    {
      isLoading: isLoadingVerify,
      isSuccess: isSuccessVerify,
      isError: isErrorVerify,
    },
  ] = useVerifyOtpMutation();

  const onSubmit = (values: { [key in string]: string | number }) => {
    // null
  };

  const countDown60 = () => {
    const timerInterval = setInterval(() => {
      setSeconds((prevSeconds) => {
        if (prevSeconds <= 0) {
          clearInterval(timerInterval);
          return prevSeconds;
        }
        return prevSeconds - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    countDown60();
    rtkMutation(sendOtpMutation, {
      username: { username: registerDetails },
      type: "forgot-password",
    });
  }, []);

  return (
    <div className="otp_reset">
      <div className="between otp_reset_icon_wrap">
        <div
          className="ver_num_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <IoArrowBack />
        </div>
        <div
          className="otp_reset_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <div className="otp_reset_wrap center col">
        <div className="between otp_reset_title">
          Enter Otp To Reset Password
        </div>
        <div className="otp_reset_sub">
          We have sent you 6-digit code to +21108142074224
        </div>

        <div className="otp_reset_inp_wrap center col">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            renderSeparator={<span></span>}
            renderInput={(props) => (
              <input {...props} className="otp_reset_inp" />
            )}
          />
          <div
            onClick={() => {
              isSuccess && setSeconds(60);
              isSuccess && countDown60();
              rtkMutation(sendOtpMutation, {
                username: registerDetails.phone,
              });
            }}
            className="otp_reset_resend"
          >
            Send Again {seconds > 0 && seconds}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpReset;
