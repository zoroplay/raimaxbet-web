"use client";
import React, { Dispatch, SetStateAction, useEffect } from "react";
import "./LoginModal.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import { ImCancelCircle } from "react-icons/im";
import { AiFillLock } from "react-icons/ai";
import { useLoginMutation } from "@/_services/auth.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import Link from "next/link";
import { formattedPhoneNumber } from "@/_utils/helpers";

interface LoginModalProp {
  setIsLoginModal?: Dispatch<SetStateAction<boolean>>;
}

const LoginModal = ({ setIsLoginModal }: LoginModalProp) => {
  const [loginMutation, { isLoading, isSuccess, isError, data, error }] =
    useLoginMutation();

  const dispatch = useAppDispatch();

  const onSubmit = (values: { [key in string]: string | number }) => {
    rtkMutation(loginMutation, {
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      username: formattedPhoneNumber(values.username),
      password: values.password,
    });
    // console.log(values);
  };

  useEffect(() => {
    if (data) {
      data?.success &&
        dispatch(
          openModal({
            title: "Login Successful",
            message: "You have succesfully Logged in",
            success: true,
          })
        );

      data?.success && dispatch(closeComponentModal());

      !data?.success &&
        dispatch(
          openModal({
            title: "Error!",
            message: `${data?.error || "Invalid Inputs"}`,
            success: false,
          })
        );
    }

    isError &&
      dispatch(
        openModal({
          title: "Error!",
          message: `${formatErrorResponse(error) || "An error occured"}`,
          success: false,
        })
      );
  }, [isSuccess, isError, error, data, dispatch]);

  // console.log(error, "error");

  return (
    <div className="login_modal center">
      <div className="login_modal_wrap">
        <div className="between login_modal_title_wrap">
          <div className="login_modal_title">Login</div>
          <div
            className="login_modal_cancel"
            onClick={() => dispatch(closeComponentModal())}
          >
            <ImCancelCircle />
          </div>
        </div>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit }) => (
            <form className="login_modal_form" onSubmit={handleSubmit}>
              <div className="login_modal_form_item mb_10">
                <Field
                  name="username"
                  component={Input}
                  color="black"
                  number
                  label={"Phone Number"}
                />
              </div>
              <div>
                <Field
                  name="password"
                  component={Input}
                  password
                  label={"Password"}
                />
              </div>
              <div className="border" />
              <Button
                text="LOGIN"
                type="submit"
                className="login_modal_btn"
                loading={isLoading}
              />
            </form>
          )}
        />
        <div
          className="forgot_pass center"
          onClick={() => dispatch(openModal({ component: "VerifyNumber" }))}
        >
          <div className="forgot_pass_icon">
            <AiFillLock />
          </div>
          <div className="forgot_pass_text">Forgot Password</div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
