"use client";
import React, { useCallback, useEffect, useState } from "react";
import "./Transfer.scss";
import { RiRefreshLine } from "react-icons/ri";
import { Field, Form } from "react-final-form";
import validate, { required } from "@/_validations/validations";
import { Button, Input } from "@/_components/widgets";
import { useInitiateTransferMutation } from "@/_services/deposit.service";
import { rtkMutation } from "@/_utils";
import { openModal } from "@/_redux/slices/modal.slice";
import { useAppDispatch } from "@/_hooks";

const Transfer = () => {
  const [formValue, setFormValue] = useState<{
    [key in string]: string | number;
  }>({});
  const [transferMutation, { data, isLoading, isError, isSuccess, error }] =
    useInitiateTransferMutation();
  const dispatch = useAppDispatch();

  const onSubmit = (values: any) => {
    console.log("Submitting", values);
    dispatch(
      openModal({
        component: "ConfirmTransfer",
        data: { ...values },
      })
    );
  };

  // handle request response
  useEffect(() => {
    data?.success &&
      dispatch(
        openModal({
          title: "TRANSFER SUCCESSFUL",
          message: data?.message,
          success: true,
        })
      );
    data?.success === false &&
      dispatch(
        openModal({
          title: "TRANSFER FAILED",
          message: data?.message,
        })
      );
  }, [isSuccess, data?.success, data?.message, error, dispatch]);
  return (
    <div className="transfer">
      <div className="transfer_title">TRANSFER TO A RAIMAX USER</div>

      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid, form }) => {
          return (
            <form onSubmit={handleSubmit} className="input-block">
              <div className="input-box">
                <Field
                  name="toUsername"
                  component={Input}
                  label="PHONE NUMBER"
                  type="text"
                  placeholder="phone number"
                  validate={required("phone_number")}
                  initialValue={formValue?.toUsername || ""}
                />
              </div>

              <div className="input-box">
                <Field
                  name="amount"
                  component={Input}
                  label="AMOUNT"
                  type="number"
                  placeholder="0000"
                  validate={required("amount")}
                  initialValue={formValue?.amount || ""}
                />
              </div>
              <div className="input-box">
                <Field
                  name="pin"
                  component={Input}
                  label="PIN"
                  type="number"
                  placeholder="enter your pin"
                  validate={required("pin")}
                  initialValue={formValue?.pin || ""}
                />
              </div>

              <Button
                text={"PROCEED"}
                className="withdrawal_btn_wrap"
                type="submit"
                loading={isLoading}
                disabled={!valid}
              />
              {/* <FormSpy
                subscription={{ values: true }}
                onChange={(props) => {
                  // if (shouldReset) {
                  //   form.reset({});
                  //   setShouldReset(false);
                  // }
                  if (props.values?.payment_account === "New") {
                    setIsNew(true);
                    setIsVerify(true);
                    setIsVerified(false);
                    setFormValue((prev) => ({
                      ...prev,
                      accountNumber: "",
                      bank: "",
                      // accountName: "",
                      bankCode: "",
                    }));
                    if (props.values?.bank && !isVerified) {
                      const selectedBank = allBanksData?.find(
                        (item: any) => item?.name === props.values?.bank
                      );
                      props.values.bankId = selectedBank?.bank_id;
                      props.values.bankCode = selectedBank?.code;
                      props.values.bankName = selectedBank?.name;

                      setFormValue((prev) => ({
                        ...prev,
                        accountNumber: props.values?.accountNumber || "",
                        accountName: verifyData?.message || "",
                      }));
                    }
                  } else {
                    setIsNew(false);
                    setIsVerify(false);
                    setIsVerified(true);
                    setFormValue((prev) => ({
                      ...prev,
                      accountNumber: "",
                      bank: "",
                      accountName: "",
                      bankCode: "",
                    }));

                    if (props.values.payment_account) {
                      // all user account object
                      const accounts = getAccounts();
                      const details = accounts[props.values.payment_account];
                      // console.log(accounts[props.values.payment_account], "cj");
                      // setFormValue((prev) => ({
                      //   ...prev,
                      //   accountNumber: details?.accountNumber || "",
                      //   bank: details?.bankName || "",
                      //   accountName: details?.accountName || "",
                      //   bankCode: details?.bankCode || "",
                      // }));
                      const selectedBank = allBanksData?.find(
                        (item: any) => item?.code === details?.bankCode
                      );
                      setFormValue((prev) => ({
                        ...prev,
                        accountNumber: details?.accountNumber || "",
                        bank: selectedBank?.name || "",
                        accountName: details?.accountName || "",
                        bankCode: details?.bankCode || "",
                      }));
                      props.values.bankId = selectedBank?.bank_id;
                      props.values.bankCode = selectedBank?.code;
                      props.values.bankName = selectedBank?.name;
                      props.values.accountNumber = selectedBank?.code;
                    }
                  }

                  if (!props.values?.payment_account) {
                    setIsVerified(false);
                  }
                }}
              /> */}
            </form>
          );
        }}
      />
    </div>
  );
};

export default Transfer;
