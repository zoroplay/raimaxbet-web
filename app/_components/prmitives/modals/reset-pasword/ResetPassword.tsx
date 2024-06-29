"use client";
import React, { useEffect } from "react";
import "./ResetPassword.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import { IoArrowBack } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { Oval } from "react-loader-spinner";
import validate, {
  composeValidators,
  passwordMatch,
  required,
} from "@/_validations/validations";
import { useResetPasswordMutation } from "@/_services/auth.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";

interface ResetPasswordProps {
  data: string;
}

const ResetPassword = ({ data }: ResetPasswordProps) => {
  const dispatch = useAppDispatch();

  const [
    resetPassword,
    { data: resetData, isSuccess, isError, isLoading, error },
  ] = useResetPasswordMutation();

  const onSubmit = (values: { [key in string]: string }) => {
    rtkMutation(resetPassword, {
      username: data,
      password: values.confirm_password,
    });
  };

  useEffect(() => {
    resetData?.success &&
      dispatch(
        openModal({
          title: "Succesful!",
          message: "Password reset successful",
          success: true,
        })
      );

    resetData?.success && dispatch(closeComponentModal());

    resetData?.success === false &&
      dispatch(
        openModal({
          title: "Password Change Failed",
          message: resetData?.message,
        })
      );
    isError &&
      dispatch(
        openModal({
          title: "Password Change Failed",
          message: `${formatErrorResponse(error) || "An error occured"}`,
        })
      );
  }, [resetData, isError, dispatch, error]);

  return (
    <div className="reset_pass">
      <div className="between reset_pass_icons_wrap">
        <div
          className="reset_pass_icon"
          onClick={() => dispatch(openModal({ component: "VerifyNumber" }))}
        >
          <IoArrowBack />
        </div>
        <div
          className="reset_pass_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      {isLoading ? (
        <div className="center col reset_pass_loading">
          <div className="reset_pass_loading_item">
            <Oval
              height="25"
              width="25"
              color={"#ffffff"}
              ariaLabel="three-dots-loading"
              visible={true}
            />
          </div>
          <div className="reset_pass_loading_title">Reseting Password</div>
        </div>
      ) : (
        <div className="reset_pass_wrap center col">
          <div className="reset_pass_title">Reset My Password</div>
          <div className="reset_pass_text">
            Input your new password to proceed
          </div>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, valid }) => (
              <form onSubmit={handleSubmit} className="reset_pass_form">
                <div className="reset_pass_input_wrap mb_10">
                  <Field
                    name="password"
                    component={Input}
                    password
                    color={"#ffffff"}
                    className="reset_pass_input"
                    validate={required("New Password")}
                    placeholder="Password"
                  />
                </div>
                <div className="reset_pass_input_wrap mb_10">
                  <Field
                    name="confirm_password"
                    component={Input}
                    password
                    color={"#ffffff"}
                    className="reset_pass_input"
                    placeholder="Confirm Password"
                    validate={composeValidators(
                      required("Confirm New Password"),
                      passwordMatch
                    )}
                  />
                </div>
                <Button
                  text="Reset"
                  type="submit"
                  className="reset_pass_btn"
                  //   loading={isLoading}
                  disabled={!valid}
                />
              </form>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
