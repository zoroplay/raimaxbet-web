"use client";
import React, { useEffect, useState } from "react";
import "./Personal.scss";
import { Form, Field } from "react-final-form";
import { Button, Input } from "@/_components";
import {
  useGetUserDetailsQuery,
  useUpdateUserProfileMutation,
} from "@/_services/auth.service";
import { rtkMutation } from "@/_utils";
import { useAppDispatch } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";
import validate, { required } from "@/_validations/validations";

const Personal = () => {
  const [formState, setFormState] =
    useState<{ [key in string]: string | number }>();

  const { data } = useGetUserDetailsQuery("");

  const dispatch = useAppDispatch();

  const [updateUserProfile, { isLoading, isError, error, isSuccess }] =
    useUpdateUserProfileMutation();
  const onSubmit = (values: { [key in string]: string | number }) => {
    const body = {
      email: values.email,
      firstName: values.first_name,
      lastName: values.last_name,
      city: values.city,
      address: values.address,
      phoneNumber: values.phone_number,
      gender: values.gender,
    };

    rtkMutation(updateUserProfile, body);
    // console.log(body);
  };

  // console.log(formState);

  useEffect(() => {
    const obj: { [key in string]: string | number } = {};
    const details = data?.data;
    obj.first_name = details?.firstName || "";
    obj.last_name = details?.lastName || "";
    obj.city = details?.city || "";
    obj.address = details?.address || "";
    obj.phone_number = details?.phone || "";
    obj.gender = details?.gender || "";
    obj.email = details?.email || "";

    setFormState(obj);
  }, [data]);

  useEffect(() => {
    isSuccess &&
      dispatch(
        openModal({
          title: "Update successful",
          message: "Your profile has updated succesfully",
          success: true,
        })
      );
    isError &&
      dispatch(
        openModal({
          title: "Update Failed",
          message: "Your profile has update failed",
        })
      );
  }, [isError, isSuccess]);

  return (
    <div className="personal">
      <Form
        onSubmit={onSubmit}
        initialValues={formState}
        // validate={validate}
        render={({ handleSubmit, valid }) => (
          <form onSubmit={handleSubmit} className="personal_form_wrap">
            <div className="personal_input_wrap mb_30">
              <Field
                name="first_name"
                component={Input}
                label="First Name"
                placeholder="First Name"
                require={false}
                disabled={formState?.first_name ? true : false}
                // validate={required("First Name")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="last_name"
                component={Input}
                label="Last Name"
                placeholder="Last Name"
                require={false}
                disabled={formState?.last_name ? true : false}
                // validate={required("Last Name")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="email"
                component={Input}
                label="Email Address"
                placeholder="Email Address"
                require={false}
                disabled={formState?.email ? true : false}
                // validate={required("Email Address")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="city"
                component={Input}
                label="City"
                require={false}
                placeholder="City"
                disabled={formState?.city ? true : false}
                // validate={required("City")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="address"
                component={Input}
                label="Address"
                placeholder="Address"
                require={false}
                disabled={formState?.address ? true : false}
                // validate={required("Address")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="phone_number"
                component={Input}
                label="Phone Number"
                placeholder="Phone Number"
                require={false}
                disabled={formState?.phone_number ? true : false}
                // validate={required("Phone Number")}
              />
            </div>
            <div className="personal_input_wrap mb_30">
              <Field
                name="gender"
                component={Input}
                select
                options={{ Male: "Male", Female: "Female" }}
                label="Gender"
                require={formState?.gender ? true : false}
              />
            </div>
            <Button
              text={"Submit"}
              className="personal_input_btn"
              type="submit"
              loading={isLoading}
            />
          </form>
        )}
      />
    </div>
  );
};

export default Personal;
