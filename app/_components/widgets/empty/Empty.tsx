import React from "react";
import "./Empty.scss";

interface EmptyProp {
  icon: JSX.Element;
  title: string;
  subTitle?: string;
  color?: string;
}

const Empty = ({ icon, title, subTitle, color }: EmptyProp) => {
  return (
    <div className="empty center col">
      <div className="empty_icon_wrap">
        <div className="empty_icon">{icon}</div>
      </div>
      <div className="empty_title" style={{ color: color ? color : "" }}>
        {title}
      </div>
      <div className="empty_sub" style={{ color: color ? color : "" }}>{subTitle}</div>
    </div>
  );
};

export default Empty;
