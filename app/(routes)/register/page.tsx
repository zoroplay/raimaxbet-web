"use client";
import React, { useEffect, useState, useRef } from "react";
import "./register.scss";
import { Button, Input } from "@/_components";
import { Form, Field, FormSpy } from "react-final-form";
import { ImCheckmark } from "react-icons/im";
import { useSendOtpMutation } from "@/_services/notification.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { rtkMutation } from "@/_utils";
import { useVerifyUserMutation } from "@/_services/auth.service";
import {
  setRegisterDetails,
  setTrackingToken,
} from "@/_redux/slices/register.slice";
import { useRouter, useSearchParams } from "next/navigation";
import { openModal } from "@/_redux/slices/modal.slice";
import validate, { required } from "@/_validations/validations";
import { formattedPhoneNumber } from "@/_utils/helpers";

const Page = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedT, setIsCheckedT] = useState(false);
  const [isNewUser, isSetNewUser] = useState(false);
  const [userNameStatus, setUserNameStatus] = useState(false);
  const [dialCode, setDialCode] = useState("");
  const searchParams = useSearchParams();
  const clickId = searchParams.get("clickid");

  const initialValue = useRef<string>("");

  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);
  const registerDetails = useAppSelector((state) => state.register);
  const { token } = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const router = useRouter();
  // OTP mutation
  const [
    sendOtpMutation,
    {
      data,
      isSuccess: otpIsuccess,
      isError: otpIsError,
      error: otpErro,
      isLoading: otpLoading,
    },
  ] = useSendOtpMutation();

  const [verifyUserName, { data: userVerifyData }] = useVerifyUserMutation();

  useEffect(() => {
    token !== null && router.push("/");
  }, [token]);

  useEffect(() => {
    if (SportsbookGlobalVariable)
      setDialCode(SportsbookGlobalVariable.DialCode);
  }, [SportsbookGlobalVariable]);

  useEffect(() => {
    if (clickId) dispatch(setTrackingToken(clickId));
  }, [clickId]);

  const onSubmit = (values: { [key in string]: string | number | boolean }) => {
    // get operator country dial code
    const code = dialCode.substring(1);
    // build registration data
    const payload = {
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      username: formattedPhoneNumber(values.username), // format phone number to remove leading 0
      phone: code + "" + formattedPhoneNumber(values.username),
      password: values.password,
      promoCode: values?.promoCode || "",
      trackingId: clickId || registerDetails.trackingToken,
    };

    dispatch(setRegisterDetails(payload));

    rtkMutation(sendOtpMutation, {
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      phoneNumber: payload.phone, // submit phone number to receive OTP
    });
  };
  // console.log(data, error);

  useEffect(() => {
    data?.status && router.push("/register/otp");
    data?.status === false &&
      dispatch(
        openModal({ title: "An Error Occured", message: data?.message })
      );
  }, [otpIsuccess, data]);

  useEffect(() => {
    // isSuccessVerify && rtkMutation(registerMutation, registerDetails);
    // isSuccessRegister && rtkMutation(loginMutation, registerDetails);
    // isSuccessRegister &&
    //   dispatch(
    //     openModal({
    //       title: "Registration Successful",
    //       message: "You have succesfuly registered on Frapapa",
    //       success: true,
    //     })
    //   );
    otpIsError &&
      dispatch(
        openModal({
          title: "Send OTP Failed",
          message: `${"An error occured"} `,
          success: false,
        })
      );
  }, [otpIsError]);

  useEffect(() => {
    userVerifyData?.responseMessage === "SUCCESSFUL"
      ? isSetNewUser(false)
      : isSetNewUser(true);
  }, [userVerifyData]);

  return (
    <div className="register center col">
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid }) => (
          <form onSubmit={handleSubmit} className="form_wrap">
            <div className="register_title center">REGISTER</div>

            <div className="form_wrap_item mb_30">
              <Field
                name="username"
                component={Input}
                number
                color="black"
                label={"Phone Number"}
                placeholder={"User Name"}
                validate={required("Phone Number")}
              />
              {!isNewUser && userNameStatus && (
                <div className="verify_error">user already exist</div>
              )}
            </div>
            <div className="form_wrap_item mb_30">
              <Field
                name="password"
                component={Input}
                password
                label={"Password"}
                placeholder={"Password"}
                validate={required("Password")}
              />
            </div>
            <div className="form_wrap_item mb_30">
              <Field
                name="promoCode"
                required={false}
                component={Input}
                label={"Promotional Code"}
                placeholder={"Optional"}
              />
            </div>
            <div className="form_wrap_item mb_30">
              <Field
                name="agree"
                type="checkbox"
                render={({ input }) => (
                  <div className="start checkbox_wrap">
                    <input type="checkbox" className="check_input" {...input} />
                    <div
                      className={`checkbox center ${isChecked && "active"}`}
                      onClick={() => setIsChecked(!isChecked)}
                    >
                      {isChecked && <ImCheckmark />}
                    </div>
                    <div className="check_text">
                      I declare to be over 18 years
                    </div>
                  </div>
                )}
              />
            </div>
            <div className="form_wrap_item mb_30">
              <Field
                name="agree"
                type="checkbox"
                render={({ input }) => (
                  <div className="start checkbox_wrap">
                    <input type="checkbox" className="check_input" {...input} />
                    <div
                      className={`checkbox center ${isCheckedT && "active"}`}
                      onClick={() => setIsCheckedT(!isCheckedT)}
                    >
                      {isCheckedT && <ImCheckmark />}
                    </div>
                    <div className="check_text">
                      I accept the{" "}
                      <a href="https://www.frapapa.com/terms-and-conditions/">
                        terms and condition
                      </a>{" "}
                      of frapapa website
                    </div>
                  </div>
                )}
              />
            </div>
            <Button
              text="SEND REGISTRATION CODE"
              type="submit"
              className="reg_btn"
              loading={otpLoading}
              disabled={!valid || !isChecked || !isCheckedT || !isNewUser}
            />
            <FormSpy
              subscription={{ values: true }}
              onChange={(props) => {
                if (initialValue.current !== props.values.username) {
                  if (
                    props.values.username &&
                    props.values.username.length >= 10
                  ) {
                    setUserNameStatus(true);
                    rtkMutation(verifyUserName, {
                      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
                      username: props.values.username,
                    });
                  } else {
                    isSetNewUser(false);
                    setUserNameStatus(false);
                  }
                }
                initialValue.current = props.values.username;
              }}
            />
          </form>
        )}
      />
    </div>
  );
};
export default Page;
