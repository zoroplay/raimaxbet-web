"use client";
import React from "react";
import "./MatchRangeTab.scss";
import { useAppSelector } from "@/_hooks";
import { MdOutlineCancel } from "react-icons/md";
import { useDispatch } from "react-redux";
import {
  removeFromFixtures,
  updateCurrentTournaments,
} from "@/_redux/slices/fixtures.slice";

interface MatchRangeTabProps {
  tournament: string;
  categoryName: string;
  sportName: string;
  tournamentId?: number;
}

const MatchRangeTab = ({
  tournament,
  categoryName,
  sportName,
  tournamentId,
}: MatchRangeTabProps) => {
  const dispatch = useDispatch();
  const { currentFixtureTab } = useAppSelector((store) => store.fixtures);
  return (
    <div className="range">
      {currentFixtureTab.name !== "today" &&
        currentFixtureTab.name !== "highlights" && (
          <>
            {" "}
            <div className="range_title between">
              <>{sportName}</>
              {currentFixtureTab.name === "tournaments" && (
                <div
                  className="range_icon"
                  onClick={() => {
                    dispatch(removeFromFixtures(tournamentId));
                    dispatch(
                      updateCurrentTournaments({
                        data: null,
                        id: tournamentId,
                      })
                    );
                  }}
                >
                  <MdOutlineCancel />
                </div>
              )}
            </div>
            <div className="range_title">
              {categoryName + " > " + tournament}
            </div>
          </>
        )}
      {currentFixtureTab.name === "today" && (
        <div className="range_title">TODAY</div>
      )}
      {currentFixtureTab.name === "highlights" && (
        <div className="range_title">HIGHLIGHTS</div>
      )}
      {/* <div className="start">
        <div className="range_option">
          <select className="range_select">
            <option className="range_select_item" value="">
              next 24 Hours
            </option>
            <option className="range_select_item" value="">
              next 48 Hours
            </option>
            <option className="range_select_item" value="">
              next 72 Hours
            </option>
          </select>
        </div>
        <div className="range_wrap center active_range">
          <div className="range_one center">
            <div className="range_item"/>
            <div className="range_item"/>
            <div className="range_item"/>
            <div className="range_item"/>
          </div>
          <div className="range_two center">
            <div className="range_item"/>
            <div className="range_item"/>
            <div className="range_item"/>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default MatchRangeTab;
