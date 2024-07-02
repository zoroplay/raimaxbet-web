export const dayMonth = (dateString: string) => {
  if (!dateString) {
    return;
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const formattedDate = `${day}/${month}`;
  return formattedDate;
};
export const dayMonthTime = (dateString: string) => {
  if (!dateString) {
    return;
  }
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const time = date.toTimeString().slice(0, 8);
  const formattedDate = `${day}/${month} ${time}`;
  return formattedDate;
};

export const yearMonthDayTime = (originalDate: string) => {
  if (!originalDate) {
    return;
  }
  const date = new Date(originalDate);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDate;
};

export const convertDateFormat = (dateString: string) => {
  if (!dateString) {
    return;
  }
  const date = new Date(dateString);
  const today = new Date();
  if (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate() 

  ) {
    return "Today";
  }

  const dayOfWeek = date.toLocaleDateString("en-US", { weekday: "short" });
  const dayOfMonth = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "long" });

  return `${dayOfWeek} ${dayOfMonth} ${month}`;
};

// export const getDaysBeforeAndAhead = () => {
//   const today = new Date();
//   const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
//   const threeWeeksLater = new Date(
//     today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000
//   );
//   const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
//   const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
//   const todaysDate = today.toISOString().split("T")[0];
//   const threeDaysLaterDate = threeDaysLater.toISOString().split("T")[0];
//   const twoDaysLaterDate = twoDaysLater.toISOString().split("T")[0];
//   const threeWeeksLaterDate = threeWeeksLater.toISOString().split("T")[0];
//   const sevenDaysAgoDate = sevenDaysAgo.toISOString().split("T")[0];
//   return {
//     todaysDate,
//     threeWeeksLaterDate,
//     threeDaysLaterDate,
//     twoDaysLaterDate,
//     sevenDaysAgoDate,
//   };
// };

export const getDaysBeforeAndAhead = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const threeWeeksLater = new Date(
    today.getTime() + 3 * 7 * 24 * 60 * 60 * 1000
  );
  const twoDaysLater = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  const threeDaysLater = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);

  const formatDate = (date: Date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return `${year}-${month}-${day}`;
  };

  const todaysDate = formatDate(today);
  const threeWeeksLaterDate = formatDate(threeWeeksLater);
  const threeDaysLaterDate = formatDate(threeDaysLater);
  const twoDaysLaterDate = formatDate(twoDaysLater);
  const sevenDaysAgoDate = formatDate(sevenDaysAgo);

  return {
    todaysDate,
    threeWeeksLaterDate,
    threeDaysLaterDate,
    twoDaysLaterDate,
    sevenDaysAgoDate,
  };
};

export const changeStringDateFormat = (inputDate: string) => {
  if (!inputDate) {
    return;
  }
  const parts = inputDate.split("-");
  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${year}-${month}-${day}`;
  }
  return inputDate;
};
