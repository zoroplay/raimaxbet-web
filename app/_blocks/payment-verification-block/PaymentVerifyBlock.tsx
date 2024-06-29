"use client";
import React, { useEffect, useState } from "react";
import "./PaymentVerifyBlock.scss";
import { Oval } from "react-loader-spinner";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useVerifyPaymentQuery } from "@/_services/deposit.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { useAwardBonusMutation } from "@/_services/bonus.service";
import { Empty } from "@/_components";
import { MdOutlineSmsFailed } from "react-icons/md";

const PaymentVerifyBlock = () => {
  const [ref, setRef] = useState<string | null>();
  const searchParams = useSearchParams();
  const params = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { activeBonus } = useAppSelector<any>((state) => state.user);

  const paystackRef = searchParams.get("trxref");
  const monnifyRef = searchParams.get("paymentReference");
  const paymentChannel = params.slug[0];

  const shouldQueryFire = paymentChannel !== undefined && ref !== undefined;

  const { data, isLoading, isError, isSuccess, error } = useVerifyPaymentQuery({
    paymentChannel,
    ref,
    skip: !shouldQueryFire,
  });

  const [awardBonus, { data: bonusData }] = useAwardBonusMutation();

  useEffect(() => {
    if (paymentChannel === "paystack") {
      setRef(paystackRef);
    }
    if (paymentChannel === "monnify") {
      setRef(monnifyRef);
    }
  }, [paymentChannel, monnifyRef, paystackRef]);

  useEffect(() => {
    isError &&
      dispatch(
        openModal({
          title: "Verification Failed",
          message: `${formatErrorResponse(error) || "An error occured"}`,
        })
      );

    if (data) {
      if (data.success) {
        dispatch(
          openModal({
            title: "Payment Verified",
            message: `Payment succesfuly verified`,
            success: true,
          })
        );
        if (activeBonus)
          rtkMutation(awardBonus, activeBonus);
        
        dispatch(closeComponentModal());
        router.push("/");
      }

      if (!data.success) {
        dispatch(
          openModal({
            title: "Verification Failed",
            message: `${data.message || "An error occured"}`,
          })
        );
      }
    }
  }, [data, isError, error, dispatch]);

  return (
    <div className="pay_verify center col">
      {isLoading ? (
        <>
          <Oval
            height={50}
            width={50}
            color="#4fa94d"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="oval-loading"
            secondaryColor="#4fa94d"
            strokeWidth={2}
            strokeWidthSecondary={2}
          />
          <div className="pay_verify_text">Verifying Payment...</div>
        </>
      ) : (
        <Empty
          title="PAYMENT VERIFICATION"
          subTitle="Verification failed"
          icon={<MdOutlineSmsFailed />}
          color="white"
        />
      )}
    </div>
  );
};

export default PaymentVerifyBlock;
