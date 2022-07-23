import { Http } from "../Utils";
import {toast} from "react-toastify";

export const fetchGlobalVars = () =>
    Http.get(`/utilities/globalvariables`);

export const fetchBonusList = () =>
    Http.get(`/utilities/bonuslist?section=onliners`);

export const getGatewayKeys = (gateway) =>
    Http.get(`utilities/get-gateway-keys/${gateway}`);

export const getSportMenu = (period, start=null, end=null) =>
    Http.get(`/sports/get-menu?period=${period}&start=${start}&end=${end}`);

export const getBanners = () =>
    Http.get(`/sports/banners?banner_type=web`);

export const getTopBets = () =>
    Http.get(`/sports/topbets`);

export const fetchFixturesByDate = date =>
    Http.get(`/sports/get-fixtures-by-date?date=${date}&channel=website`);

export const fetchFixturesByDateSport = (date, sport_id) =>
    Http.get(`/sports/get-fixtures-by-sport-date?date=${date}&sid=${sport_id}&channel=website`);

export const getFixture = (eventId) =>
    Http.get(`sports/get-fixture/${eventId}`);

export const getMatches = (tid) =>
    Http.get(`sports/get-matches/${tid}`);

export const getFixtures = (tid, sid) =>
    Http.get(`sports/get-fixtures/${tid}?sid=${sid}&source=web`);

export const loadCoupon = (code, action) =>
    Http.get(`sports/booking/${code}?action=${action}`);

export const todaysBet = () =>
    Http.get('/user/account/today-bets');

export const findCoupon = (code) =>
    Http.get(`sports/find-coupon/${code}`);

export const login = (username, password) =>
    Http.post(`auth/login`, { username, password });

export const sendLogout = () =>
    Http.get(`auth/logout`);

export const authDetails = () =>
    Http.get(`auth/details`);

export const register = (data) =>
    Http.post(`auth/register?client=website`, data );

export const sendVerification = (data) =>
    Http.post(`auth/send-verification-code`, data);

export const confirmVerification = (data) =>
    Http.post(`auth/confirm-verification-code`, data);

export const resetPassword = (data) =>
    Http.post(`auth/reset-password`, data);

export const getBetList = (data, page) =>
    Http.post(`/user/account/my-bets?page=${page}`, data);

export const getJackpotBetList = (data, page) =>
    Http.post(`/user/account/my-jackpot-bets?page=${page}`, data);

export const cancelTicket = (ticket) =>
    Http.get(`user/account/betslip/${ticket}/cancel`);

export const getTransactions = (data, page) =>
    Http.post(`user/account/get-transactions?page=${page}`, data);

export const getBonusTransactions = (data, page) =>
    Http.post(`user/account/get-bonus-transactions?page=${page}`, data);

export const getBonuses = () =>
    Http.get(`user/account/get-bonuses`);

export const redeemBonus = () =>
    Http.get(`user/account/redeem-bonus?source=website`);

export const getWithdrawalInfo = () =>
    Http.get(`user/account/withdrawal-info` );

export function saveTransaction(res){
    Http.post('utilities/save-payment-transaction', res).then(res => {

    }).catch(err=>{

    })
}

export const saveSureOddsPayments = (data) => {
    Http.post('sports/sure-odds-payment', data).then(res => {
        if (res.success) {
            toast.success(`Success!! Your payment was successful. One of our representative will contact you shortly`);
        } else {
            toast.error(res.message);
        }
    }).catch(err => toast.error('Unable to complete transaction. Please contact support'));
}

export const getPersonalData = () =>
    Http.get('/user/account/personal-data');

export const changePassword = (data) =>
    Http.post('user/account/change-password', data);

export const postWithdrawal = (data) =>
    Http.post('user/account/withdraw', data);

export const getMarkets = (tid, sid, market_id, date = '') =>
    Http.get(`sports/get-odds/${tid}?sid=${sid}&market_id=${market_id}&date=${date}`);

export const findFixtures = (keyword) =>
    Http.get(`sports/search?q=${keyword}`);

export const findFixture = (event_id) =>
    Http.get(`/sports/find-fixture/${event_id}`);

export const findFixtureWithOutcomes = (event_id) =>
    Http.get(`/sports/get-fixture-outcomes/${event_id}`);

export const findCode = (data) =>
    Http.post('/sports/find-code', data);

export const addUser = (data) =>
    Http.post('/user/account/add-user', data);

export const sendFund = (data) =>
    Http.post('/user/account/agent/fund-user', data);

export const agentChangePassword = (data) =>
    Http.post('/user/account/agent/change-password', data);

export const sportsReport = (data) =>
    Http.post('/user/account/sports-report', data);

export const processCashout = (betslip_id) =>
    Http.get(`user/account/cashout/${betslip_id}`);

export const oddsLessThan = (data) =>
    Http.post(`/sports/odds-less-than`, data);

export const oddsLessThanFixtures = (data) =>
    Http.post(`/sports/odds-less-than/fixtures`, data);

export const saveNewAgent = (data) =>
    Http.post('/save-new-agent', data);

export const getCombos = (couponData) =>
    Http.post('/sports/get-combos', {selections: couponData.selections});

export const getSplitProps = async (couponData) => {
    const res = await Http.post('/sports/get-split-props', {selections: couponData.selections});
    couponData.noOfCombos = res.noOfCombos;
    couponData.minOdds = res.minOdds;
    couponData.maxOdds = res.maxOdds;
    couponData.maxBonus = res.maxBonus;
    couponData.minWin = res.minWin;
    couponData.maxWin = res.maxWin;

    return couponData;
}

export const getLiveFixtures = () =>
    Http.get(`/sports/live`);

export const getLiveFixtureData = (eventId) =>
    Http.get(`sports/live/${eventId}/en`);

export const getUpcomingLive = () =>
    Http.get('/sports/live/upcoming');

export const getOddsChange = (data) =>
    Http.post(`https://sb-btk-sportapi-cdn-micro-prod.azureedge.net/api/feeds/oddschanged/en`, data);

export const getJackpots = () =>
    Http.get('/sports/jackpots');

export const sendDeposit = (data) =>
    Http.post('/user/account/send-deposit', data);

export const sendWithdrawal = (data) =>
    Http.post('/user/account/send-withdrawal', data);

export const getTipsters = () =>
    Http.get('/sports/tipsters/all');

export const getTipsterBetslips = (user_id) =>
    Http.get(`/sports/tipsters/get-betslips/${user_id}`);

export const saveTipsterBet = (data) =>
    Http.post('/sports/tipsters/add', data);

export const rebetTipster = (data) =>
    Http.post('/sports/tipsters/rebet', data);

export const getPoolTickets = (data, page) =>
    Http.post(`/user/account/pool-tickets?page=${page}`, data);

export const getCouponTickets = (data, page) =>
    Http.post(`/user/account/coupon-tickets?page=${page}`, data);

export const getExpenses = () =>
    Http.get(`/list/expense`);

export const getExpensesType = () =>
Http.get(`/list/expense/type`);

export const postExpense = (data) =>
Http.post(`/create/expense`, data);

export const getCashOuts = () =>
Http.get(`/admin/list/cashout`);

export const getCashIn = () =>
Http.get(`/admin/list/cashin`);

export const getAllLivescore = () =>
Http.get(`/sportscore/score-event`);

export const getLivescore = () =>
Http.get(`/sportscore/sportscore-live`);