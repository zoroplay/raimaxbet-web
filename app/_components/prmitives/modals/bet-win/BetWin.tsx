import React from "react";
import "./BetWin.scss";
import { congrats } from "@/_assets";
import { HiMiniXMark } from "react-icons/hi2";
import { useAppDispatch } from "@/_hooks";
import { closeComponentModal } from "@/_redux/slices/modal.slice";

const BetWin = () => {
  const dispatch = useAppDispatch();
  return (
    <div className="bet_win center col">
      <div className="bet_win_close" onClick={() => dispatch(closeComponentModal())}>
        <HiMiniXMark />
      </div>
      <video src={congrats} loop={true} className="bet_win_vid" autoPlay={true} muted/>
    </div>
  );
};

export default BetWin;
