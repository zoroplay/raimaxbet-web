"use client";
import React, { MouseEventHandler } from "react";
import "./Button.scss";
import { ThreeDots } from "react-loader-spinner";

interface ButtonProps {
  text: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "reset" | "submit";
  loadColor?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
}

const Button = ({
  text,
  loading,
  disabled,
  className,
  type = "button",
  loadColor,
  ...rest
}: ButtonProps) => {
  return (
    <button
      {...rest}
      type={type}
      disabled={disabled}
      className={` ${disabled ? "invalid" : "button"} ${className} center `}
    >
      {loading ? (
        <ThreeDots
          height="15"
          width="15"
          radius="9"
          color={loadColor ? "" : "#ffffff"}
          ariaLabel="three-dots-loading"
          visible={true}
        />
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default Button;
