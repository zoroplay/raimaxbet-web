"use client";
import React, { useState } from "react";
import "./Input.scss";
import { eye, eyeclose } from "@/_assets";
import {
  FieldInputProps,
  FieldMetaState,
  FieldRenderProps,
} from "react-final-form";
import Image from "next/image";
import { MdPhoneIphone } from "react-icons/md";
import { BsCalendar2Date } from "react-icons/bs";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface InputProp {
  type: string;
  label: string;
  tooltip: string;
  input: FieldInputProps<string>;
  meta: FieldMetaState<string | boolean>;
  password: string;
  select: string;
  selectDefault: string;
  options: string;
  textArea: string;
  placeholder: string;
  number: string;
  date: string;
  color: string;
  className: string;
  disabled: boolean;
  required: boolean;
}

const Input = ({
  type = "text",
  input,
  meta,
  label,
  password,
  select,
  selectDefault,
  options,
  textArea,
  placeholder = "",
  number,
  date,
  className,
  disabled,
  color = "",
  required = true,
}: //   required = true,
InputProp | FieldRenderProps<any>) => {
  const [passwordType, setPasswordType] = useState("password");

  const togglePasswordType = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  const style: React.CSSProperties = {
    position: "absolute",
    top: "40px",
    left: "0px",
  };

  const today = new Date();

  return (
    <div className="input">
      {label && (
        <div className="input_label_wrap_text">
          {label}{" "}
          {required && (
            <span className="input_label_wrap_text_required">*</span>
          )}
        </div>
      )}
      <div
        className={`input_main_wrap between ${className}`}
        style={{ height: textArea && "110px" }}
      >
        {number && (
          <div className="num_text center">
            <div className="num_text_icon" style={{ color: color }}>
              <MdPhoneIphone />
            </div>
            <span style={{ color: color }}>+211</span>
          </div>
        )}
        {select ? (
          <select
            className="input_main"
            // onChange={input.value}
            {...input}
            style={{ width: "100%" }}
            disabled={disabled}
          >
            <option value="">{selectDefault || "Select an option"}</option>
            {Object.entries(options || {})?.map((option: any) => {
              return (
                <option key={option[1]} value={option[1]}>
                  {option[0]}
                </option>
              );
            })}
          </select>
        ) : textArea ? (
          <textarea
            className="input_main"
            {...input}
            style={{
              width: "100%",
              height: "100%",
            }}
            rows={4}
          />
        ) : date ? (
          <DatePicker
            className="datepicker"
            selected={input.value ? new Date(input.value) : null}
            onChange={(date) =>
              input.onChange(date?.toISOString()?.split("T")[0])
            }
            maxDate={today}
            dateFormat="dd-MM-yyyy"
          />
        ) : (
          <input
            className="input_main"
            {...input}
            style={{ width: password ? undefined : "100%" }}
            type={password ? passwordType : type}
            placeholder={placeholder}
            disabled={disabled}
          />
        )}
        {date && (
          <div className="date end">
            <BsCalendar2Date />
          </div>
        )}
        {password && (
          <div className="password center" onClick={togglePasswordType}>
            {passwordType === "password" ? (
              <div style={{ color: color }} className="pass_icon">
                <IoEyeOffOutline />
              </div>
            ) : (
              <div style={{ color: color }} className="pass_icon">
                <IoEyeOutline />
              </div>
            )}
          </div>
        )}
      </div>
      {meta.error && meta.touched && (
        <span
          className="input_error"
          style={placeholder.includes("Input") ? style : {}}
        >
          {meta.error}
        </span>
      )}
    </div>
  );
};

export default Input;
