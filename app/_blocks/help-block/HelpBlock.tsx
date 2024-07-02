"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import "./HelpBlock.scss";
import { CmsContent } from "@/_components";
import {
  useGetAboutQuery,
  useTermsQuery,
  useGetResponsibleGamingQuery,
  useGetContactQuery,
  useGetFaqQuery,
  useGetRulesQuery,
} from "@/_services/cms.service";

const links = [
  { name: "FAQ", link: "faq" },
  { name: "ABOUT US", link: "about-us" },
  { name: "TERMS & CONDITION", link: "terms-and-condition" },
  //   { name: "PRIVACY POLICY", link: "privacy" },
  { name: "RESPONSIBLE GAMBLING", link: "responsible-gaming" },
  { name: "CONTACT US", link: "contact-us" },
  { name: "BETTING RULES", link: "betting-rules" },
];

const HelpBlock = () => {
  const param = useParams();
  const [current, setCurrent] = useState(param.slug[0]);
  const { data: faq } = useGetFaqQuery("");
  const { data: about } = useGetAboutQuery("");
  const { data: terms } = useTermsQuery("");
  const { data: game } = useGetResponsibleGamingQuery("");
  const { data: contact } = useGetContactQuery("");
  const { data: rules } = useGetRulesQuery("");

  const component = {
    faq: <CmsContent data={faq} />,
    "about-us": <CmsContent data={about} />,
    "terms-and-condition": <CmsContent data={terms} />,
    "responsible-gaming": <CmsContent data={game} />,
    "contact-us": <CmsContent data={contact} />,
    "betting-rules": <CmsContent data={rules} />,
  }[current];

  return (
    <div className="help start">
      <div className="help_select">
        {links.map((item: { name: string; link: string }, idx: number) => (
          <div
            className={`select_text ${current === item.link && "active"}`}
            key={idx}
            onClick={() => setCurrent(item.link)}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className="help_content">{component}</div>
    </div>
  );
};

export default HelpBlock;
