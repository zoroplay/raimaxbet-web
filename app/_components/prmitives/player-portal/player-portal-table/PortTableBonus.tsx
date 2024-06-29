"use client";
import React, { useState, useEffect } from "react";
import "./PortTableBonus.scss";
import { HiMinusCircle } from "react-icons/hi";
import { HiPlusCircle } from "react-icons/hi";
import dayjs from "dayjs";
import { formatNumber } from "@/_utils/helpers";

interface PortalTableProps {
  transactions?: any;
}

const PortTableBonus = ({ transactions }: PortalTableProps) => {
  const [open, setOpen] = useState<{ [key in number]: boolean }>({});

  // useEffect(() => {
  //   const obj: { [key in number]: boolean } = {};
  //   [1, 2, 3, 4, 6, 7, 8, 9, 10].map((item) => {
  //     obj[item] = false;
  //     setOpen(obj);
  //   });
  // }, []);
  // //   console.log(open, "op");

  // const onSubmit = (values: { [key in string]: string | number }) => {
  //   console.log(values);
  // };

  return (
      <div className="port_table_bonus">
        <div className="port_table_heading between">
          <div className="table_heading_wrap between">
            <div className="table_heading_title">Date</div>
          </div>
          <div className="table_heading_wrap_one between">
            <div className="table_heading_title">Stake</div>
          </div>
          <div className="table_heading_wrap_one between">
            <div className="table_heading_title">Remaining</div>
          </div>
        </div>
        {transactions && transactions?.map((item: any, idx: number) => (
          <div
            className={`port_table_body ${open[idx] && "active_acc"}`}
            key={idx}
            style={{ backgroundColor: idx % 2 ? "#f8f8f8" : "" }}
          >
            <div className="between port_table_body_con">
              <div className="table_body_wrap start">
                {/* <div
                  className="table_body_icon"
                  onClick={() => {
                    setOpen((prevState: { [key in number]: boolean }) => ({
                      ...prevState,
                      [idx]: !prevState[idx],
                    }));
                  }}
                >
                  {open[idx] ? <HiMinusCircle /> : <HiPlusCircle />}
                </div> */}
                <div className="table_body_title">
                  {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </div>
              </div>
              <div className="table_body_wrap_one">
                <div className="table_body_title">{formatNumber(item.amount)}</div>
              </div>
              <div className="table_body_wrap_one">
                <div className="table_body_title">{formatNumber(item.balance)}</div>
              </div>
            </div>
            <div className="between port_table_acc_con">
              <div className="table_acc_wrap start">
                <div className="table_acc_title">100 Bet</div>
              </div>
              <div className="table_acc_wrap">
                <div className="table_acc_title">Won</div>
              </div>
            </div>
          </div>
        ))}
      </div>
  );
};

export default PortTableBonus;
