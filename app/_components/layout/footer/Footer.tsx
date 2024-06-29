"use client";
import React, { useState } from "react";
import "./Footer.scss";
import "@/icons.css";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaTwitter, FaInstagram, FaTiktok } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { BsReceipt } from "react-icons/bs";
import { AiFillStar } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { TfiWrite } from "react-icons/tfi";
import {
  andriod,
  coralpay,
  firstmonie,
  firstbank,
  ussd,
  gtbank,
  verve,
  visa,
  master,
  interswitch,
  opay,
  ios,
  paystack,
} from "@/_assets";
import { MdEmail } from "react-icons/md";
import { NavLink } from "@/_utils";
import { useAppDispatch, useAppSelector } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";

const links = [
  { name: "AFFILIATES", link: "https://affiliates.raimax.bet/" },
  // { name: "BECOME AN AGENT", link: "" },
  { name: "FAQ", link: "/help/faq" },
  { name: "ABOUT US", link: "/help/about-us" },
  { name: "TERMS & CONDITION", link: "/help/terms-and-condition" },
  { name: "RESPONSIBLE GAMBLING", link: "/help/responsible-gaming" },
  { name: "CONTACT US", link: "/help/contact-us" },
  { name: "BETTING RULES", link: "/help/betting-rules" },
];
const socials = [
  { icon: <FaFacebookF />, link: "" },
  { icon: <FaInstagram />, link: "" },
  { icon: <FaTwitter />, link: "" },
  { icon: <FaTiktok />, link: "" },
  { icon: <MdEmail />, link: "" },
];

const Footer = () => {
  const [currentLink, setCurrentLink] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const slips = useAppSelector((state) => state.betslip);
  const user = useAppSelector((state) => state.user);
  const isBetSlipModal = useAppSelector(
    (state) => state.modal?.globalModalState?.betslip
  );

  // console.log(slips.coupon.selections.length >= 1, "mod");
  return (
    <div className="footer">
      <div className="footer_links start col">
        {links.map((item, idx) => (
          <Link
            href={item.link}
            key={idx}
            className={`footer_links_item ${
              currentLink === item.name && "active"
            }`}
            onClick={() => setCurrentLink(item.name)}
          >
            {item.name}
          </Link>
        ))}
      </div>
      <div className="footer_logos">
        <Image
          src={ios}
          width={150}
          height={50}
          alt="download app store"
          className="footer_logos_img"
        />
        <Image
          src={andriod}
          width={150}
          height={50}
          alt="download andriod"
          className="footer_logos_img"
        />

        <Image
          src={opay}
          width={150}
          height={50}
          alt="opay"
          className="footer_logos_img"
        />
        <Image
          src={paystack}
          width={150}
          height={50}
          alt="paystack"
          className="footer_logos_img"
        />
        <Image
          src={interswitch}
          width={150}
          height={50}
          alt="interswitch"
          className="footer_logos_img"
        />
        <Image
          src={master}
          width={150}
          height={50}
          alt="master"
          className="footer_logos_img"
        />
        <Image
          src={visa}
          width={150}
          height={50}
          alt="visa"
          className="footer_logos_img"
        />
        <Image
          src={verve}
          width={150}
          height={50}
          alt="verve"
          className="footer_logos_img"
        />
        <Image
          src={gtbank}
          width={150}
          height={50}
          alt="gtbank"
          className="footer_logos_img"
        />
        <Image
          src={ussd}
          width={150}
          height={50}
          alt="ussd"
          className="footer_logos_img"
        />
        <Image
          src={firstbank}
          width={150}
          height={50}
          alt="firstbank"
          className="footer_logos_img"
        />

        <Image
          src={firstmonie}
          width={150}
          height={50}
          alt="firstmonie"
          className="footer_logos_img"
        />
        {/* <Image
          src={coralpay}
          width={150}
          height={50}
          alt="coralpay"
          className="footer_logos_img"
        /> */}
      </div>

      <div className="footer_socials center">
        {socials.map((item, idx) => (
          <Link href={item.link} key={idx} className="footer_socials_item">
            {item.icon}
          </Link>
        ))}
      </div>
      <div className="footer_text_wrap">
        <p className="footer_text">
          <span>18+</span> RaimaxBet is committed to supporting Responsible
          Gambling. Underage gambling is an offence.
        </p>
        <p className="footer_text">
          RaimaxBet is not affiliated or connected with sports teams, event
          organisers or players displayed on its websites and/or mobile apps.
        </p>
        <p className="footer_text">
          This website is operated by Soloti gaming Limited (RC 1687373)
        </p>
        <p className="footer_text">
          Soloti Gaming Limited is licensed by: (i) The Nigerian Lottery
          Regulatory Commission (under Licence number 0001042) , (ii) Lagos
          State Lotteries and Gaming Authority (under Licence number 005500)
        </p>
      </div>

      <div className="copyright_wrap center">
        © <a href="https://web.raimax.bet/">RaimaxBet</a> 2023. All rights
        reserved.{" "}
      </div>
    </div>
  );
};

export default Footer;
