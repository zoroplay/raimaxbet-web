import { AnyIfEmpty } from "react-redux";
import { original } from "@reduxjs/toolkit";

export const calculateBonus = (
  coupondata: any,
  globalVars: any,
  bonusList: any
) => {
  if (!globalVars || !bonusList) {
    return;
  }
  let ticket_length = 0,
    totalBonusOdds = 1,
    minBonusOdd = globalVars?.MinBonusOdd,
    bonusInfo: any = {},
    bonus = 0;
  //count eligible tickets for bonus
  coupondata.selections.forEach((item: any) => {
    if (item.odds >= minBonusOdd) {
      totalBonusOdds = totalBonusOdds * item.odds;
      ticket_length++;
    }
  });

  //get bonus settings for ticket length
  bonusList.forEach((item: any) => {
    if (item.ticket_length === ticket_length) bonusInfo = item;
  });

  //calculate total bonus
  if (bonusInfo.bonus !== undefined) {
    const maxWin = totalBonusOdds * coupondata.totalStake;
    bonus = (maxWin * parseFloat(bonusInfo.bonus)) / 100;
  }
  return bonus;
};

export const createID = (
  event_id: number,
  provider_id: number,
  odd: number | string,
  id: number,
  event_name: string
) => {
  let oddname = String(odd).replace(/[^a-zA-Z0-9]/g, "_");
  let eventname = String(event_name).replace(/[^a-zA-Z0-9]/g, "_");
  return (
    event_id + "_" + provider_id + "_" + oddname + "_" + id + "_" + eventname
  );
};

export const isSelected = (item: any, id: string) => {
  const isExist = item?.coupon.selections.find(
    (item: any) => item.selectionId === id
  );
  return isExist;
};

export const multibetCombination = (item: { [x: string]: string }[]) => {
  if (item.length === 1) {
    return "Single";
  } else if (item.length > 1 && item.length <= 2) {
    return "Doubles";
  } else if (item.length > 2 && item.length <= 3) {
    return "Trebles";
  } else {
    return item.length;
  }
};

export const min = (list: number[]) => {
  let minValue = list[0];
  for (let i = 1; i < list.length; i++) {
    if (list[i] < minValue) {
      minValue = list[i];
    }
  }
  return minValue;
};

export const calculateWinnings = (
  couponData: any,
  globalVars: any,
  bonusList: any
) => {
  //calculate winnings
  let maxWin: number =
    parseFloat(couponData.totalOdds) * parseFloat(couponData.totalStake);
  //calculate bonus
  let maxBonus: number = calculateBonus(couponData, globalVars, bonusList)!;
  //add bonus to max winnings
  let total = maxWin + maxBonus;
  // calculate With-holding tax
  let wthTax = ((total - couponData.totalStake) * 0) / 100;

  return {
    maxWin: (total - wthTax).toFixed(2),
    grossWin: total,
    maxBonus: maxBonus,
    wthTax,
  };
};

export const checkBetType = (fixtures: any[]) => {
  let betType = "Multiple";
  if (fixtures.length === 1 && fixtures[0].selections.length === 1) {
    return (betType = "Single");
  }
  fixtures.forEach((item) => {
    if (item.selections.length > 1) {
      betType = "Split";
      return false;
    }
  });
  return betType;
};

export const groupSelections = (data: any) => {
  let ArrKeyHolder: { [key in string]: any } = {};
  let Arr: any[] = [];
  data.forEach(function (item: any) {
    ArrKeyHolder[item.matchId] = ArrKeyHolder[item.matchId] || {};
    let obj = ArrKeyHolder[item.matchId];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.eventName = item.eventName;
    obj.eventId = item.eventId;
    obj.type = item.type;
    obj.started = item.eventDate;
    obj.score = item.score;
    obj.selections = obj.selections || [];

    obj.selections.push(item);
  });
  return Arr;
};

export const groupTournament = (data: any) => {
  let ArrKeyHolder: { [key: string]: any } = {};
  let Arr: any[] = [];

  data.forEach((item: any) => {
    ArrKeyHolder[item.tournament] = ArrKeyHolder[item.tournament] || {};
    const obj: {
      tournamentName: string;
      category: string;
      combinability: string;
      events: any[];
      fixtures: any[];
    } = ArrKeyHolder[item.tournament];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.tournamentName = item.tournament;
    obj.category = item.category;
    obj.combinability = item.combinability;
    obj.events = obj.events || [];

    obj.events.push(item);
    obj.fixtures = groupSelections(obj.events);
  });

  return Arr;
};

