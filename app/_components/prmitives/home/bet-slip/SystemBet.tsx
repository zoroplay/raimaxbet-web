import { displayComboName, formatNumber, handleFocus } from "@/_utils/helpers";
import React, { useEffect, useState } from "react";
import { AiFillQuestionCircle } from "react-icons/ai";
import { IoIosCheckmark } from "react-icons/io";
import { BiChevronDown } from "react-icons/bi";
import CouponCalculation from "@/_utils/CouponCalculation";
import { updateCoupon } from "@/_redux/slices/betslip.slice";
import { useAppSelector } from "@/_hooks";

interface SystemBetProps {
  coupon: any;
  dispatch: any;
  SportsbookBonusList: any;
}

export const SystemBet = ({
  coupon,
  dispatch,
  SportsbookBonusList,
}: SystemBetProps) => {
  const [bank, setBank] = useState(true);
  const [accept, setAccept] = useState(false);
  const [isCombiOpen, setIsCombiOpen] = useState(false);
  const { SportsbookGlobalVariable } = useAppSelector((state) => state.sport);
  const [defaultCombo, setDefaultCombo] = useState(
    coupon.combos[coupon.combos.length - 1]
  );

  const couponCalculation = new CouponCalculation();

  useEffect(() => {
    if (coupon.combos.length)
      setDefaultCombo(coupon.combos[coupon.combos.length - 1]);
  }, [coupon]);

  const minMaxWin = (e: any, data: any, i: number) => {
    let val = e.target.value;
    let coupondata = { ...coupon };
    let combo = { ...data };
    let stake = val;
    if (stake === "") {
      stake = 0;
    } else {
      stake = val;
    }

    combo.Stake = parseFloat(stake);

    if (!coupondata.Groupings || !coupondata.Groupings.length) {
      coupondata.Groupings = [combo];
    } else {
      const groupIndex = coupondata.Groupings.findIndex(function (g: any) {
        return g.Grouping === combo.Grouping;
      });
      if (groupIndex === -1) {
        coupondata.Groupings = [...coupondata.Groupings, combo];
      } else {
        //update combo stake
        const groupings = [...coupondata.Groupings];
        groupings[groupIndex] = combo;
        coupondata.Groupings = groupings;
      }
    }

    const calculatedCoupon = couponCalculation.calcPotentialWins(
      coupondata,
      SportsbookBonusList,
      SportsbookGlobalVariable.MinBonusOdd
    );
    coupondata = couponCalculation.updateFromCalculatedCoupon(
      coupondata,
      calculatedCoupon,
      SportsbookGlobalVariable,
      SportsbookBonusList
    );
    let total = 0;

    const combos: any = [];

    // update combos with max win
    coupondata.combos.forEach((item: any) => {
      let comboItem = { ...item };
      for (let i = 0; i < coupondata.Groupings.length; i++) {
        if (comboItem.Grouping === coupondata.Groupings[i].Grouping) {
          comboItem.minWin = formatNumber(coupondata.Groupings[i].minWin);
          comboItem.maxWin = formatNumber(coupondata.Groupings[i].maxWin);
          comboItem.Stake = coupondata.Groupings[i].Stake;
          comboItem.checked = true;
          total +=
            parseFloat(comboItem.Stake) *
            parseFloat(coupondata.Groupings[i].Combinations);
        }
      }
      combos.push(comboItem);
    });
    coupondata.combos = combos;
    coupondata.totalStake = total;
    coupondata.exciseDuty = (coupondata.totalStake * 0) / 100;
    coupondata.stake = coupondata.totalStake - coupondata.exciseDuty;

    return dispatch(updateCoupon(coupondata));
  };

  return (
    <React.Fragment>
      <div className="bet_slip_combi between">
        <div
          className="bet_slip_combi_text start"
          onClick={() => setIsCombiOpen(!isCombiOpen)}
        >
          <div className="combo_text">BS.AllCombs</div>
          <div
            className={`bet_slip_combi_icon ${isCombiOpen && "active_combi"}`}
          >
            <BiChevronDown />
          </div>
        </div>
        <div className="input_stake start">
          <div
            className="bet_slip_combi_text"
            style={{ textDecoration: "underline" }}
          >
            {defaultCombo?.Combinations || 0}x
          </div>
          <div className="input_stake_wrap">
            <input
              className="input_stake"
              placeholder="Stake"
              value={defaultCombo?.Stake}
              onFocus={handleFocus}
              onChange={(e) =>
                minMaxWin(e, defaultCombo, coupon.combos.length - 1)
              }
            />
          </div>
        </div>
      </div>
      <div>
        {isCombiOpen &&
          coupon.combos.length > 0 &&
          coupon.combos?.map(
            (combo: any, idx: number) =>
              idx < coupon.combos.length - 1 && (
                <div
                  key={idx}
                  className="bet_slip_combi between"
                  style={{ border: "none" }}
                >
                  <div className="bet_slip_combi_text">
                    <div>{displayComboName(combo.Grouping)}</div>
                    {combo.checked === true && (
                      <div>
                        <small>
                          {SportsbookGlobalVariable.Currency}
                          {combo.minWin}/{SportsbookGlobalVariable.Currency}
                          {combo.maxWin}
                        </small>
                      </div>
                    )}
                  </div>
                  <div className="input_stake start">
                    <div
                      className="bet_slip_combi_text"
                      style={{ textDecoration: "underline" }}
                    >
                      {combo.Combinations}x
                    </div>
                    <div className="input_stake_wrap">
                      <input
                        className="input_stake"
                        placeholder="Stake"
                        name={`imp_comb_${idx}`}
                        type="text"
                        value={combo.Stake}
                        onFocus={handleFocus}
                        onChange={(e) => minMaxWin(e, combo, idx)}
                      />
                    </div>
                  </div>
                </div>
              )
          )}
        <div className="set_bank between">
          <div className="set_bank_text start">
            <div>Set Bankers</div>
            <div className="set_bank_icon">
              <AiFillQuestionCircle />
            </div>
          </div>
          <div
            className={`inactive_switch ${bank && "active_switch"}`}
            onClick={() => setAccept(!bank)}
          >
            <div className="switch_tick center">
              <IoIosCheckmark />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
