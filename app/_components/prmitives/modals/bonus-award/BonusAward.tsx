"use client";
import React from "react";
import "./BonusAward.scss";
import Image from "next/image";
import { ImCancelCircle } from "react-icons/im";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";
import { Button } from "@/_components";
import Link from "next/link";
import { congrat, congratgif } from "@/_assets";
import { useRouter } from "next/navigation";

const BonusAward = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return (
    <div className="bonus_aw center col">
      <div
        className="bonus_aw_cancel"
        onClick={() => dispatch(closeComponentModal())}
      >
        <ImCancelCircle />
      </div>
      <div className="bonus_aw_imgw">
        <Image fill src={congrat} alt="congrats!" className="bonus_aw_img" />
        <Image fill src={congratgif} alt="congrats!" className="bonus_aw_img" />
      </div>

      <h2 className="bonus_aw_hd">Congratulations!</h2>
      <p className="bonus_aw_text">You have been Awarded N100 in Bonus funds</p>
      <p className="bonus_aw_res">
        Turn over the full amount 20 times in the next 4 days
      </p>

      <Button
        className="bonus_aw_btn"
        text="START PLAYING"
        onClick={() => {
          router.push("/");
          dispatch(closeComponentModal());
        }}
      />

      <Link className="bonus_aw_link" href={"/"}>
        Terms & condition
      </Link>
      <div className="float" />
    </div>
  );
};

export default BonusAward;
