"use client";
import React, { useEffect } from "react";
import "./UpdateProfile.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import { useUpdateUserProfileMutation } from "@/_services/auth.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { HiMiniXMark } from "react-icons/hi2";
import validate, { required } from "@/_validations/validations";

const UpdateProfile = () => {
   const dispatch = useAppDispatch();

  const [updateUserProfile, { isLoading, isError, error, isSuccess }] =
    useUpdateUserProfileMutation();
    
  const onSubmit = (values: { [key in string]: string | number }) => {
    const body = {
      email: values.email,
      firstName: values.firstname,
      lastName: values.lastname,
    };
    rtkMutation(updateUserProfile, body);
    // console.log(body);
  };

  useEffect(() => {
    isError &&
      dispatch(
        openModal({
          title: "Update Failed",
          message: `${
            formatErrorResponse(error) || "An error occured, try again"
          }`,
        })
      );
    isSuccess &&
      dispatch(
        openModal({
          title: "Update succesful",
          message: "Your profile update was succesful",
          success: true,
        })
      );

    isSuccess && dispatch(openModal({ component: "DepositModal" }));
  }, [isSuccess, isError, error, dispatch]);
  return (
    <div className="update_profile">
      <div className="between">
        <div className="update_profile_title">PLAYERS DETAIL</div>
        <div
          className="update_profile_close"
          onClick={() => dispatch(closeComponentModal())}
        >
          <HiMiniXMark />
        </div>
      </div>
      <div className="update_profile_text">
        Please enter valid info into your details before proceeding
      </div>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="update_profile_form">
            <div className="update_profile_form_item">
              <Field
                name="firstname"
                component={Input}
                label="First Name"
                Placeholder="No Name"
                validate={required("First Name")}
              />
            </div>
            <div className="update_profile_form_item">
              <Field
                name="lastname"
                component={Input}
                label="Last Name"
                Placeholder="No Name"
                validate={required("Last Name")}
              />
            </div>
            <div className="update_profile_form_item">
              <Field
                name="email"
                component={Input}
                label="Email"
                Placeholder="123@frapapa.com"
                validate={required("Email Name")}
              />
            </div>
            <Button
              text="SUBMIT"
              className="update_profile_form_btn"
              type="submit"
              loading={isLoading}
            />
          </form>
        )}
      />
    </div>
  );
};

export default UpdateProfile;
