"use client";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { closeIsFirstLogin } from "@/_redux/slices/user.slice";
import {
  useSetNotificationsMutation,
  useUserNotificationsMutation,
} from "@/_services/notification.service";
import { rtkMutation } from "@/_utils";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Bounce, toast } from "react-toastify";

type Props = {};

const Toast = (props: Props) => {
  const [isTouched, setIsTouched] = useState(false);
  const { isFirstLogin, user } = useAppSelector((state) => state.user);
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [UserNotificationsMutation, { data, isLoading, isError, error }] =
    useUserNotificationsMutation();
  const [SetNotificationsMutation, { data: sData }] =
    useSetNotificationsMutation();

  useEffect(() => {
    setTimeout(function () {
      if (user && isFirstLogin) {
        rtkMutation(UserNotificationsMutation, { data: "data" });
      }
    }, 10);
  }, [isFirstLogin, user, isTouched]);

  useEffect(() => {
    setTimeout(function () {
      setIsTouched(true);
      if (isTouched && isFirstLogin) {
        if (user && data && data.data) {
          data.data.map((item: any) => {
            toast(item.description, {
              position: "top-right",
              autoClose: 10000,
              hideProgressBar: false,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
              transition: Bounce,
              onClose: function name() {
                rtkMutation(SetNotificationsMutation, {
                  id: item.id,
                });
              },
            });
          });
        }
      }
      setTimeout(function () {
        dispatch(closeIsFirstLogin());
        setIsTouched(false);
      }, 3000);
    }, 20);
  }, [isFirstLogin, user, isTouched, data]);

  return <div style={{ opacity: 0 }}> ttell</div>;
};

export default Toast;
