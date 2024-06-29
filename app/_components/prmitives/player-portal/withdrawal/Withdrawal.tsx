"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./Withdrawal.scss";
import { Form, Field, FormSpy } from "react-final-form";
import { Button, Input } from "@/_components";
import validate, { required } from "@/_validations/validations";
import {
  useGetAllBanksQuery,
  useGetAccountsQuery,
  useWithdrawMutation,
  useVerifyAccountMutation,
} from "@/_services/withdrawal.service";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeModal, openModal } from "@/_redux/slices/modal.slice";

const Withdrawal = () => {
  const [isNew, setIsNew] = useState(false);
  const [isVerify, setIsVerify] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  // const [shouldReset, setShouldReset] = useState(false);

  const [formValue, setFormValue] = useState<{
    [key in string]: string | number;
  }>({});

  const user = useAppSelector((state) => state.user.user);

  const { data: allBanksData } = useGetAllBanksQuery("");
  const { data: allAccountsData } = useGetAccountsQuery(user?.id);
  const [
    withdrawMutation,
    { data: withdrawData, isLoading, isError, isSuccess, error },
  ] = useWithdrawMutation();

  const [
    verifyMutation,
    {
      data: verifyData,
      isLoading: isLoadingVerify,
      isError: isErrorVerify,
      isSuccess: isSuccessVerify,
      error: errorVerify,
    },
  ] = useVerifyAccountMutation();

  const dispatch = useAppDispatch();

  const banks = useMemo(() => {
    return allBanksData?.reduce(
      (acc: { [key in string]: string }, val: any) => {
        const name = val?.name;
        return { ...acc, [name]: name };
      },
      {}
    );
  }, [allBanksData]);

  const getAccounts = useCallback(() => {
    return allAccountsData?.data?.reduce(
      (acc: { [key in string]: string }, val: any) => {
        const name = val?.bankCode;
        return { ...acc, [name]: val };
      },
      {}
    );
  }, [allAccountsData]);

  // handle form submission
  const onSubmit = (values: { [key in string]: string }) => {
    isNew && isVerify
      ? rtkMutation(verifyMutation, {
          bankCode: values.bankCode,
          accountNumber: values.accountNumber,
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
        })
      : rtkMutation(withdrawMutation, {
          amount: values.amount,
          bankId: values.bankId,
          bankCode: values.bankCode,
          accountNumber: values.accountNumber,
          accountName: formValue?.accountName,
          clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
          type: "online",
        });
    // console.log(values, "val");
  };

  // handle request response
  useEffect(() => {
    withdrawData?.success &&
      dispatch(
        openModal({
          title: "SUCCESSFUL",
          message: withdrawData?.message,
          success: true,
        })
      );
    withdrawData?.success === false &&
      dispatch(
        openModal({
          title: "WITDRAWAL FAILED",
          message: withdrawData?.message,
        })
      );
    if (verifyData?.success) {
      setTimeout(() => {
        setIsVerify(false);
        setFormValue((prev) => ({
          ...prev,
          accountName: verifyData?.message,
        }));

        // setValue({ accountName: verifyData?.message });
      }, 1500);
    } else if (verifyData && !verifyData?.success) {
      dispatch(
        openModal({
          title: "VERIFICATION FAILED",
          message: verifyData?.message,
        })
      );
    }
  }, [
    isErrorVerify,
    isSuccess,
    isSuccessVerify,
    withdrawData?.success,
    withdrawData?.message,
    verifyData?.success,
    errorVerify,
    error,
    dispatch,
    verifyData,
  ]);

  console.log(formValue, "form");

  return (
    <div className="withdrawal">
      <div className="withdrawal_title">WITHDRAWAL</div>
      <Form
        onSubmit={onSubmit}
        validate={validate}
        render={({ handleSubmit, valid, form }) => {
          return (
            <form onSubmit={handleSubmit} className="withdrawal_form_wrap">
              <div className="withdrawal_input_wrap">
                <Field
                  name="amount"
                  component={Input}
                  label="WITHDRAWABLE AMOUNT"
                  type="number"
                  placeholder="0"
                  validate={required("Amount")}
                />
              </div>
              <div className="withdrawal_input_wrap">
                <Field
                  name="payment_account"
                  component={Input}
                  label="PAYMENT ACCOUNT"
                  type="number"
                  select
                  options={{
                    New: "New",
                    ...allAccountsData?.data?.reduce(
                      (acc: { [key in string]: string }, val: any) => {
                        const accountNumber = val?.accountNumber;
                        return { ...acc, [accountNumber]: val?.bankCode };
                      },
                      {}
                    ),
                  }}
                  validate={required("Payment Account")}
                />
              </div>
              {isNew && (
                <>
                  <div className="withdrawal_input_wrap">
                    <Field
                      name="bank"
                      component={Input}
                      label="BANKS"
                      type="number"
                      select
                      options={banks}
                      validate={required("Bank")}
                      initialValue={formValue?.bank || ""}
                    />
                  </div>
                  <div className="withdrawal_input_wrap">
                    <Field
                      name="accountNumber"
                      component={Input}
                      label="ACCOUNT NUMBER"
                      type="number"
                      placeholder="Account Number"
                      validate={required("Account Number")}
                      initialValue={formValue?.accountNumber || ""}
                    />
                  </div>
                  {verifyData && verifyData.success && (
                    <div className="withdrawal_input_wrap">
                      <Field
                        name="accountName"
                        component={Input}
                        label="ACCOUNT NAME"
                        initialValue={formValue?.accountName}
                        placeholder="Account Name"
                        disabled={true}
                      />
                    </div>
                  )}
                </>
              )}
              {isVerified && (
                <div className="info_text_wrap">
                  <div className="info_text">
                    Name: {formValue?.accountName}
                  </div>
                  <div className="info_text">
                    Account Number: {formValue?.accountNumber}
                  </div>
                  <div className="info_text">Bank: {formValue?.bank}</div>
                </div>
              )}
              <Button
                text={isNew && isVerify ? "VERIFY" : "WITHDRAWAL"}
                className="withdrawal_btn_wrap"
                type="submit"
                loading={isLoading || isLoadingVerify}
                disabled={!valid}
              />
              <FormSpy
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
              />
            </form>
          );
        }}
      />
    </div>
  );
};

export default Withdrawal;
