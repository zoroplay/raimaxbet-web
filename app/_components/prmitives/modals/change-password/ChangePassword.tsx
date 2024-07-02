"use client";
import React, { useEffect } from "react";
import "./ChangePassword.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import validate, {
  composeValidators,
  passwordMatch,
  required,
} from "@/_validations/validations";
import { HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { useChangePasswordMutation } from "@/_services/auth.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";

const ChangePassword = () => {
  const dispatch = useDispatch();

  const onSubmit = (values: { [key in string]: string }) => {
    rtkMutation(ChangePassword, {
      oldPassword: values.password,
      password: values.new_password,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    });
  };

  const [ChangePassword, { isError, isLoading, data, error }] =
    useChangePasswordMutation();

  useEffect(() => {
    data?.success &&
      dispatch(
        openModal({
          title: "SUCCESS",
          message: "Password reset successful",
          success: true,
        })
      );

    data?.success && dispatch(closeComponentModal());

    data?.success === false &&
      dispatch(
        openModal({ title: "Password Change Failed", message: data?.message })
      );
    isError &&
      dispatch(
        openModal({
          title: "Password Change Failed",
          message: `${formatErrorResponse(error) || "An error occured"}`,
        })
      );
  }, [data, isError, dispatch, error]);

  return (
    <div className="change_pass">
      <div className="between">
        <div className="change_pass_title">CHANGE PASSWORD</div>
        <div
          className="change_close"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid }) => (
          <form onSubmit={handleSubmit}>
            <div className="input_wrap mb_30">
              <Field
                name="password"
                component={Input}
                label={"Old Password"}
                password
                color="#182220"
                validate={required("Old Password")}
              />
            </div>
            <div className="input_wrap mb_30">
              <Field
                name="new_password"
                component={Input}
                label={"New Password"}
                password
                color="#182220"
                validate={composeValidators(
                  required("New Password")
                  // passwordMatch
                )}
              />
            </div>
            {/* <div className="input_wrap">
              <Field
                name="new_password"
                component={Input}
                label={"Confirm Password"}
                password
                validate={composeValidators(
                  required("Confirm New Password"),
                  passwordMatch
                )}
              />
            </div> */}
            <Button
              text="Submit"
              type="submit"
              disabled={!valid}
              loading={isLoading}
            />
          </form>
        )}
      />
    </div>
  );
};

export default ChangePassword;