export const calculateTotalOdds = (selections: any[]) => {
  let totalOdds = 1;

  selections.forEach((selection) => (totalOdds = totalOdds * selection.odds));

  return totalOdds;
};

export const checkIfHasLive = (selections: any[]) => {
  let hasLive = false;
  selections.forEach((item) => {
    if (item.type === "live") {
      hasLive = true;
    }
  });
  return hasLive;
};

export const getDataFromPayload = (couponPayload: any) => {
  const data: any = {
    matchId: parseInt(couponPayload.fixture.matchID),
    eventId: parseInt(couponPayload.fixture.gameID),
    eventName: couponPayload.fixture.name,
    marketId: couponPayload.market_id,
    marketName: couponPayload.market_name,
    specifier: couponPayload.specifier,
    outcomeName: couponPayload.outcome.outcomeName,
    displayName: couponPayload.outcome.displayName,
    outcomeId: couponPayload.outcome.outcomeID,
    odds: parseFloat(couponPayload.outcome.odds).toFixed(2),
    eventDate: couponPayload.fixture.date,
    tournament: couponPayload.fixture.tournament,
    category: couponPayload.fixture.categoryName,
    sport: couponPayload.fixture.sportName,
    sportId: couponPayload.fixture.sportID,
    type: couponPayload?.type || "pre",
    fixed: false,
    combinability: couponPayload.fixture.combinability || 0,
    selectionId: couponPayload.id,
    element_id: couponPayload.id,
    homeTeam:
      couponPayload.fixture.homeTeam || couponPayload.fixture.competitor1,
    awayTeam:
      couponPayload.fixture.awayTeam || couponPayload.fixture.competitor2,
    producerId:
      couponPayload.outcome.producerID || couponPayload.fixture.producerID,
    stake: 0,
  };
  if (couponPayload?.type === "live") {
    data.inPlayTime = couponPayload.fixture.eventTime;
    data.score =
      couponPayload.fixture.homeScore + ":" + couponPayload.fixture.awayScore;
  }
  return data;
};

export const formatNumber = (number: any) =>
  !number
    ? 0
    : parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

class SlotKey {
  constructor(private _matchId: number, private _index: number) {}

  getKey(): string {
    return `${this._matchId}_${this._index}`;
  }
}

export const formattedPhoneNumber = (phoneNumber: any) => {
  const pNumber = phoneNumber.toString();
  const first = pNumber.charAt(0);
  if (first === "0") {
    return pNumber.substring(1);
  }
  return pNumber;
};

async function getSplitProps(couponData: any) {
  const payload = { selections: couponData.selections };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PROD_API}/sports/get-split-props`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  const res = await response.json();
  const data: any = {};
  data.noOfCombos = res.noOfCombos;
  data.minOdds = res.minOdds;
  data.maxOdds = res.maxOdds;
  data.maxBonus = res.maxBonus;
  data.minWin = res.minWin;
  data.maxWin = res.maxWin;

  return data;
}

export { getSplitProps };

export const getPlacedBetStatus = (status: number) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Won";
    case 2:
      return "Lost";
    case 3:
      return "Cancelled";
    case 4:
      return "Void";
    default:
      return "Unknown";
  }
};

export const displayComboName = (grouping: number) => {
  switch (grouping) {
    case 1:
      return "Single";
    case 2:
      return "Double";
    case 3:
      return "Treble";
    default:
      return grouping + " folds";
  }
};

export const sortArr = (arr: any, field: any) => {
  if (arr && arr.length) {
    const copyArr = [...arr];
    return copyArr.sort((a: any, b: any) => a[field] - b[field]);
  } else {
    return arr;
  }
};

export const handleFocus = (event: any) => event.target.select();

export const compareLists = (
  list1: { [key in string]: string }[],
  list2: { [key in string]: string }[]
) => {
  if (list1.length !== list2.length || !list1.length || !list2.length) {
    return true;
  }

  // for (let i = 0; i < list1.length; i++) {
  //   if (list1[i] !== list2[i]) {
  //     return true;
  //   }
  // }

  return false;
};
