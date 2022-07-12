import React, {useEffect, useState} from "react";
import {formatOdd, getSpread, isSelected} from "../../Utils/helpers";
import {createID} from "../../Utils/couponHelpers";
import {addToCoupon} from "../../Redux/actions";
import {useDispatch} from "react-redux";

export const LiveOdd = ({newOdds, outcome, market, fixture, tournament, sport, coupon, globalVars, bonusList}) => {
    const [oddsData, setOddsData] = useState(newOdds);
    const [oddChangeUp, setOddChangeUp] = useState(false);
    const [oddChangeDown, setOddChangeDown] = useState(false);
    const dispatch = useDispatch();
    
    useEffect(() => {
        if (newOdds !== 0) {
            if(oddsData !== 0) {
                if (parseFloat(newOdds.odds) > parseFloat(oddsData.odds)) {
                    setOddChangeDown(false);
                    setOddChangeUp(true);
                    setOddsData(newOdds);
                } else if (parseFloat(newOdds.odds) < parseFloat(oddsData.odds)) {
                    setOddChangeUp(false);
                    setOddChangeDown(true);
                    setOddsData(newOdds);
                }
            } else {
                setOddChangeDown(false);
                setOddChangeUp(true);
                setOddsData(newOdds);
            }
        } else {
            setOddsData(newOdds);
            setOddChangeUp(false);
            setOddChangeDown(false);
        }
        // // check if current selection has event in it and update
        // if (coupon.selections.length) {
        //     checkOddsChange(coupon, fixture, newOdds, dispatch, globalVars, bonusList);
        // }
    }, [newOdds]);

    const selectOdds = () => {
        if (oddsData !== 0) {
            fixture.TournamentName = tournament;
            fixture.SportName = sport;
            dispatch(addToCoupon(fixture, oddsData.market_id, market.name + ' '+ getSpread(fixture.Markets, market), oddsData.odds, oddsData.id, outcome.name,
                createID(fixture.provider_id, oddsData.market_id, outcome.name, oddsData.id),'live'))
        }
    }

    return (
        <div
            className={`${(oddsData === 0 || (oddsData.Odds && oddsData.odds === 0)) ? 'blank' : 'oddItem'} ${oddChangeUp ? 'trend_2' : ''} ${oddChangeDown ? 'trend_4' : ''}
        ${(isSelected(createID(fixture.provider_id, oddsData.market_id, outcome.name, oddsData.id), coupon)) ? 'sel' : ''}
        `}
            onClick={selectOdds}
        >
            <div className="oddsTQ">{outcome.name}</div>
            {oddsData !== 0 && oddsData.odds !== 0 && <div className="oddsQ">
                <a><span>{formatOdd(parseFloat(oddsData.odds))}</span></a>
            </div>}
        </div>
    )
}
