"use client";
import React, { useRef, useState } from "react";
import "./HomeBlock.scss";
import SideBar from "./sidebar/SideBar";
import Center from "./center/Center";
import { BetSlip } from "@/_components";
import { useAppDispatch, useAppSelector, useSticky } from "@/_hooks";
import { openModal } from "@/_redux/slices/modal.slice";
import HoverSideBar from "./hover-sidebar/HoverSideBar";

const HomeBlock = () => {
  const [isOpen, setIsOpen] = useState(false);
  const refRight = useRef<HTMLDivElement>(null)
  const isSticky = useSticky(150, 800);

  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.user);
  return (
    <div className="home start">
      <div className={`home_left start ${isOpen && "home_left_open"} `}>
        {!isOpen && (
          <div className="home_left_sidebar">
            <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
          </div>
        )}
        {isOpen && <HoverSideBar isOpen={isOpen} setIsOpen={setIsOpen} />}
      </div>
      {/* {isSticky && (
        <div className={`home_left start ${isOpen && "home_left_open"}`} />
      )} */}

      <div className={`home_center ${isOpen && "home_center_open"}`}>
        <Center />
      </div>
      <div className={`home_right ${false && "fix_home"}`}>
        <div
          className="my_bets"
          onClick={() =>
            token
              ? dispatch(openModal({ component: "MyBetsModal" }))
              : dispatch(openModal({ component: "LoginModal" }))
          }
        >
          MY BETS
        </div>
        <BetSlip />
      </div>
    </div>
  );
};

export default HomeBlock;
