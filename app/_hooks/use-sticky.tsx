"use client";
import { useState, useEffect } from "react";

const useSticky = (threshold: number, height: number = 0) => {
  const [isSticky, setIsSticky] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    if (scrollPosition > threshold && scrollPosition < height) {
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isSticky;
};

export default useSticky;
