// RootLayout.js
import React from "react";
import "./index.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ReduxProvider from "@/_provider/redux-provider";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Frapapa | Sports Betting",
  description: "Sports Betting, Bonus Wins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
