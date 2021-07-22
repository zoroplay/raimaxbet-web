import React, {useState} from "react";
import {Formik, Field} from "formik";
import {changePassword} from "../../Services/apis";
import * as Yup from "yup";
import {useDispatch} from "react-redux";
import {LOADING, REMOVE_USER_DATA, SHOW_MODAL} from "../../Redux/types";

const ChangePasswordSchema = Yup.object().shape({
    old_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .required("Enter your old password"),
    new_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .required("Enter a new password"),
    conf_password: Yup.string()
        .min(3, "Minimum 4 letters")
        .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
        .required("Confirm your new password"),
});

export default function ChangePassword({match, history}) {
    const [errMsgs, setErrMsgs] = useState([]);
    const dispatch = useDispatch();

    const submitForm = (values, {setSubmitting}) => {
        dispatch({type: LOADING});

        changePassword(values).then(res => {
            setSubmitting(false);
            dispatch({type: LOADING});

            if(res.success) {
                // dispatch({type: SHOW_MODAL, payload: {show: true, type: 'message', title: 'Password Change Successful', message: 'Your password has been changed successfully. Login to continue'}})
                setTimeout(() => {
                    dispatch({type: REMOVE_USER_DATA});
                    history.push('/');
                }, 2000);
            } else {
                setErrMsgs([...errMsgs, res.message]);
            }
        }).catch(err=> {
            setSubmitting(false);
            dispatch({type: LOADING});

            if (err.response.status === 422){
                let errors = Object.values(err.response.data.errors);
                errors = errors.flat();
                setErrMsgs(errors);
            }
        })
    }

    return (
        <>
            <div id="MainContent" className="">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div id="s_w_PC_PC_panelSquare">
                                <div className="RiquadroNews Reg">
                                    <div className="Cnt">
                                        <div>
                                            <div id="s_w_PC_PC_upDati">
                                                <div id="s_w_PC_PC_panelPwd">
                                                    <Formik
                                                        enableReinitialize={true}
                                                        initialValues={{
                                                            old_password: '',
                                                            new_password: '',
                                                            conf_password: '',
                                                        }}
                                                        validationSchema={ChangePasswordSchema}
                                                        children={(props) => <ChangePasswordForm {...props} />}
                                                        onSubmit={submitForm}
                                                    />

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function ChangePasswordForm({
                                       errors,
                                       touched,
                                       setFieldValue,
                                       handleSubmit,
                                       isSubmitting,
                                       isValid,
                                       values,
                                   }) {
    const {new_password, old_password, conf_password} = values;

    return (
        <form className="account form p15" id="change-password" onSubmit={handleSubmit} noValidate="novalidate">
            <table width="100%" cellSpacing="0" className="tblPP">
                <tbody>
                <tr>
                    <td colSpan="4" className="cellaInfo">In this section you
                        will be able to modify your password you insert a
                        different new password that or from the precedence.
                    </td>
                </tr>
                <tr>
                    <td className="cellaSx" width="100%">Current Password</td>
                    <td className="cellaSx"><b>*</b></td>
                    <td className="cellaDx">
                        <Field
                            name="old_password"
                            type="password"
                            maxLength="32"
                            value={old_password}
                            id="s_w_PC_PC_CurrentPassword"
                            className="textbox"
                            style={{width: '150px' }}
                        />
                        {errors.old_password && touched.old_password ? (
                            <span id="s_w_PC_PC_reqCurrentPassword" style={{color:'Red'}}>
                                <span className="imgError">{errors.old_password}</span>
                            </span>
                        ) : null}
                    </td>
                    <td className="rfv">
                    </td>
                </tr>
                <tr>
                    <td className="cellaSx">Password</td>
                    <td className="cellaSx"><b>*</b></td>
                    <td className="cellaDx">
                        <Field
                            name="new_password"
                            type="password"
                            maxLength="32"
                            value={new_password}
                            id="s_w_PC_PC_Password"
                            className="textbox"
                            style={{width: '150px'}}
                        />
                        {errors.password && touched.password ? (
                            <span id="s_w_PC_PC_reqPassword" style={{color:'Red'}}>
                                <span className="imgError">{errors.password}</span>
                            </span>
                        ) : null}
                    </td>
                    <td className="rfv">

                    </td>
                </tr>
                <tr>
                    <td className="cellaSx">Confirm Password</td>
                    <td className="cellaSx"><b>*</b></td>
                    <td className="cellaDx">
                        <Field
                            name="conf_password"
                            type="password"
                            value={conf_password}
                            maxLength="32"
                            id="s_w_PC_PC_Confirm"
                            className="textbox"
                            style={{width:'150px'}}
                        />
                        {errors.conf_password && touched.conf_password ? (
                            <span id="s_w_PC_PC_reqConfirmPassword" style={{color:'Red'}}>
                                <span className="imgError">{errors.conf_password}</span>
                            </span>
                        ) : null}
                    </td>
                    <td className="rfv">

                    </td>
                </tr>
                <tr>
                    <td colSpan="4">
                        <div className="spacer5"/>
                    </td>
                </tr>
                <tr>
                    <td align="right" colSpan="3">
                        <input
                            type="button"
                            name="s$w$PC$PC$btnResetPwd"
                            value="Clear" id="s_w_PC_PC_btnResetPwd"
                            className="button"
                        />
                        <button type="submit" disabled={isSubmitting} className="button" id="updatePassword">Confirm</button>
                    </td>
                    <td></td>
                </tr>
                </tbody>
            </table>
        </form>
    )
}
