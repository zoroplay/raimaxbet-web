"use client";
import React, { useEffect, useState, useRef } from "react";
import "./Header.scss";
import Image from "next/image";
import Link from "next/link";
import { logo } from "@/_assets";
import { Form, Field } from "react-final-form";
import { Input, Button } from "@/_components";
import { formatErrorResponse, rtkMutation } from "@/_utils";
import { formatNumber, formattedPhoneNumber } from "@/_utils/helpers";
import { RiFootballFill } from "react-icons/ri";
import { MdOutlineCasino } from "react-icons/md";
import { CgMediaLive } from "react-icons/cg";
import { IoIosGift } from "react-icons/io";
import { TbGiftCard } from "react-icons/tb";
import { MdOutlinePayments } from "react-icons/md";
import { IoMdPhonePortrait } from "react-icons/io";
import { IoIosChatbubbles } from "react-icons/io";
import {
  useGetUserDetailsQuery,
  useLoginMutation,
} from "@/_services/auth.service";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { closeComponentModal, openModal } from "@/_redux/slices/modal.slice";
import { BiSolidUser } from "react-icons/bi";
import { logoutUser, updateUser } from "@/_redux/slices/user.slice";
import { updateSportsbookGlobalVariable } from "@/_redux/slices/sport.slice";
import {
  updateCoupon,
  updateSportsbookBonusList,
  updateStakeValues,
  updateWinnings,
} from "@/_redux/slices/betslip.slice";
import MD5 from "crypto-js/md5";
import { useFindWithCodeQuery } from "@/_services/bet.service";
import {
  useGetBonusListQuery,
  useGetGlobalVariableQuery,
} from "@/_services/sport.service";
import { NavLink } from "@/_utils";
import validate, { required } from "@/_validations/validations";
import { InactiveModal } from "@/_components";
import { useIsInactive } from "@/_hooks";

const links = [
  {
    icon: <RiFootballFill />,
    link: "/",
    title: "SPORTS",
  },
  {
    icon: <RiFootballFill />,
    link: "",
    title: "VIRTUALS",
  },
  {
    icon: <MdOutlineCasino />,
    link: "/casino/all",
    title: "CASINO",
  },
  {
    icon: <CgMediaLive />,
    link: "/casino/all",
    title: "LIVE CASINO",
  },
  {
    icon: <IoIosGift />,
    link: "",
    title: "INSTANT WIN",
  },
  {
    icon: <TbGiftCard />,
    link: "",
    title: "PROMOTIONS",
  },
  {
    icon: <MdOutlinePayments />,
    link: "/player-portal/deposits",
    title: "DEPOSITS",
  },
  {
    icon: <IoMdPhonePortrait />,
    link: "",
    title: "APPS",
  },
  {
    icon: <IoIosChatbubbles />,
    link: "",
    title: "LIVE CHAT",
  },
];

