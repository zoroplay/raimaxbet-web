import moment from "moment";
import * as _ from "lodash";
import { unslugify } from "unslugify";

export const getStats = (fixture) => {
  const statWrapper = document.getElementById(
    `SingleInsideStats_${fixture.provider_id}`
  );

  if (statWrapper.innerHTML === "") {
    statWrapper.innerHTML = "Loading...";
    statWrapper.style.color = "#000";
    statWrapper.style.backgroundColor = "#fff";
    window.SRLive.addWidget("widgets.matchhead2head", {
      matchId: fixture.provider_id,
      showTitle: !1,
      container: `#SingleInsideStats_${fixture.provider_id}`,
    });
  } else {
    statWrapper.innerHTML = "";
  }
};

export const slugify = (text) => {
  if (!text) return false;

  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export const unSlugify = (text = "") => _.capitalize(unslugify(text));

export const groupFixtures = (data) => {
  let ArrKeyHolder = [];
  let Arr = [];
  data.forEach(function (item) {
    ArrKeyHolder[item.event_date] = ArrKeyHolder[item.event_date] || {};
    let obj = ArrKeyHolder[item.event_date];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.event_date = item.event_date;
    obj.events = obj.events || [];

    obj.events.push(item);
  });
  return Arr;
};

export const groupBy = (data, field) => {
  if (data.length) {
    return data.reduce(function (rv, x) {
      (rv[x[field]] = rv[x[field]] || []).push(x);
      return rv;
    }, []);
  } else {
    return [];
  }
};

export const groupLiveSports = (data) => {
  let ArrKeyHolder = [];
  let Arr = [];
  data.forEach(function (item) {
    ArrKeyHolder[item.sport_tournament_id] =
      ArrKeyHolder[item.sport_tournament_id] || {};
    let obj = ArrKeyHolder[item.sport_tournament_id];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.sport_id = item.sport_id;
    obj.sport_name = item.sport_name;
    obj.category = item.sport_category_name;
    obj.Id = item.sport_tournament_id;
    obj.Name = item.sport_tournament_name;
    obj.Events = obj.Events || [];

    obj.Events.push(item);
  });
  return Arr;
};

export const liveScore = (score, team) => {
  if (score) {
    const scoreArray = score.split(":");
    if (team === "home") {
      return scoreArray[0];
    } else {
      return scoreArray[1];
    }
  }
};

export const formatDate = (str, format = "YYYY-MM-DD HH:mm") =>
  moment(str).format(format);

export const goBack = (history) => {
  history.goBack();
};

export const isSelected = (ele_id, coupon) => {
  let isExist = false;

  if (coupon.selections.length > 0) {
    let count = coupon.selections.find(
      (selection) => selection.element_id === ele_id
    );
    if (count) {
      isExist = true;
    }
  }
  return isExist;
};

export const formatNumber = (number) =>
  !number
    ? 0
    : parseFloat(number).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

export const toggleAccountMenu = (e) => {
  const ele = document.getElementById("account-menu");
  ele.classList.toggle("show");
};

export const toggleExtraMarket = (id) => {
  const ele = document.getElementById(id);
  if (ele) ele.classList.toggle("show");
};

export const getOdds = (prediction, outcomes) => {
  let odd = "";
  _.each(outcomes, (outcome) => {
    if (
      outcome.active != 0 &&
      outcome.id === prediction.odd_id &&
      outcome.name === prediction.odd_name
    ) {
      odd = outcome.odds;
    }
  });

  if (odd !== "" || odd !== "OFF" || odd !== 0) {
    return odd > 0 ? parseFloat(odd).toFixed(2) : "-";
  } else {
    return "-";
  }
};

export const getLiveOdds = (eventMarkets, market, selection) => {
  let odd = 0;
  if (eventMarkets && eventMarkets.length) {
    _.each(eventMarkets, function (value, key) {
      if (value.active === "1" && value.id === market.id && !market.hasSpread) {
        _.each(value.odds, function (item, index) {
          if (item.active === "1" && item.type === selection.type) {
            item.market_id = value.id;
            odd = item;
          }
        });
      } else if (
        value.active === "1" &&
        value.type_id === market.id &&
        market.hasSpread
      ) {
        _.each(value.odds, function (item, index) {
          if (item.active === "1" && item.type === selection.type) {
            item.market_id = value.id;
            odd = item;
          }
        });
      }
    });
  }

  return odd;
};

export const getSpread = (eventMarkets, market) => {
  let specialValue;
  if (eventMarkets && eventMarkets.length) {
    _.each(eventMarkets, (value, key) => {
      if (
        value.specialOddsValue &&
        value.type_id === market.id &&
        value.active === "1"
      ) {
        if (value.specialOddsValue > 0) specialValue = value.specialOddsValue;
      }
    });
  }
  return specialValue;
};

export const formatOdd = (odd) => {
  if (odd > 0 && odd % 1 === 0) {
    return odd + ".00";
  } else {
    return odd;
  }
};

export const openFastCode = () => {
  let url = `${process.env.REACT_APP_BASEURL}/Sport/ShortCodes`;
  window.open(
    url,
    "mywin",
    "left=5,width=558,height=500,toolbar=1,resizable=0"
  );
};

export const sortTeams = (teams) => {
  return teams.slice().sort((a, b) => a.ItemOrder - b.ItemOrder);
};

export const formattedPhoneNumber = (phoneNumber) => {
  const pNumber = phoneNumber.toString();
  const first = pNumber.charAt(0);
  if (first === "0") {
    return pNumber.substring(1);
  }
  return pNumber;
};

export const formatBetslipId = (id) => {
  if (id) {
    const splitText = id.split("-");
    return "**********-" + splitText[1];
  }
};

export const formatName = (name) => {
  const first3 = name.substring(0, 3);
  const last2 = name.substring(7);
  return first3 + "****" + last2;
};

export const calculateExclusionPeriod = (date) => {
  return moment(date).diff(moment(), "days");
};

export const checkNoOfDraws = (selections) => {
  let no_of_draws = 0;
  selections.forEach((selection) => {
    if (selection.oddname === "X") no_of_draws++;
  });
  return no_of_draws === selections.length && no_of_draws > 5;
};
export const validateCombinability = (no_of_fixtures, tournaments) => {
  let res = {success: true};
  tournaments.forEach((tournament) => {
      switch (tournament.combinability) {
          case 'double':
              if (no_of_fixtures < 2) {
                  res = {
                      success: false,
                      message: 'You must select minimum of 2 games under ' + tournament.category + ' -> ' + tournament.tournamentName
                  };
              }
              break;
          case 'treble':
              if (no_of_fixtures < 3) {
                  res = {
                      success: false,
                      message: 'You must select minimum of 3 games under ' + tournament.category + ' -> ' + tournament.tournamentName
                  };
              }
              break;
          case 'min_5':
              if (no_of_fixtures < 5) {
                  res = {
                      success: false,
                      message: 'You must select minimum of 5 games under ' + tournament.category + ' -> ' + tournament.tournamentName
                  };
              }
              break;
      }
  });
  return res;
}