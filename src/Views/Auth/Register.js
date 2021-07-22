import React, {useEffect, useRef} from 'react';
import Others from "../layout/Others";
import * as Yup from "yup";
import {useState} from "react";
import {Field, Form, Formik} from "formik";
import {confirmVerification, login, register, sendVerification} from "../../Services/apis";
import {toast} from "react-toastify";
import {useDispatch, useSelector} from "react-redux";
import {SET_USER_DATA} from "../../Redux/types";
import {formattedPhoneNumber} from "../../Utils/helpers";
import useSWR from "swr/esm/use-swr";

const error = {
    border: '1px solid red',
    backgroundColor: 'pink'
};

const RegisterSchema = Yup.object().shape({

    username: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter a username"),
    password: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter a password"),
    term: Yup.boolean().required('You have not accepted'),
    age: Yup.boolean().required('Confirm you are 18 or older'),
    confirm_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required("Please confirm your password"),
});

export default function Register({history}) {
    const [sending, setSending] = useState(false);
    const [otpStatus, setOtpStatus] = useState({loading: false, status: ''});
    const [otp, setOtp] = useState('');
    const [username, setUsername] = useState('');
    const dispatch = useDispatch();
    const {isAuthenticated} = useSelector((state) => state.auth);
    const [bg, setBg] = useState(null);

    const {data: res, error} = useSWR('/utilities/bg-image?type=registration&position=background');

    useEffect(() => {
        if (res && res.image_path) {
            setBg(res.image_path);
        }
    }, [res]);

    useEffect(() => {
        if (isAuthenticated)
            history.push('/Sport/Default');
    }, [isAuthenticated]);

    const [otpRef, setOtpRef] = useState({
        otp1: useRef(),
        otp2: useRef(),
        otp3: useRef(),
        otp4: useRef(),
        otp5: useRef(),
        otp6: useRef()
    });

    const sendSMS = async (username) => {
        if (username !== '') {
            setSending(true);
            await sendVerification({username}).then(res => {
                setSending(false);
                setUsername(username);
                console.log(res);
            }).catch(err => {
                setSending(false);

                toast.error('Unable to send SMS. Please try again');
            });
        }
    }

    const confirmOtp = async (otp) => {
        setOtpStatus({...otpStatus, loading: true});
        await confirmVerification({otp, username}).then(res => {
            setOtpStatus({...otpStatus, loading: false});
            if (res.success) {
                setOtpStatus({...otpStatus, status: 'true'});
            } else {
                setOtpStatus({...otpStatus, status: 'false'});
                toast.error(res.message);
            }
        }).catch(err => {
            setOtpStatus({...otpStatus, loading: false});
            toast.error('Invalid verification code.');
        });
    }

    const otpController = (e, next, prev, index) => {

        if (e.target.value.length < 1 && prev) {
            const code = otp.slice(0, -1);
            if (index === 1) {
                setOtp(code);
            } else {
                setOtp('');
            }
            prev.current.focus();
        } else if (next && e.target.value.length > 0) {
            const code = otp + e.target.value;
            // add value to code
            setOtp(code);
            next.current.focus();
        } else {
            const code = otp + e.target.value;
            // add value to code
            setOtp(code);
            if (index === 5) {
                confirmOtp(parseInt(code));
            }
            return 0;
        }
    }

    return (
        <Others>
            <div className="aqx-main">
                <div className="aqx-main-inner">

                    <div className="aqx-a">

                        <div className="aqx-banner">
                            <a href="#" className="aqx-banner-link">
                                <div className="aqx-banner-img" style={{backgroundImage: bg ? `url(${bg})` : 'http://atlantiq1.brlgcs.com/atlantiq1/images/aqx-reg-banner.jpg'}} />
                            </a>
                        </div>

                        <div className="aqx-sub">
                            <p className="aqx-txt">ALREADY HAVE AN ACCOUNT? <a className="aqx-txt-link" href="#">Sign in</a> here</p>
                        </div>
                    </div>

                    <div className="aqx-b">
                        <div className="aqx-b-head">
                            <h3 className="aqx-b-head-txt">Registration</h3>
                        </div>
                        <Formik
                            initialValues={{ username: '', password: '', confirm_password: '' }}
                            validationSchema={RegisterSchema}
                            onSubmit={(values, { setSubmitting }) => {
                                if (otpStatus.status === 'true') {

                                    values.username = formattedPhoneNumber(values.username);

                                    register(values).then(res => {
                                        setSubmitting(false);
                                        if(res.success) {
                                            const {username, password} = res.credentials;
                                            login(username, password).then(res => {
                                                dispatch({
                                                    type: SET_USER_DATA,
                                                    payload: {
                                                        user: res.user,
                                                        access_token: res.token,
                                                        isAuthenticated: true
                                                    }
                                                });
                                                history.push('/Sport/Default');

                                            }).catch(err => {
                                                if (err.response.status === 401) {
                                                    toast.error(err.message);
                                                }
                                            })
                                        }
                                    }).catch(err=> {
                                        setSubmitting(false);
                                        if (err.response.status === 422){
                                            let errors = Object.values(err.response.data.errors);
                                            errors = errors.flat();
                                            toast.error(errors);
                                        }
                                    })
                                } else {
                                    setSubmitting(false);

                                    toast.error('Please enter a valid verification code')
                                }
                            }}
                        >
                            {({ isSubmitting, touched, errors, values }) => (
                                <Form>
                                <div className="aqx-b-content">
                                    <div className="aqx-b-content-inner">

                                        <div className="aqx-loax-a">

                                            <div className="dnxreg-box">
                                                <div className="dnxreg-box-a">
                                                    <label htmlFor="" className="nxlabel">Mobile Number*</label>
                                                </div>
                                                <div className="dnxreg-box-b">
                                                    <div className="nxmob">
                                                        <select name="" id="" className="nxmob-select">
                                                            <option value="+254">+254</option>
                                                        </select>
                                                        <Field
                                                            style={errors.username ? error : null}
                                                            type="text"
                                                            className="nxmob-num"
                                                            placeholder="e.g 12345678"
                                                            name="username"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="aqx-loax-a-info">
                                                <i className="fa fa-info-circle aqx-loax-a-info-ico" /> Do not include 0 when
                                                entering your number; start with 7 or 1</p>
                                        </div>

                                        <div className="aqx-loax-b">
                                            <button
                                                className="aqx-loax-btn"
                                                onClick={() => sendSMS(formattedPhoneNumber(values.username))}
                                                disabled={sending}
                                            >Send code {sending && <i className="fa fa-spin fa-spinner" /> }</button>
                                        </div>

                                        <div className="aqx-loax-c">

                                            <div className="dnxreg-box">
                                                <div className="dnxreg-box-a">
                                                    <label htmlFor="" className="nxlabel">Code from SMS*</label>
                                                </div>
                                                <div className="dnxreg-box-b smsx-code">
                                                    <input type="text" ref={otpRef.otp1} className="nxfield" onChange={(e) => otpController(e, otpRef.otp2, '', 0)} placeholder="-" maxLength={1} />
                                                    <input type="text" ref={otpRef.otp2} className="nxfield" onChange={(e) => otpController(e, otpRef.otp3, otpRef.otp1, 1)} placeholder="-" maxLength={1} />
                                                    <input type="text" ref={otpRef.otp3} className="nxfield" onChange={(e) => otpController(e, otpRef.otp4, otpRef.otp2, 2)} placeholder="-" maxLength={1} />
                                                    <input type="text" ref={otpRef.otp4} className="nxfield" onChange={(e) => otpController(e, otpRef.otp5, otpRef.otp3, 3)} placeholder="-" maxLength={1} />
                                                    <input type="text" ref={otpRef.otp5} className="nxfield" onChange={(e) => otpController(e, otpRef.otp6, otpRef.otp4, 4)} placeholder="-" maxLength={1} />
                                                    <input type="text" ref={otpRef.otp6} className="nxfield" onChange={(e) => otpController(e, '', otpRef.otp5, 5)} placeholder="-" maxLength={1} />
                                                    <div style={{margin: 'auto'}}>
                                                        {otpStatus.loading ?
                                                        <i className="fa fa-spin fa-spinner" style={{color: 'white'}} />
                                                        :
                                                            {
                                                                'true': <i className="fa fa-check" style={{color: 'green'}} />,
                                                                'false': <i className="fa fa-times" style={{color: 'red'}} />
                                                            }[otpStatus.status]
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="dnxreg-box">
                                                <div className="dnxreg-box-a">
                                                    <label htmlFor="" className="nxlabel">Password*</label>
                                                </div>
                                                <div className="dnxreg-box-b">
                                                    <Field
                                                        style={errors.password ? error : null}
                                                        type="password"
                                                        id="dnxreg-pass1"
                                                        className="nxfield nx-field-pass"
                                                        placeholder="Password"
                                                        name="password"
                                                    />
                                                    <span className="showpass" id="showpass1" />
                                                </div>
                                            </div>

                                            <div className="dnxreg-box">
                                                <div className="dnxreg-box-a">
                                                    <label htmlFor="" className="nxlabel">Confirm Password*</label>
                                                </div>
                                                <div className="dnxreg-box-b">
                                                    <Field
                                                        style={errors.confirm_password ? error : null}
                                                        type="password"
                                                        id="dnxreg-pass2"
                                                        className="nxfield nx-field-pass"
                                                        placeholder="Confirm Password"
                                                        name="confirm_password"
                                                    />
                                                </div>
                                            </div>


                                            <div className="dnxreg-age">
                                                <div className="check">
                                                    <Field className="check-term" id="check-term" type="checkbox" name="term" />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <label htmlFor="check-term" className="dnxreg-age-txt">I accept the
                                                    <a href="#">Terms of use.</a>
                                                    {errors.term ? (
                                                        <span className="aqx-loax-a-info" style={{color:'Red'}}>{errors.term}</span>
                                                    ) : null}
                                                </label>
                                            </div>

                                            <div className="dnxreg-age">
                                                <div className="check">
                                                    <Field className="check-age" id="check-age" type="checkbox" name="age" />
                                                    <span className="checkmark"></span>
                                                </div>
                                                <label htmlFor="check-age" className="dnxreg-age-txt">I am over 18 years old.
                                                    {errors.age ? (
                                                    <span className="aqx-loax-a-info" style={{color:'Red'}}>{errors.age}</span>
                                                ) : null}</label>
                                            </div>

                                            <div className="aqx-loax-c-box">
                                                <button className="aqx-loax-btn aqx-loax-btn-go" type="submit" disabled={isSubmitting}>
                                                    Register {isSubmitting ? <i className="fa fa-spin fa-spinner" /> : '' }
                                                </button>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                                </Form>
                            )}
                        </Formik>
                    </div>

                </div>
            </div>
        </Others>
    )
}
