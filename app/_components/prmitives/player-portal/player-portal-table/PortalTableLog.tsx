"use client";
import React, { useState, useEffect } from "react";
import "./PortalTable.scss";
import { MdFilterAltOff } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import { HiMinusCircle } from "react-icons/hi";
import { HiPlusCircle } from "react-icons/hi";

// interface PortalTableProps {}

const PortalTable = () => {
  const [open, setOpen] = useState<{ [key in number]: boolean }>({});

  useEffect(() => {
    const obj: { [key in number]: boolean } = {};
    [1, 2, 3, 4, 6, 7, 8, 9, 10].map((item) => {
      obj[item] = false;
      setOpen(obj);
    });
  }, []);

  return (
    <>
      <div className="port_table">
        <div className="port_table_heading between">
          <div className="table_heading_wrap between">
            <div className="table_heading_title">Date</div>
            <div className="table_heading_icon">
              <MdFilterAltOff />
            </div>
          </div>
          <div className="table_heading_wrap_one between">
            <div className="table_heading_title">Action</div>
            <div className="table_heading_icon">
              <MdFilterAlt />
            </div>
          </div>
        </div>
        {[1, 2, 3, 4, 6, 7, 8, 9, 10].map((item: any, idx: number) => (
          <div
            className={`port_table_body ${open[idx] && "active_acc"}`}
            key={idx}
            style={{ backgroundColor: idx % 2 ? "#f8f8f8" : "" }}
          >
            <div className="between port_table_body_con">
              <div className="table_body_wrap start">
                <div
                  className="table_body_icon"
                  onClick={() => {
                    setOpen((prevState: { [key in number]: boolean }) => ({
                      ...prevState,
                      [idx]: !prevState[idx],
                    }));
                  }}
                >
                  {open[idx] ? <HiMinusCircle /> : <HiPlusCircle />}
                </div>
                <div className="table_body_title">77.29.75.95</div>
              </div>
              <div className="table_body_wrap_one">
                <div className="table_body_title">PLayer Logged In</div>
              </div>
            </div>
            <div className="between port_table_acc_con">
              <div className="table_acc_wrap start">
                <div className="table_acc_title">Player</div>
              </div>
              <div className="table_acc_wrap">
                <div className="table_acc_title">Login</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default PortalTable;
