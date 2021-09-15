import React, {useState} from 'react';
import {findCoupon} from "../../Services/apis";
import {LOADING, SET_BETSLIP_DATA} from "../../Redux/types";
import {useDispatch} from "react-redux";

export default function CouponCheck() {
    const [couponCode, setCouponCode] = useState('');
    const dispatch = useDispatch();

    const showCoupon = (e) => {
        e.preventDefault();

        if (couponCode.length) {
            dispatch({type: LOADING});
            findCoupon(couponCode).then(res => {
                dispatch({type: LOADING});
                if (res.message === 'found') {
                    setCouponCode('')
                    dispatch({type: SET_BETSLIP_DATA, payload: res.coupon});
                } else {
                    alert('Coupon does not exist');
                }
            }).catch(err => dispatch({type: LOADING}))
        }
    }
    return (
        <div className="single-block">
            <div className="block-title">
                <img src="/img/check-icon.png" alt="" className="title-icon" />
                <span>VERIFY COUPON</span>
            </div>
            <div className="block-content verify-coupon">
                <p>Insert coupon code to check the status of your bet</p>
                <form name="verificaCoupon" onSubmit={showCoupon}>
                    <input type="submit" />
                    <input
                        type="text"
                        placeholder="Coupon Code"
                        autoComplete="off"
                        id="verifyCouponId"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        onFocus={(e) => setCouponCode('')}
                    />
                </form>
            </div>
        </div>
    )
}
