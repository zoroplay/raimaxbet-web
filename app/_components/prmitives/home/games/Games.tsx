"use client";
import React, { useEffect, useState } from "react";
import "./Games.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Image from "next/image";
import { bgone, bgtwo, aviator } from "@/_assets";
import { Button } from "@/_components";
import Link from "next/link";
import { useAppSelector } from "@/_hooks";
import MD5 from "crypto-js/md5";
import { useRouter } from "next/navigation";

const Games = () => {
  const [mode, setMode] = useState(0);
  const [token, setToken] = useState("111111");
  const [hash, setHash] = useState("");
  const [group, setGroup] = useState(process.env.NEXT_PUBLIC_SITE_KEY);
  const backurl = process.env.NEXT_PUBLIC_SITE_URL;
  const privateKey = process.env.NEXT_PUBLIC_XPRESS_PRIVATE_KEY;

  const user = useAppSelector((state) => state.user);
  const router = useRouter();

  const settings = {
    arrows: false,
    autoplay: true,
    infinite: true,
    // fade: true,
    speed: 2000,
    slidesToShow: 2,
    slidesToScroll: 2,
    // cssEase: "linear",
  };
  useEffect(() => {
    if (user.token) {
      setMode(1);
      setGroup(user.user?.group);
      setToken(user.user?.auth_code);
    }
  }, [user]);

  useEffect(() => {
    const hashStr = MD5(
      `${token}10100${backurl}${mode}${group}mobile${privateKey}`
    ).toString();

    setHash(hashStr);
  }, [token]);

  const handleClick = () => {
    window.open(
      `${process.env.NEXT_PUBLIC_XPRESS_LAUNCH_URL}?token=${token}&game=10100&backurl=${backurl}&mode=${mode}&group=${group}&clientPlatform=mobile&h=${hash}`
    );
  };

  const allCasinos = () => {
    router.push("/casino/all");
  };

  return (
    <div className="games">
      <div className="games_slide">
        <div className="games_slide_head">Quick Play Games</div>
        <Slider
          {...settings}
          // centerMode={true}
          // centerPadding="10px"
          className="game_slide_con between"
        >
          <div className="slider" onClick={() => handleClick()}>
            <div className="slide_img_wrap">
              <Image fill src={bgone} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">VIRTUALS</div>
          </div>
          <Link
            href={"/game/play/live-casino/c27/aviator_spribe"}
            className="slider"
          >
            <div className="slide_img_wrap">
              <Image fill src={aviator} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">AVIATOR</div>
          </Link>
          <div className="slider" onClick={() => handleClick()}>
            <div className="slide_img_wrap">
              <Image fill src={bgone} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">VIRTUALS</div>
          </div>
          <Link
            href={"/game/play/live-casino/c27/aviator_spribe"}
            className="slider"
          >
            <div className="slide_img_wrap">
              <Image fill src={aviator} alt="bg" className="game_slide_img" />
            </div>
            <div className="games_slide_title">AVIATOR</div>
          </Link>
        </Slider>
        <Button
          text="MORE GAMES"
          className="slide_btn"
          onClick={() => allCasinos()}
        />
        {/* <div className="slide_text_wrap">
          <p className="slide_text">
            Frapapa is your bookmaker for the Best Odds Guaranteed in Nigeria.
            Frapapa offers reliable, secure deposit and payment methods while
            also processing withdrawals instantly.
          </p>
          <p className="slide_text">
            <a href="https://www.frapapa.com/promotions/">
              <span>offers and promotions</span>
            </a>{" "}
            Take advantage of Frapapa’s unbeatable. Join today for the Frapapa{" "}
            <a href="https://www.frapapa.com/promo/100-welcome-offer/">
              <span>100% Welcome Offer,</span>
            </a>{" "}
            where we will match your stakes up to ₦20,000 and give you an extra
            casino and virtual bonus of 600% up to ₦50,000.&nbsp;
          </p>
          <p className="slide_text">
            Link up with our social media channels for{" "}
            <a href="https://www.frapapa.com/promo/frapapa-club/">
              <span>weekly prize giveaways.</span>
            </a>{" "}
            You can win your bet with our{" "}
            <a href="https://www.frapapa.com/promo/cash-out/">
              <span>Cash Out</span>
            </a>{" "}
            function before your ticket gets spoiled. Frapapa offers a{" "}
            <a href="https://www.frapapa.com/promo/400-accumulator-boost/">
              <span>400% Multiple Boost</span>
            </a>{" "}
            for accumulator bets and the more selections that you add to your
            bet slip, the more bonus you get.
          </p>
          <p className="slide_text">
            Frapapa&apos;s sports betting pre-match markets cover all major
            events and leagues and we will pay up to ₦40,000,000 on any given
            ticket, the highest in Nigeria. With Live Betting, you can bet on
            changing odds right up to the 90th minute.{" "}
            <a href="https://www.frapapa.com/register/">
              <span>Join Frapapa</span>
            </a>{" "}
            to bet on soccer, tennis, basketball, boxing, golf, football,
            baseball, and much more.
          </p>
          <p className="slide_text">
            We offer bets on the most popular soccer leagues including the
            English Premier League, Spanish La Liga, Italian Serie A, and German
            Bundesliga, UEFA Champions League, Europa League &amp; Conference
            League while you can also win from tips and predictions on numerous
            other leagues from around the world.
          </p>
          <p className="slide_text">
            In the Frapapa{" "}
            <a href="https://www.frapapa.com/casino/">
              <span>Casino,</span>
            </a>{" "}
            you will find all of your{" "}
            <a href="https://www.frapapa.com/casino/?category=10321">
              <span>favourite slots,</span>
            </a>{" "}
            <a href="https://www.frapapa.com/casino/?category=10336">
              <span>card games</span>
            </a>{" "}
            , and much more. Take a seat at the table and benefit from{" "}
            <a href="https://www.frapapa.com/casino/?category=10322">
              <span>classic roulette</span>
            </a>{" "}
            to a wide variety of slot machines and even an exclusive{" "}
            <a href="https://www.frapapa.com/live-casino/">
              <span>Live Casino</span>
            </a>{" "}
            with real dealers. Our{" "}
            <a href="https://www.frapapa.com/virtuals/">
              <span>virtual betting</span>
            </a>{" "}
            suite is second-to-none and particularly enhanced when using{" "}
            <a href="https://app.frapapa.com/">
              <span>Frapapa mobile app.</span>
            </a>
          </p>
          <p className="slide_text">
            Play{" "}
            <a href="https://www.frapapa.com/virtuals/?category=10343">
              <span>virtual football</span>
            </a>{" "}
            , tennis, horse and{" "}
            <a href="https://www.frapapa.com/virtuals/?category=10344">
              <span>instant racing,</span>
            </a>{" "}
            and our virtual lottery, 24 hours a day.
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default Games;
