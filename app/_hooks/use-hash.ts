"use client";
import React, { useEffect, useState } from "react";

const useHash = () => {
  const [hash, setHash] = useState<string[]>(
    window.location.hash.slice(1).split("/")
  );
  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.slice(1).split("/"));
      alert("change")
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);
  return hash;
};

export default useHash;