const Header = () => {
  useIsInactive();
  const [active, setActive] = useState("SPORTS");
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);

  const [loginMutation, { isLoading, isSuccess, isError, data, error }] =
    useLoginMutation();

  const onSubmit = (values: { [key in string]: string | number }) => {
    rtkMutation(loginMutation, {
      username: formattedPhoneNumber(values.username),
      password: values.password,
    });
  };

  const user = useAppSelector((state) => state.user);

  const dispatch = useAppDispatch();
  const route = useRouter();
  const [isProfileModal, setIsProfileModal] = useState(false);
  const [slipCode, setSlipCode] = useState<string | null>(null);

  const { data: global, refetch } = useGetGlobalVariableQuery("");
  const { data: bonus } = useGetBonusListQuery("");

  const { coupon } = useAppSelector((state) => state.betslip);
  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);
  const search = useSearchParams();
  const { data: userDetails } = useGetUserDetailsQuery("", {
    skip: !user.token,
  });
  const shouldQueryFire = slipCode !== undefined && slipCode !== null;
  const { data: withCodeData, isSuccess: isSuccessFindBookedBet } =
    useFindWithCodeQuery(slipCode, {
      skip: !shouldQueryFire,
    });

  // console.log(user.token, "user");

  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;

  const profileRef = useRef<HTMLDivElement>(null);

  // const goTo = (path) => {
  //   history.push(path);
  // };

  const openPage = (item: any) => {
    if (item.title === "VIRTUALS") {
      window.open(
        `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
      );
    } else if (item.title === "Aviator") {
      user.token
        ? route.push(item.link)
        : dispatch(openModal({ component: "LoginModal" }));
    } else if (item.title === "Penalty Kick") {
      user.token
        ? route.push(item.link)
        : dispatch(openModal({ component: "LoginModal" }));
    } else {
      route.push(item.link);
    }
  };

  // const isSticky = useSticky(100);

  useEffect(() => {
    refetch();
    dispatch(updateSportsbookGlobalVariable(global));
  }, [global, dispatch]);

  useEffect(() => {
    dispatch(updateSportsbookBonusList(bonus));
  }, [bonus, dispatch]);

  useEffect(() => {
    if (user.token) {
      setMode(1);
      setGroup(user.user?.group);
      setToken(user.user?.auth_code);
    }
  }, [user]);

  useEffect(() => {
    if (userDetails?.success) {
      dispatch(
        updateUser({ user: userDetails?.data, token: userDetails?.data?.token })
      );
    }
  }, [userDetails]);

  useEffect(() => {
    dispatch(updateStakeValues(100));
  }, []);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, [token]);

  useEffect(() => {
    if (user && user.user && user.user.availableBalance < 10) {
      setTimeout(() => {
        dispatch(openModal({ component: "ToDepositModal" }));
      }, 10000);
    }
  }, [user]);

  useEffect(() => {
    const searchCode = search.get("shareCode");
    const couponUpdate = { ...coupon };
    couponUpdate.selections = withCodeData?.data?.selections;

    if (searchCode) {
      setSlipCode(searchCode);
    }
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(updateCoupon(couponUpdate));
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(
        updateWinnings({ stake: "100", globalVars: SportsbookGlobalVariable })
      );
    isSuccessFindBookedBet &&
      withCodeData?.success &&
      dispatch(openModal({ modalState: "betslip" }));
    isSuccessFindBookedBet &&
      !withCodeData?.success &&
      dispatch(
        openModal({
          title: "Booking Code Not Found",
          message: withCodeData?.message,
        })
      );
  }, [search, dispatch, isSuccessFindBookedBet]);

  useEffect(() => {
    data?.success &&
      dispatch(
        openModal({
          title: "Login Successful",
          message: "You have succesfully Logged in",
          success: true,
        })
      );

    data?.success && dispatch(closeComponentModal());

    (data?.success === false || isError) &&
      dispatch(
        openModal({
          title: "Error!",
          message: `${
            formatErrorResponse(error) || data?.error || "An error occured"
          }`,
          success: false,
        })
      );
  }, [isSuccess, isError, error, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="header start col">
        <div className="header_wrap between">
          <Link href={"/"} className="header_logo">
            <Image src={logo} fill alt="logo" className="logo" />
          </Link>
          {user.token ? (
            <div className="header_loggedin center">
              <Button
                text="Deposit"
                className="header_loggedin_btn"
                onClick={() => {
                  dispatch(openModal({ component: "DepositModal" }));
                }}
              />
              <div className="header_loggedin_user_wrap center">
                <div
                  className="header_loggedin_icon"
                  onClick={() => setIsProfileModal(!isProfileModal)}
                >
                  <BiSolidUser />
                </div>
              </div>
              <div
                ref={profileRef}
                className={`profile_modal ${
                  !isProfileModal ? "activeMod" : ""
                }`}
              >
                <div className="profile_modal_wrap between">
                  <div className="profile_modal_key">Username:</div>
                  <div className="profile_modal_value num">
                    {user?.user?.username}
                  </div>
                </div>
                <div className="profile_modal_wrap between">
                  <div className="profile_modal_key">Bonus:</div>
                  <div className="profile_modal_value">
                    {formatNumber(userDetails?.data?.sportBonusBalance) ||
                      formatNumber(user?.user?.sportBonusBalance)}{" "}
                    NG
                  </div>
                </div>
                <div className="profile_modal_wrap between">
                  <div className="profile_modal_key">Withdrawable:</div>
                  <div className="profile_modal_value">
                    {formatNumber(userDetails?.data?.availableBalance) ||
                      formatNumber(user?.user?.availableBalance) ||
                      "0.00"}{" "}
                    NGN
                  </div>
                </div>
                <div className="profile_modal_wrap between">
                  <div className="profile_modal_key">Unlocking:</div>
                  <div className="profile_modal_value">0.00 NGN</div>
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    setIsProfileModal(false);
                  }}
                >
                  <Link
                    href={"/player-portal/deposits"}
                    className="profile_modal_key"
                  >
                    Deposits
                  </Link>
                  <div className="profile_modal_value"></div>
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    setIsProfileModal(false);
                  }}
                >
                  <Link
                    href={"/player-portal/sport-bonus"}
                    className="profile_modal_key"
                  >
                    Sport Bonus
                  </Link>
                  <div className="profile_modal_value"></div>
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    setIsProfileModal(false);
                  }}
                >
                  <Link
                    href={"/player-portal/casino-bonus"}
                    className="profile_modal_key"
                  >
                    Casino Bonus
                  </Link>
                  <div className="profile_modal_value"></div>
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    setIsProfileModal(false);
                  }}
                >
                  <Link
                    href={"/player-portal/withdrawals"}
                    className="profile_modal_key"
                  >
                    Withdrawals
                  </Link>
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    setIsProfileModal(false);
                  }}
                >
                  <Link
                    href={"/player-portal/personal"}
                    className="profile_modal_key"
                  >
                    My profile
                  </Link>
                  {/* <div className="profile_modal_value">
                          234 
                      </div> */}
                </div>
                <div
                  className="profile_modal_wrap between"
                  onClick={() => {
                    dispatch(logoutUser());
                    setIsProfileModal(false);
                  }}
                >
                  <div className="profile_modal_key">Logout</div>
                  {/* <div className="profile_modal_value">
                          234 
                      </div> */}
                </div>
              </div>
            </div>
          ) : (
            <div className="header_form_wrap end col">
              <Form
                validate={validate}
                onSubmit={onSubmit}
                render={({ handleSubmit, valid }) => (
                  <form onSubmit={handleSubmit} className="header_form start">
                    <div className="header_input_wrap">
                      <Field
                        name="username"
                        component={Input}
                        number
                        color="#fff"
                        className="header_input"
                        placeholder="Input User Name"
                        validate={required("User name")}
                      />
                    </div>
                    <div className="header_input_wrap">
                      <Field
                        name="password"
                        component={Input}
                        password
                        className="header_input"
                        placeholder="Input Password"
                        validate={required("Password")}
                      />
                    </div>
                    <div className="header_btn_wrap start">
                      <Button
                        text="LOGIN"
                        className="header_log_btn"
                        type="submit"
                        loading={isLoading}
                        disabled={!valid}
                      />
                      <Button
                        text="REGISTER"
                        className="header_reg_btn"
                        onClick={() => route.push("/register")}
                      />
                    </div>
                  </form>
                )}
              />
              <div
                className="forgot_header"
                onClick={() =>
                  dispatch(openModal({ component: "VerifyNumber" }))
                }
              >
                Forgot Password?
              </div>
            </div>
          )}
        </div>
        <div className="between head_links">
          <div className="start head_links_items">
            {links.slice(0, 6).map((item, idx) => (
              <NavLink
                key={idx}
                activeClassName="active"
                className={`start head_links_item center`}
                href={item.link}
                onClick={() => {
                  // setActive(item.title);
                  openPage(item);
                }}
              >
                <div className="head_link_icon">{item.icon}</div>
                <div className="head_link_text">{item.title}</div>
              </NavLink>
            ))}
          </div>
          <div className="start head_links_items">
            {links.slice(6).map((item, idx) => (
              <NavLink
                key={idx}
                className={`start head_links_item center`}
                href={item.link}
                activeClassName="active"
                // onClick={() => setActive(item.title)}
              >
                <div className="head_link_icon">{item.icon}</div>
                <div className="head_link_text">{item.title}</div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
      <div className="b_header" />
    </>
  );
};

export default Header;
