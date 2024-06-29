export interface CouponDataType {
  provider_id: string;
  event_id: string;
  event_name: string;
  market_id: string;
  market_name: string;
  oddname: string;
  odd_id: string;
  odds: string;
  start_date: string;
  tournament: string;
  category: string;
  sport: string;
  type: string;
  fixed: boolean;
  combinability: string;
  in_play_time?: string;
  score?: string;
}

export interface InitialStateCouponType {
  betPlaced: null;
  loadedCoupon: null;
  confirm: boolean;
  coupon: Coupon;
}

interface Coupon {
  acceptChanges: boolean;
  selections: [];
  combos: [];
  totalOdds: number;
  maxBonus: number;
  minBonus: number;
  grossWin: number;
  maxWin: number;
  minWin: number;
  stake: number;
  totalStake: number;
  minOdds: number;
  maxOdds: number;
  wthTax: number;
  exciseDuty: number;
  useBonus: boolean;
  event_type?: string;
  channel?: string;
  bet_type?: string;
}
