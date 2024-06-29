"use client";
import React, { useState, useRef, useEffect } from "react";
import "./HoverSideBar.scss";
import { Favourites, Search, Sports } from "@/_components";
import { IoIosArrowForward } from "react-icons/io";
import { RiSearchFill } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { MdOutlineSportsBaseball } from "react-icons/md";

interface HoverSideBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isOpen: boolean;
}

const HoverSideBar = ({ setIsOpen, isOpen }: HoverSideBarProps) => {
  const [isHover, setIsHover] = useState<{ [key in number]: boolean }>({
    1: false,
    2: false,
    3: false,
  });

  const [height, setHeight] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const setCurrentHoverState = (idx: number) => {
    setIsHover((prev) => {
      const obj: { [key in number]: boolean } = { ...prev };
      for (const key in obj) {
        obj[key] = false;
      }
      return { ...obj, [idx]: !obj[idx] };
    });
  };

  const setAllHoverStateFalse = () => {
    setIsHover((prev) => {
      const obj: { [key in number]: boolean } = { ...prev };
      for (const key in obj) {
        obj[key] = false;
      }
      return obj;
    });
  };

  const updateHeight = () => {
    if (containerRef.current) {
      const height = containerRef.current.getBoundingClientRect();
      setHeight(height.height);
    }
  };


  return (
    <div
      className={`hover_side start col`}
      style={{ height: height > 100 ? `${height + 130}px` : "" }}
    >
      <div
        className="hover_icon_wrap center"
        onClick={() => setIsOpen(!isOpen)}
        style={{ opacity: "0.6" }}
      >
        <div className="hover_icon">
          <IoIosArrowForward />
        </div>
      </div>
      <div
        className="hover_icon_wrap center"
        onMouseEnter={() => setCurrentHoverState(0)}
        onMouseLeave={() => setAllHoverStateFalse()}
      >
        <div className="hover_icon">
          <RiSearchFill />
        </div>
        {
          <div className={`hover_comp ${isHover[0] && "hover_comp_active"}`}>
            <Search />
          </div>
        }
      </div>
      <div
        className="hover_icon_wrap center"
        onMouseEnter={() => setCurrentHoverState(1)}
        onMouseLeave={() => setAllHoverStateFalse()}
      >
        <div className="hover_icon">
          <FaStar />
        </div>
        {
          <div className={`hover_comp ${isHover[1] && "hover_comp_active"}`}>
            <Favourites />
          </div>
        }
      </div>
      <div
        className="hover_icon_wrap center"
        onMouseEnter={() => {
          setCurrentHoverState(2);
        }}
        onMouseLeave={() => {
          setAllHoverStateFalse();
          setHeight(0);
        }}
        onMouseMove={() => updateHeight()}
      >
        <div className="hover_icon">
          <MdOutlineSportsBaseball />
        </div>
        {
          <div
            ref={containerRef}
            className={`hover_comp ${isHover[2] && "hover_comp_active"}`}
          >
            <Sports />
          </div>
        }
      </div>
    </div>
  );
};

export default HoverSideBar;
