"use client";
import React, { useEffect, useState } from "react";
import "./VerifyNumber.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import { IoArrowBack } from "react-icons/io5";
import { HiMiniXMark } from "react-icons/hi2";
import validate, { required } from "@/_validations/validations";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { Oval } from "react-loader-spinner";
import Image from "next/image";
import { verified } from "@/_assets";
import { setRegisterDetails } from "@/_redux/slices/register.slice";
import { useVerifyUserMutation } from "@/_services/auth.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";

const VerifyNumber = () => {
  const [phone, setPhone] = useState("");
  const dispatch = useAppDispatch();

  const [verifyUser, { isError, isLoading, data, error }] =
    useVerifyUserMutation();

  const onSubmit = (values: { [key in string]: string }) => {
    setPhone(values.username);
    rtkMutation(verifyUser, values);
  };

  useEffect(() => {
    setTimeout(() => {
      data?.responseMessage === "SUCCESSFUL" &&
        dispatch(openModal({ component: "ResetPassword", data: phone }));
    }, 2000);
    // OtpReset

    data?.responseMessage === "Invalid User" &&
      dispatch(
        openModal({
          title: "Verification Failed",
          message: data?.responseMessage,
        })
      );
    isError &&
      dispatch(
        openModal({
          title: "Verification Failed",
          message: `${formatErrorResponse(error) || "An error occured"}`,
        })
      );
  }, [data, isError, dispatch, error]);

  return (
    <div className="ver_num">
      <div className="between ver_num_icons_wrap">
        {/* <div
          className="ver_num_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <IoArrowBack />
        </div> */}
        <div
          className="ver_num_icon"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      {isLoading ? (
        <div className="center col ver_num_loading">
          <div className="ver_num_loading_item">
            <Oval
              height="25"
              width="25"
              color={"#ffffff"}
              ariaLabel="three-dots-loading"
              visible={true}
            />
          </div>
          <div className="ver_num_loading_title">Verifying Mobile Number</div>
        </div>
      ) : data?.responseMessage === "SUCCESSFUL" ? (
        <div>
          <div className="center col ver_num_success">
            <div className="ver_num_success_img">
              <Image src={verified} height={200} width={200} alt="verified" />
            </div>
            <div className="ver_num_success_title">Verification Succesful</div>
            {/* <Button className="ver_num_btn" text="Proceed" /> */}
          </div>
        </div>
      ) : (
        <div className="ver_num_wrap center col">
          <div className="ver_num_title">Find My Account</div>
          <div className="ver_num_text">Input your number to proceed</div>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, valid }) => (
              <form onSubmit={handleSubmit} className="ver_num_form">
                <div className="ver_num_input_wrap mb_10">
                  <Field
                    name="username"
                    component={Input}
                    number
                    color="#fff"
                    className="ver_num_input"
                  />
                </div>
                <Button text="Next" type="submit" className="ver_num_btn" />
              </form>
            )}
          />
        </div>
      )}
    </div>
  );
};

export default VerifyNumber;
