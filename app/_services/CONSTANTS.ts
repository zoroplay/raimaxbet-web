// auth/user
export const REGISTER = "/auth/register";
export const LOGIN = "/auth/login";
export const VERIFY_USER = "/auth/verify-username";
export const CHANGE_PASSWORD = "/auth/update/password";
export const RESET_PASSWORD = "/auth/update/reset-password";
export const UPDATE_USER = "/auth/update/details";
export const GET_USER = "/auth/details";
export const TRANSACTIONS = "/user/wallet/transactions";

// sports
export const GET_SPORTS = "/sports/menu";
export const GET_SPORT_CATEGORY = "/sports/categories";
export const GET_TOURNAMENTS = "/sports/tournaments";
export const UPCOMING_FIXTURES = "/sports/highlight/prematch";
export const LIVE_FIXTURES = "/sports/highlight/live";
export const GET_FIXTURES_BY_CATEGORY = "/sports/get-fixtures-by-category";
export const LIVE_COUNT = "/sports/live/games/count";
export const FIXTURE = "/sports/get-fixtures";
export const FIXTURE_SINGLE = "/sports/match";
export const TOP_TOURNAMENT = "/sports/top-bets";
export const CHANGE_ODDS = "/sports/get-odds";
export const SLIDERS = "/sports/mobile/sliders?banner_type=mobile";
export const GLOBALVAR = "/utilities/globalvariables";
export const BONUSLIST = "/utilities/bonuslist?section=onliners";
export const GET_FIXTURE_BY_DATE = "/sports/get-fixtures-by-date";
// export const GROUP_BY_SPORTS = "/sports/group-fixtures-by-sport";
export const TOP_BETS = "/sports/top-bets";
export const EVENT_SEARCH = "/sports/search";
export const FAVOURITE = "/sports/sports/add-favourite";

// Casino
export const ALL_CATEGORIES_BY_PROVIDER = "/casino/web-categories";
export const ALL_GAMES_BY_CATEGORY = "/casino/get-games";
export const ALL_TOP_CATEGORIES = "/casino/top-games-categories";
export const GET_BY_TOP_CATEGORIES = "/casino/top-games";
export const GET_BY_TOP_CATEGORY = "/casino/web-games";

// Deposits
export const GET_ALL_PAYMENT = "/utilities/payment-methods";
export const INITIATE_DEPOSIT = "/user/wallet/initiate-deposit?source=mobile";
export const VERIFY_PAYMENT = "/user/wallet/verify-payment";

// Withdrawals
export const ALL_BANKS = "/utilities/list-banks";
export const GET_BANK_ACCOUNT = "/user/wallet/bank-accounts";
export const WITHDRAW = "/user/wallet/withdraw";
export const VERIFY_ACCOUNT = "/user/wallet/verify-bank-account";

// Bets
export const BOOK_BET = "/bets/book-bet";
export const REBET = "/sports/booking";
export const PLACE_BET = `/bets/place-bet`;
export const BET_LIST = "/bets/history";
export const SETTLED_BET = "/user/account/settled-bets";
export const OPENED_BET = "/user/account/open-bets";
export const FIND_WITH_BOOKING_CODE = "/bets/get-booking";
export const FIND_WITH_BETSLIP = "/bets/find-bet";

// Notifications
export const VERIFY_OTP = "/notification/verify-otp";
export const SEND_OTP = "/notification/send-otp";

// Bonus
export const GET_USER_BONUS = "/bonus/user/list";
export const CHECK_FIRST_DEPOSIT = "/bonus/user/check-deposit-bonus";
export const AWARD_BONUS = "/bonus/user/award";

// Cms
export const ABOUT_US = "/utilities/cms/page/about-us";
export const FAQ = "/utilities/cms/page/faq";
export const RESPONSIBLE = "/utilities/cms/page/responsible-gaming";
export const TERMS = "/utilities/cms/page/terms-and-condition";
export const RULES = "/utilities/cms/page/betting-rules";
export const CONTACT = "/utilities/cms/page/contact-us";
