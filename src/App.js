import React from "react";
/**
 * packages
 */
import { SWRConfig } from "swr";
import { ToastContainer } from "react-toastify";

/**
 * others
 */
import { ErrorBoundary, Http } from "./Utils";
import Routes from "./Routes/Routes";
import { useCallback, useEffect } from "react";
import { fetchBonusList, fetchGlobalVars } from "./Services/apis";
import { useDispatch, useSelector } from "react-redux";
import * as types from "./Redux/types";
import DepositModal from "./Views/Components/Modals/DepositModal";
import LoginModal from "./Views/Components/Modals/LoginModal";
import ConfirmSlip from "./Views/Components/Modals/ConfirmSlip";
import ViewCoupon from "./Views/Components/Modals/ViewCoupon";
import TipsterForm from "./Views/Components/Modals/TipsterForm";

function App() {
  const dispatch = useDispatch();
  const { depositModal, loginModal, tipsterModal } = useSelector(
    (state) => state.sportsData
  );
  const couponData = useSelector((state) => state.couponData);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const init = useCallback(() => {
    Promise.all([fetchBonusList(), fetchGlobalVars()]).then((res) => {
      dispatch({ type: types.SET_BONUS_LIST, payload: res[0] });
      dispatch({ type: types.SET_GLOBAL_VAR, payload: res[1] });
    });
  }, [dispatch]);

  useEffect(() => {
    init();
  }, [init]);

  // update global variables on authentication status change
  useEffect(() => {
    init();
  }, [isAuthenticated, init]);

  return (
    <ErrorBoundary>
      <SWRConfig
        value={{
          fetcher: (url) => Http.get(url).then((res) => res),
          refreshInterval: 15 * 60 * 1000,
          shouldRetryOnError: false,
          revalidateOnFocus: false,
          errorRetryInterval: 0,
          errorRetryCount: 2,
        }}
      >
        <Routes />
      </SWRConfig>
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
      {depositModal && <DepositModal dispatch={dispatch} />}
      {loginModal && <LoginModal dispatch={dispatch} />}
      {couponData.betslip && <ViewCoupon betslip={couponData.betslip} />}
      {tipsterModal.show && (
        <TipsterForm betslip={tipsterModal.coupon} dispatch={dispatch} />
      )}
      {(couponData.confirm || couponData.betPlaced) && (
        <ConfirmSlip couponData={couponData} />
      )}
    </ErrorBoundary>
  );
}

export default App;
