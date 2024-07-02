"use client";
import React, { useState, useEffect } from "react";
import "./PortalTable.scss";
import { MdFilterAltOff } from "react-icons/md";
import { MdFilterAlt } from "react-icons/md";
import { HiMinusCircle } from "react-icons/hi";
import { HiPlusCircle } from "react-icons/hi";
import { Form, Field } from "react-final-form";
import { Button, Input, Pagination } from "@/_components";
import { useTransactionsMutation } from "@/_services/auth.service";
import { ThreeDots } from "react-loader-spinner";
import {
  changeStringDateFormat,
  getDaysBeforeAndAhead,
  yearMonthDayTime,
} from "@/_utils/formatDate";
import { rtkMutation } from "@/_utils";

// interface PortalTableProps {}

const PortalTable = () => {
  const [isOpen, setIsOpen] = useState<boolean[]>([]);
  const [page, setPage] = useState<number>(1);
  const { todaysDate, sevenDaysAgoDate } = getDaysBeforeAndAhead();
  const [date, setDate] = useState<{ [key in string]: string | undefined }>({
    to: changeStringDateFormat(todaysDate),
    from: changeStringDateFormat(sevenDaysAgoDate),
  });

  const [transactions, { data, isLoading }] = useTransactionsMutation();

  useEffect(() => {
    rtkMutation(transactions, {
      startDate: date.from,
      endDate: date.to,
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      page,
    });
  }, [page, date]);

  useEffect(() => {
    if (data?.data) {
      const booleanArray = new Array(data.data).fill(false);
      setIsOpen(booleanArray);
    }
  }, [data]);

  const onSubmit = (values: { [key in string]: string }) => {
    const newState = { ...date };
    newState.to = changeStringDateFormat(values.to);
    newState.from = changeStringDateFormat(values.from);
    setDate(newState);
    // console.log(newState, "vals");
  };

  return (
    <>
      {" "}
      <Form
        onSubmit={onSubmit}
        render={({ handleSubmit }) => (
          <form onSubmit={handleSubmit} className="port_table_form_wrap">
            <div className="port_table_form_title">DATE FILTER</div>
            <div className="port_table_input_wrap mb_30">
              <Field name="from" component={Input} label={"Start Date"} date />
            </div>
            <div className="port_table_input_wrap mb_30">
              <Field name="to" component={Input} label={"End Date"} date />
            </div>
            <Button
              text="Submit"
              className="port_btn_input_wrap"
              type="submit"
            />
          </form>
        )}
      />{" "}
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
        <>
          {isLoading ? (
            <div className="center p_20">
              <ThreeDots
                height="15"
                width="15"
                radius="9"
                color={"#7A7A7A"}
                ariaLabel="three-dots-loading"
                visible={true}
              />
            </div>
          ) : (
            data?.data?.map((item: any, idx: number) => (
              <div
                className={`port_table_body ${isOpen[idx] && "active_acc"}`}
                key={idx}
                style={{ backgroundColor: idx % 2 ? "#f8f8f8" : "" }}
              >
                <div className="between port_table_body_con">
                  <div className="table_body_wrap start">
                    <div
                      className="table_body_icon"
                      onClick={() => {
                        const newState = [...isOpen];
                        newState[idx] = !newState[idx];
                        setIsOpen(newState);
                      }}
                    >
                      {isOpen[idx] ? <HiMinusCircle /> : <HiPlusCircle />}
                    </div>
                    <div className="table_body_title">
                      {yearMonthDayTime(item?.transactionDate)}
                    </div>
                  </div>
                  <div className="table_body_wrap_one">
                    <div className="table_body_title">{item?.subject}</div>
                  </div>
                </div>
                <div className="between port_table_acc_con">
                  <div className="table_acc_wrap start">
                    <div className="table_acc_title bold">Transaction Id</div>
                  </div>
                  <div className="table_acc_wrap">
                    <div className="table_acc_title">{item?.referenceNo}</div>
                  </div>
                </div>
                <div className="between port_table_acc_con">
                  <div className="table_acc_wrap start">
                    <div className="table_acc_title bold">Amount</div>
                  </div>
                  <div className="table_acc_wrap">
                    {item.type === "credit" && (
                      <div className="table_acc_title">
                        NGN{" "}
                        <span style={{ color: "green" }}>+{item?.amount}</span>
                      </div>
                    )}
                    {item.type === "debit" && (
                      <div className="table_acc_title">
                        NGN{" "}
                        <span style={{ color: "red" }}>-{item?.amount}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="between port_table_acc_con">
                  <div className="table_acc_wrap start">
                    <div className="table_acc_title bold">Description</div>
                  </div>
                  <div className="table_acc_wrap">
                    <div className="table_acc_title">{item?.description}</div>
                  </div>
                </div>
                <div className="between port_table_acc_con">
                  <div className="table_acc_wrap start">
                    <div className="table_acc_title bold">Status</div>
                  </div>
                  <div className="table_acc_wrap">
                    <div className="table_acc_title">
                      {item.status === 0 && (
                        <span style={{ color: "orange" }}>Pending</span>
                      )}
                      {item.status === 1 && (
                        <span style={{ color: "green" }}>Completed</span>
                      )}
                      {item.status === 2 && (
                        <span style={{ color: "red" }}>Failed/Cancelled</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      </div>
      <Pagination
        totalCount={data?.total}
        page={page}
        setPage={setPage}
        limit={data?.per_page}
        dataLength={data?.data?.length}
      />
    </>
  );
};

export default PortalTable;
