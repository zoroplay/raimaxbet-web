// RootLayout.js
import { Header, Footer, Modal, Toast } from "@/_components";
import React from "react";
import "./globals.scss";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import ReduxProvider from "@/_provider/redux-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Raimax | Sports Betting",
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
        <ReduxProvider>
          <Modal />
          <Header />
          {children}
          <Footer />
          <Toast />
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}
