"use client";
import React, { useEffect, useState } from "react";
import "./otp.scss";
import { Button, Input } from "@/_components";
import { Form, Field, FormSpy } from "react-final-form";
// import { ImCheckmark } from "react-icons/im";
import { useRegisterMutation } from "@/_services/auth.service";
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
} from "@/_services/notification.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAppDispatch } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/_hooks";
import validate, { required } from "@/_validations/validations";

const Page = () => {
  const [seconds, setSeconds] = useState(60);
  const [isRegistered, setIsRegistered] = useState(false);
  const [codeCount, setCodeCount] = useState("");

  const router = useRouter();
  const registerDetails = useAppSelector((state) => state.register);
  const { token } = useAppSelector((state) => state.user);

  // rtk mutations
  const [sendOtpMutation, { isSuccess, isError, data, error, isLoading }] =
    useSendOtpMutation();
  const [
    verifyOtpMutation,
    {
      isSuccess: isSuccessVerify,
      data: dataVerify,
      isError: isErrorVerify,
      error: errorVerify,
      isLoading: isLoadingVerify,
    },
  ] = useVerifyOtpMutation();
  const [
    registerMutation,
    {
      data: registerData,
      isSuccess: isSuccessRegister,
      isError: isErrorRegister,
      error: errorRegister,
      isLoading: isLoadingRegister,
    },
  ] = useRegisterMutation();

  // coundown timer func
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

  const handleResendClick = () => {
    countDown60();
  };

  const dispatch = useAppDispatch();

  const onSubmit = (value: { [key in string]: string | number }) => {
    rtkMutation(verifyOtpMutation, {
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      phoneNumber: registerDetails.phone,
      code: value.code,
    });
  };

  useEffect(() => {
    token !== null && router.push("/");
  }, [token]);

  useEffect(() => {
    countDown60();
  }, []);

  useEffect(() => {
    if (dataVerify?.status && !isRegistered) {
      rtkMutation(registerMutation, registerDetails);
      setIsRegistered(true);
    }
    if (registerData?.success && registerData?.status !== 409) {
      // rtkMutation(loginMutation, registerDetails);
      dispatch(
        openModal({
          title: "Registration Successful",
          message: "You have succesfuly registered on Raimax Bet",
          success: true,
        })
      );
      router.push("/");
    }

    dataVerify?.status === false &&
      dispatch(
        openModal({
          title: "OTP Verification Failed",
          message: `${dataVerify?.message || "An error occured"} `,
          success: false,
        })
      );

    (isErrorRegister || registerData?.status === 409) &&
      dispatch(
        openModal({
          title: "Registration Failed",
          message: `${
            formatErrorResponse(errorRegister) ||
            registerData?.error ||
            "An error occured"
          } `,
          success: false,
        })
      );
  }, [
    dataVerify?.status,
    registerData,
    isErrorRegister,
    dispatch,
    errorVerify,
  ]);

  // set the verification and registration status to false when the register details change or otp is resent
  useEffect(() => {
    setIsRegistered(false);
  }, [isSuccessVerify]);

  return (
    <div className="register center col">
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid }) => (
          <form onSubmit={handleSubmit} className="form_wrap">
            <div className="form_wrap_item">
              <Field
                name="code"
                component={Input}
                label={"Verification Code"}
                placeholder={"Please enter verification code*"}
                validate={required("Verification Code")}
              />
            </div>
            <Button
              text="REGISTER"
              type="submit"
              className="reg_btn"
              disabled={!(codeCount?.length > 3)}
              loading={isLoadingVerify || isLoadingRegister}
            />
            <Button
              text={`RESEND VERIFICATION CODE ${seconds > 0 ? seconds : ""}`}
              className="reg_btn_resend"
              loading={isLoading}
              disabled={seconds > 0}
              style={{ opacity: seconds > 0 ? 0.6 : 1 }}
              onClick={() => {
                isSuccess && setSeconds(60);
                isSuccess && countDown60();
                setIsRegistered(false);
                rtkMutation(sendOtpMutation, {
                  clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                  phoneNumber: registerDetails.phone,
                });
              }}
            />
            <Button
              text="BACK"
              className="reg_btn"
              onClick={() => router.back()}
              // loading={isLoading}
            />
            <FormSpy
              subscription={{ values: true }}
              onChange={(props) => {
                setCodeCount(props.values.code);
              }}
            />
          </form>
        )}
      />
    </div>
  );
};
export default Page;
