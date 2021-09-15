import React, {useState} from 'react';
import {useDispatch} from "react-redux";
import {findFixtureWithOutcomes} from "../../Services/apis";
import {addToCoupon} from "../../Redux/actions";
import {createID} from "../../Utils/couponHelpers";
import {toast} from "react-toastify";

export default function QuickBet() {
    const [fixture, setFixture] = useState(null);
    const [outcomes, setOutcomes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [eventId, setEventId] = useState('');
    const dispatch = useDispatch();

    const findEvent = () => {
        if(eventId.length === 4) {
            setLoading(true);
            setFixture(null);
            setOutcomes([]);
            findFixtureWithOutcomes(eventId).then(res => {
                setLoading(false);
                if(!res.message){
                    setFixture(res);
                    setOutcomes(res.outcomes);
                }else{
                    toast.error(res.message);
                    setEventId('');
                    document.getElementById('code3').focus();
                }
            }).catch(err => setLoading(false) | toast.error('Something went wrong. Please try again'));
        }
    }

    const selectOutcome = value => {
        const selection = JSON.parse(value);
        dispatch(addToCoupon(fixture, selection.market_id, selection.market_name, selection.odds, selection.odd_id, selection.odd_name,
                        createID(fixture.provider_id, selection.market_id, selection.odd_name, selection.odd_id), fixture.fixture_type))

        reset();
    }

    const reset = () => {
        setFixture('');
        setOutcomes([]);
        setEventId('')
        document.getElementById('code3').focus();
    }

    return (
        <div className="single-block closed">
            <div className="block-title toggle-title">
                <img src="/img/arrow-down.png" alt=""
                     className="title-icon closed" />
                <span>QUICKBET</span>
                <div className="quick-btn">
                    <a href="#" onClick="javascript:betcode_splash();" className="quick-btn-link" />
                </div>
            </div>
            <div className="block-content">
                <form onSubmit="return false;" name="fastslip3">
                    <input type="text" autoComplete="off" name="code3" id="code3"
                           maxLength={4}
                           value={eventId}
                           onChange={(e) => setEventId(e.target.value)}
                           onKeyUp={findEvent}
                    />
                    <input type="submit" id="entercode3" name="entercode3" onClick={findEvent} />
                    <select id="segni3" name="pronostico3" onChange={(e) => {
                        if (e.target.value !== '')
                            selectOutcome(e.target.value)
                    }}>
                        <option value="">--select option--</option>
                        {outcomes.map(outcome => <option key={outcome.odd_id} value={JSON.stringify(outcome)}>{outcome.odd_name + ' ('+outcome.market_name+')'}</option> )}
                    </select>
                </form>
                <span id="evento3" className="match-name">{fixture?.event_name}</span>
                {loading && <i className={`fa fa-spin fa-spinner`} /> }
            </div>
        </div>
    )
}
