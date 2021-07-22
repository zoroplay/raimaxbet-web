import React, {useEffect} from 'react';
import Others from "../layout/Others";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {resetPassword} from "../../Services/apis";
import {Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {SHOW_LOGIN_MODAL} from "../../Redux/types";

const error = {
    border: '1px solid red',
    backgroundColor: 'pink'
};
const FormSchema = Yup.object().shape({
    password: Yup.string()
        .min(3, "Minimum 4 letters")
        .required("Enter a password"),
    confirm_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .oneOf([Yup.ref('password'), null], 'Passwords do not match')
        .required("Please confirm your password"),
});

export default function ResetPassword({history}) {

    const dispatch = useDispatch();

    const {username} = useSelector((state) => state.auth);

    useEffect(() => {
        if (!username) {
            toast.error('Something went wrong. Please resend verification code');
            history.push('/Auth/RecoverPassword');
        }
    }, [username]);

    const submit = (values, {setSubmitting}) => {
        values.username = username;

        resetPassword(values).then(res => {
            setSubmitting(false);
            if (res.success) {
                dispatch({type: SHOW_LOGIN_MODAL});
                history.push('/')
            } else {
                toast.error(res.message);
            }
        }).catch(err => {
            setSubmitting(false);
        });
    }

    return (
        <Others>
            <div className="forgot-password-page">
                <div className="grid">
                    <div className="forgot-password-holder">
                        <div className="block-title">
                            <img src="//atlantiq1.brlgcs.com/atlantiq1/images/arrow-down.png" alt="" className="title-icon" />
                            <span>Reset your Password</span>
                        </div>
                        <div className="forgot-password-content">
                            <p>Enter your new password </p>
                            <Formik
                                initialValues={{ password: '', confirm_password: '' }}
                                validationSchema={FormSchema}
                                onSubmit={submit}
                            >
                                {({ isSubmitting,  errors }) => (
                                    <Form className="form-holder">
                                        <div className="input-group">
                                            <p className="label">New Password:</p>
                                            <Field
                                                style={errors.password ? error : null}
                                                type="password"
                                                id="password"
                                                placeholder="*********"
                                                name="password"
                                            />
                                        </div>
                                        <div className="input-group">
                                            <p className="label">Confirm Password:</p>
                                            <Field
                                                style={errors.confirm_password ? error : null}
                                                type="password"
                                                id="confirm_password"
                                                placeholder="*********"
                                                name="confirm_password"
                                            />
                                        </div>
                                        <br />
                                        <button
                                            className="aqx-loax-btn"
                                            type="submit"
                                            disabled={isSubmitting}
                                        >Change Password {isSubmitting && <i className="fa fa-spin fa-spinner" /> }</button>

                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </Others>
    )
}
