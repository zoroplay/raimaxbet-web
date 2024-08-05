"use client";
import React from "react";
import "./Modal.scss";
// import { failed, success } from "assets/images";
import {
  Button,
  ToDepositModal,
  UpdateProfile,
  DepositModal,
  PlaceBetModal,
  DepositModBonus,
  DepositPaymentModal,
  BookBetslip,
  LoginModal,
  ConfirmFind,
  ChangePassword,
  VerifyNumber,
  ResetPassword,
  OtpReset,
  BetWin,
  MyBetsModal,
  BonusAward,
  InactiveModal,
  ConfirmTransfer,
} from "@/_components";
import { AnimatePresence, motion } from "framer-motion";
// import { useDispatch } from "react-redux";
import { closeModal } from "@/_redux/slices/modal.slice";
import { useAppSelector, useAppDispatch } from "@/_hooks";
import { useRouter } from "next/navigation";
import { MdOutlineCancel } from "react-icons/md";
import { GiCheckMark } from "react-icons/gi";

interface ModalTYpe {
  title?: string | undefined;
  message?: string | undefined;
  isOpen?: boolean | undefined;
  isOpenComponent?: boolean | undefined;
  promptMessage?: string | undefined;
  promptLink?: string | undefined;
  component?: string | undefined;
  success?: boolean | undefined;
  data?: any;
}

const Modal = () => {
  const {
    title,
    message,
    isOpen,
    isOpenComponent,
    promptMessage,
    promptLink,
    component,
    success: succeeded,
    data,
  }: any = useAppSelector((state) => state.modal);

  const dispatch = useAppDispatch();

  // console.log(isOpen, "open", isOpenComponent, "comp-", component, "title-", amount, "transId", transaction_id);

  const navigate = useRouter();

  const handleNavigate = () => {
    navigate.push(promptLink ? promptLink : "None");
    dispatch(closeModal());
  };
  const handleClose = () => {
    dispatch(closeModal());
  };

  // const modalToDisplay:string = component || "None";

  const ComponentItem: any = {
    DepositModal: <DepositModal />,
    UpdateProfile: <UpdateProfile />,
    ToDepositModal: <ToDepositModal />,
    DepositModBonus: <DepositModBonus data={data} />,
    DepositPaymentModal: <DepositPaymentModal data={data} />,
    BookBetslip: <BookBetslip />,
    LoginModal: <LoginModal />,
    ChangePassword: <ChangePassword />,
    VerifyNumber: <VerifyNumber />,
    ResetPassword: <ResetPassword data={data} />,
    OtpReset: <OtpReset />,
    ConfirmFind: <ConfirmFind data={data} />,
    ConfirmTransfer: <ConfirmTransfer data={data} />,
    BetWin: <BetWin />,
    MyBetsModal: <MyBetsModal />,
    BonusAward: <BonusAward />,
    InactiveModal: <InactiveModal />,
  }[component as string];

  return (
    <>
      <AnimatePresence>
        {isOpenComponent && (
          <motion.div
            key={isOpenComponent ? "open" : "close"}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{
              duration: 0.3,
              delay: 0,
              // ease: "easeInOut",
            }}
            className="modal center col"
            style={{ width: "100%" }}
          >
            {component && ComponentItem}
          </motion.div>
        )}

        {isOpen && (
          <div
            className={"modal center col"}
            // className={`${
            //   isOpen ? "modal center col" : "modal_close center col"
            // }`}
          >
            <motion.div
              key={isOpen ? "open" : "close"}
              initial={{ y: 80 }}
              animate={{ y: 0 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{
                duration: 0.3,
                delay: 0,
                // ease: "easeInOut",
              }}
              className="center"
              style={{ width: "100%" }}
            >
              <div className="modal_content_wrap center col">
                {succeeded ? (
                  <div className="success">
                    <GiCheckMark />
                  </div>
                ) : (
                  <div className="failed">
                    <MdOutlineCancel />
                  </div>
                )}
                <div className="modal_content_title">{title}</div>
                <div className="modal_message_text">{message}</div>

                {
                  <Button
                    text={promptMessage ? promptMessage : "Close"}
                    onClick={() => {
                      promptLink ? handleNavigate() : handleClose();
                    }}
                    className="modal_btn"
                  />
                }
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Modal;
