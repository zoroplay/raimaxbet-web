"use client";
import { useEffect, useState } from "react";

const useTimer = (initialTime: any, status: string) => {
  // console.log(initialTime, "ini");

  const [time, setTime] = useState({
    minutes: initialTime !== "--:--" ? initialTime.split(":")[0] : "--:--",
    seconds: initialTime !== "--:--" ? initialTime.split(":")[1] : "--:--",
  });

  useEffect(() => {
    // if (status === "Halftime") return;

    const interval = setInterval(() => {
      if (!initialTime || initialTime === "--:--") {
        return;
      }
      setTime((prev) => {
        let { minutes, seconds } = { ...prev };
        minutes = parseInt(minutes, 10);
        seconds = parseInt(seconds, 10);
        seconds++;

        if (seconds >= 60) {
          minutes++;
          seconds = 0;
        }

        return { minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [status, initialTime]);

  const formattedTime = `${time.minutes.toString().padStart(2, "0")} `;
  // : ${time.seconds.toString().padStart(2, "0")}

  // console.log(
  //   `${time.minutes.toString().padStart(2, "0")} : ${time.seconds
  //     .toString()
  //     .padStart(2, "0")}`,
  //   "time"
  // );

  return formattedTime;
};
export default useTimer;
