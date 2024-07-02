"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className: string;
  activeClassName: string;
  rest?: Record<string, any>;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const NavLink = ({
  href,
  children,
  className,
  activeClassName,
  ...rest
}: NavLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  //   console.log(pathname);
  return (
    <Link
      href={href}
      className={`${className} ${isActive && activeClassName}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default NavLink;
