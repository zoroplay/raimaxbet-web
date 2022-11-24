import React, { useState} from "react";
import {Formik, Field} from "formik";
import * as Yup from "yup";
import {postWithdrawal} from "../../Services/apis";
import {UPDATE_USER_BALANCE} from "../../Redux/types";
import {useDispatch, useSelector} from "react-redux";
import '../../Assets/scss/_payments.scss';
import {toast} from "react-toastify";

const FormSchema = Yup.object().shape({
    amount: Yup.number().min(100, 'Missing amount')
        .required("Enter an amount"),
});

export function Withdrawal({history}) {
    const [details, setDetails] = useState(null);
    const [errMsg, setErrMsg] = useState(null);
    const dispatch = useDispatch();

    const submitForm = (values, {setSubmitting, resetForm}) => {
        postWithdrawal(values).then(res => {
            setSubmitting(false);
            if (res.success) {

                dispatch({type: UPDATE_USER_BALANCE, payload: res.available_balance});

                toast.success('Withdrawal request has been sent');

                resetForm({
                    amount: '',
                })
            } else {
                toast.error(res.message || res.error_message);
            }
        }).catch(err => {
            setSubmitting(false);
            if (err.response.status === 422){
                let errors = Object.values(err.response.data.errors);
                errors = errors.flat();
                toast.error(errors);
            } else {
                toast.error(err.message);
            }
        })
    }


    return (
        <>
            <div id="MainContent" className="">
                <div className="Riquadro">
                    <div className="CntSX">
                        <div className="CntDX">
                            <div className="payments">
                                <div className="RiquadroSrc">
                                    <div className="Cnt">
                                        <div>
                                            <div className="page__head">
                                                <div className="page__head-item"><h1> Withdraw Funds</h1></div>
                                                <div className="page__head-item txt-r"> All fields are
                                                    required
                                                </div>
                                            </div>
                                            <div className="page__body pt15 pb15">
                                                <div className="divide-holder">
                                                    <div className="one-half">
                                                        <Formik
                                                            enableReinitialize={true}
                                                            initialValues={{
                                                                amount: ''
                                                            }}
                                                            validationSchema={FormSchema}
                                                            children={(props) => <Form {...props} data={details} errMsg={errMsg} />}
                                                            onSubmit={submitForm}
                                                        />
                                                    </div>
                                                    <div className="txt-deepgray mt20">
                                                        {/* <h3 className="txt-darkgreen"> Bank Transfer</h3>
                                                        <strong>Withdrawal via Bank Transfer is for Free.</strong> Withdrawals via bank
                                                        transfer take up to 24 hours after authorisation and are only
                                                        actioned during banking hours. If your bank account is not
                                                        listed above, kindly add your bank account details below. */}
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
            </div>
        </>
    );
}

function Form({
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
                  isSubmitting,
                  isValid,
                  values,
                  errMsg
              }) {
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    const updateAmount = (value) => {
        if (value === 0) {
            setFieldValue('amount', value);
            return;
        }
        let currentAmount = amount;
        if (currentAmount === ''){
            currentAmount = 0;
        }
        setFieldValue('amount', currentAmount + value);
    }

    const {amount} = values;


    return (

        <form className="form" onSubmit={handleSubmit}>
            {/*<div className="info-box green">{paymentSuccess}</div>*/}
            {errMsg && <div className="callout red mb15">{errMsg}</div>}

            <div className="form-row">
                <div className="form-label"><strong> Withdrawal Amount ({SportsbookGlobalVariable.Currency})</strong></div>
                <div className={`form-input ${errors.amount ? 'error' : ''}`}>
                    <Field name="amount"
                           className="big" type="number"
                           step="100" maxLength="5" min="100" max="10000"
                           value={amount} onChange={(e) => setFieldValue('amount', e.target.value)}
                    />
                    <div className="form-input--stake"> Min 100</div>
                </div>
                {errors.amount && touched.amount ? (
                    <div className="form--error">{errors.amount}</div>
                ) : null}
                <div className="quickstake mt10">
                    <div className="quickstake__item" onClick={() => updateAmount(0)}> Clear</div>
                    <div className="quickstake__item" onClick={() => updateAmount(100)}> +100</div>
                    <div className="quickstake__item" onClick={() => updateAmount(200)}> +200</div>
                    <div className="quickstake__item" onClick={() => updateAmount(500)}> +500</div>
                    <div className="quickstake__item" onClick={() => updateAmount(1000)}> +1000</div>
                </div>

            </div>
            <div className="form-row txt-deepgray disclaimer">
                <p> Disclaimer</p> {process.env.REACT_APP_NAME} accepts no
                responsibility should you make a deposit into any account other than that of the
                Company, or enter your own account details incorrectly when requesting a withdrawal. It
                is your responsibility to ensure that you add your correct customer data as indicated on
                our site instructions and the correct {process.env.REACT_APP_NAME} account or payment details. In the event
                that an error occurs {process.env.REACT_APP_NAME} accepts no responsibility for recovering these funds and
                your account will NOT be credited.
            </div>
            {errMsg && <div className="callout red mb15">{errMsg}</div>}
            <button
                type="submit"
                className="btn green mt20 mb20"
                disabled={!isValid && isSubmitting}>
                Make Withdrawal {isSubmitting && <i className={`fa fa-spin fa-spinner`}/> }
            </button>
        </form>
    );
}
