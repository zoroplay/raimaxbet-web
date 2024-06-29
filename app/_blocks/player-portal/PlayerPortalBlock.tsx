"use client";
import React, { useEffect, useState } from "react";
import "./PlayerPortalBlock.scss";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { profile } from "@/_assets";
import { TbEditCircle } from "react-icons/tb";
import { AiOutlineStar } from "react-icons/ai";
import { IoMenu } from "react-icons/io5";
import { useGetUserDetailsQuery } from "@/_services/auth.service";
import {
  Button,
  Personal,
  Kyc,
  PaymentAccount,
  History,
  Deposit,
  Withdrawal,
  Limits,
  Logs,
  Bonus,
  CasinoBonus,
} from "@/_components";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import Link from "next/link";
import { slugify } from "@/_utils";
import { openModal } from "@/_redux/slices/modal.slice";
import { formatNumber } from "@/_utils/helpers";

const items = [
  "PERSONAL",
  "KYC",
  // "PAYMENT ACCOUNTS",
  "HISTORY",
  "DEPOSITS",
  "WITHDRAWALS",
  "LIMITS",
  "LOGS",
  "SPORT BONUS",
  "CASINO BONUS",
];

const PlayerPortalBlock = () => {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("PERSONAL");

  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.user);

  const slug = params.slug[0];
  const Component = {
    PERSONAL: <Personal />,
    KYC: <Kyc />,
    // "PAYMENT ACCOUNTS": <PaymentAccount />,
    HISTORY: <History />,
    DEPOSITS: <Deposit />,
    WITHDRAWALS: <Withdrawal />,
    LIMITS: <Limits />,
    LOGS: <Logs />,
    "SPORT BONUS": <Bonus />,
    "CASINO BONUS": <CasinoBonus />,
  }[current];

  const { data } = useGetUserDetailsQuery("");

  useEffect(() => {
    setCurrent(slug.toUpperCase().replace("-", " "));
  }, [slug]);

  useEffect(() => {
    token === null && router.push("/");
  }, [token]);

  return (
    <div className="port_block center col">
      <div className="port_block_con">
        <div className="port_block_prof between">
          <div className="center col">
            <div className="port_img_wrap">
              <Image src={profile} fill alt="profile" className="port_img" />
              <div className="port_icon center">
                <TbEditCircle />
              </div>
            </div>
            <div className="port_num_id center">
              <div className="port_num">
                ID: {data?.data?.username || user?.username}
              </div>
              {/* <div className="port_num">ID: {data?.user?.id || user?.id}</div> */}
            </div>
          </div>
          <div className="port_num_id_wrap">
            <div className="port_stars center">
              <div className="port_star">
                <AiOutlineStar />
              </div>
              <div className="port_star">
                <AiOutlineStar />
              </div>
              <div className="port_star">
                <AiOutlineStar />
              </div>
              <div className="port_star">
                <AiOutlineStar />
              </div>
              <div className="port_star">
                <AiOutlineStar />
              </div>
            </div>
            <div className="port_balance_wrap between">
              <div className="port_balance_texts center col port_border_r">
                <div className="port_balance_title">BONUS</div>
                <div className="port_balance_val">
                  {formatNumber(data?.data?.sportBonusBalance) || 0.0} NGN
                </div>
              </div>
              <div className="port_balance_texts center col port_border_r">
                <div className="port_balance_title">WITHDRAWABLE</div>
                <div className="port_balance_val">
                  {formatNumber(data?.data?.availableBalance) || 0.0} NGN
                </div>
              </div>
              <div className="port_balance_texts center col">
                <div className="port_balance_title center col">UNLOCKING</div>
                <div className="port_balance_val">0.00 NG</div>
              </div>
              <Button
                text="CHANGE PASSWORD"
                className="port_btn"
                onClick={() =>
                  dispatch(openModal({ component: "ChangePassword" }))
                }
              />
            </div>
          </div>
        </div>
        <div className="between port_info">
          <div className="port_acc_con">
            <div className="port_acc_wrap" onClick={() => setOpen(!open)}>
              <div className={`port_acc start col open ${open && ""}`}>
                <div className="between port_acc_seen">
                  <div className="port_acc_title">
                    {current.toUpperCase().replace("-", " ")}
                  </div>
                  {/* <div className="port_acc_bar">
                    <IoMenu />
                  </div> */}
                </div>
                {items.map((item: string, idx: number) => (
                  <div
                    // href={`/player-portal/${slugify(item)}`}
                    key={idx}
                    className={`port_acc_text ${
                      item === current && "active_port"
                    }`}
                    onClick={() => {
                      setCurrent(item);
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="port_val_con">{Component}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerPortalBlock;
