import React from "react";
import {Field} from "formik";
import {useSelector} from "react-redux";

export const TransferForm = ({
                             errors,
                      touched,
                      setFieldValue,
                      handleSubmit,
                      isSubmitting,
                      values,
}) => {
    const { amount } = values;
    const {SportsbookGlobalVariable} = useSelector((state) => state.sportsBook);

    const updateAmount = (value) => {
        let currentAmount = amount;
        if (currentAmount === ''){
            currentAmount = 0;
        }
        setFieldValue('amount', currentAmount + value);
    }

    const handleTypeChange = (e) => {
        const value = e.target.value;
        setFieldValue('type', value);

        switch (value) {
            case 'top-up':
                setFieldValue('action', 'deposit');
                break;
            case 'trust':
                setFieldValue('action', 'deposit');
                break;
            case 'withdraw':
                setFieldValue('action', 'withdraw');
                break;
            default:
                setFieldValue('action', 'deposit');
                break;
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-row">
                <div className="form-label">
                    <strong>User</strong>
                </div>
                <div className={`form-input ${errors.username ? 'error' : ''}`}>
                    <Field
                        className=""
                        type="text"
                        readonly={true}
                        name="username"
                        value={values.username}
                        placeholder="" />
                </div>
                {errors.username && touched.username ? (
                    <div className="form--error">{errors.username}</div>
                ) : null}
            </div>
            <div className="form-row">
                <div className="form-label">
                    <strong>Amount({SportsbookGlobalVariable.Currency})</strong>
                </div>
                <div className={`form-input ${errors.amount ? 'error' : ''}`}>
                    <Field
                        name="amount"
                        className="big"
                        type="number"
                        autoComplete="off"
                        value={values.amount}
                    />
                    <div className="form-input--stake"> Min 100</div>
                </div>
                {errors.amount && touched.amount ? (
                    <div className="form--error">{errors.amount}</div>
                ) : null}
                <div className="quickstake mt10 mb10">
                    <div className="quickstake__item" onClick={() => updateAmount(0)}> Clear</div>
                    <div className="quickstake__item" onClick={() => updateAmount(100)}> +100</div>
                    <div className="quickstake__item" onClick={() => updateAmount(200)}> +200</div>
                    <div className="quickstake__item" onClick={() => updateAmount(500)}> +500</div>
                    <div className="quickstake__item" onClick={() => updateAmount(1000)}> +1000</div>
                </div>
                <div className="form-row">
                    <div className="form-label">
                        <strong>Transfer Type</strong>
                    </div>
                    <table id="ac_w_PC_PC_rblTipoImporto" border="0">
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_0">
                                    <Field
                                        id="ac_w_PC_PC_rblTipoImporto_0"
                                        type="radio"
                                        name="type"
                                        onChange={handleTypeChange}
                                        value="top-up"
                                    />
                                    Top Up
                                </label>
                            </td>
                            <td>
                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_1">
                                    <Field
                                        id="ac_w_PC_PC_rblTipoImporto_1"
                                        type="radio"
                                        name="type"
                                        onChange={handleTypeChange}
                                        value="trust"
                                    />
                                    Trust
                                </label>
                            </td>
                            <td>
                                <label htmlFor="ac_w_PC_PC_rblTipoImporto_2">
                                    <Field
                                        id="ac_w_PC_PC_rblTipoImporto_2"
                                        type="radio"
                                        name="type"
                                        onChange={handleTypeChange}
                                        value="withdraw"
                                    />
                                    Withdraw
                                </label>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="form-row">
                    <div className="form-label">
                        <strong>Additional Notes</strong>
                    </div>
                    <div className={`form-input`}>
                        <Field
                            as="textarea"
                            rows={3}
                            className=""
                            name="notes"
                            value={values.notes}
                            placeholder="" />
                    </div>
                </div>
            </div>
            <button
                disabled={isSubmitting}
                className="btn green mt20 mb20"
                type={"submit"}
            >{isSubmitting ? 'Submitting' : 'Submit'}</button>
        </form>
    )
}
