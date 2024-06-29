import dayjs from "dayjs";
// import { convertDateFormat } from ".";

export const groupFixturesName = (data: any[]): any[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  let ArrKeyHolder: any = {};
  let Arr: any[] = [];
  data.forEach(function (item: any) {
    ArrKeyHolder[item.tournament] = ArrKeyHolder[item.tournament] || {};
    let obj: any = ArrKeyHolder[item.tournament];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.tournament = `${item.categoryName} - ${item.tournament}`;
    obj.events = obj.events || [];

    obj.events.push(item);
  });
  return Arr;
};

export const groupFixturesTime = (data: any[]): any[] => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  let ArrKeyHolder: any = {};
  let Arr: any[] = [];
  data.forEach(function (item: any) {
    ArrKeyHolder[item.date] = ArrKeyHolder[item.date] || {};
    let obj: any = ArrKeyHolder[item.date];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.event_date = `${dayjs(item.date).format('ddd D MMMM')} - ${item.eventTime}`;
    obj.events = obj.events || [];

    obj.events.push(item);
  });
  return Arr;
};
