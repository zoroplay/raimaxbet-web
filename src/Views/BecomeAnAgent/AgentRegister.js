import React from "react";
import {Formik, Field} from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import moment from "moment";
import {saveNewAgent} from "../../Services/apis";
import {toast} from "react-toastify";

const FormSchema = Yup.object().shape({
    first_name: Yup.string()
        .required("Please provide a name"),
    last_name: Yup.string()
        .required("Please provide a last name"),
    email: Yup.string()
        .required("An email is requires")
        .email('Please provide a valid email'),
    phone: Yup.string().required("A phone number is required"),
    state: Yup.string().required("Please provide your state of residence"),
    shop_address: Yup.string().required("What is your shop address"),
    personal_address: Yup.string().required("Please provide your address"),
});

export default function AgentRegister({history}) {

    const submitForm = (values, {setSubmitting, resetForm}) => {
        const data = {...values}
        data.date_of_birth = moment(values.date_of_birth).format('YYYY-MM-DD');

        saveNewAgent(data).then(res => {
            setSubmitting(false);
            if (res.success) {
                resetForm({});
                toast.success('Your details has been submitted successfully. We would be in touch shortly.');
            } else {
                toast.error(res.message);
            }
        }).catch (err => {
            toast.error(err.message);
        })
    }

    return (

        <div className="entry-content">
            <div className="aqx-b-head">
                <h3 className="aqx-b-head-txt">Register</h3>
            </div>
            <div className="pagescontent">
                <div id="s_w_PC_PC_upDati">
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            first_name: '',
                            last_name: '',
                            email: '',
                            phone: '',
                            state: '',
                            shop_address: '',
                            personal_address: '',
                            gender: 'Male',
                            date_of_birth: moment().subtract(18, 'years').toDate()
                        }}
                        validationSchema={FormSchema}
                        children={(props) => <AgentForm {...props} />}
                        onSubmit={submitForm}
                    />
                </div>
            </div>
        </div>
    )
}

const AgentForm = ({
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    isValid,
    values,
}) => {
    const {first_name, last_name, gender, email, phone, state, shop_address, personal_address, date_of_birth} = values;
    return (
        <form onSubmit={handleSubmit}>
        <table width="100%" cellSpacing="0" className="tblDatiUser">
            <tbody>
            <tr>
                <td className="cellaSx">Name</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="first_name"
                        type="text"
                        className="textbox"
                        value={first_name}
                    />
                </td>
                <td className="rfv">
                    {errors.first_name && touched.first_name ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.first_name}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr>
                <td className="cellaSx">Surname</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="last_name"
                        type="text"
                        className="textbox"
                        value={last_name}
                    />
                </td>
                <td className="rfv">
                    {errors.last_name && touched.last_name ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.last_name}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr>
                <td className="cellaSx">Date of Birth</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <DatePicker
                        dateFormat="dd/MM/yyyy"
                        className="textbox"
                        name="date_of_birth"
                        selected={date_of_birth}
                        onChange={date => setFieldValue('date_of_birth', date)} />
                </td>
                <td className="rfv">
                    {errors.date_of_birth && touched.date_of_birth ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.date_of_birth}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr id="rowEmailAddress">
                <td className="cellaSx">Gender</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <label>
                        <Field type="radio" name="gender" value="Male" />
                        Male
                    </label>
                    <label>
                        <Field type="radio" name="gender" value="Female" />
                        Female
                    </label>
                </td>
            </tr>
            <tr id="rowEmailAddress">
                <td className="cellaSx">Email</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="email"
                        type="text"
                        value={email}
                        className="textbox" />
                </td>
                <td className="rfv">
                    {errors.email && touched.email ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.email}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr id="rowEmailAddress">
                <td className="cellaSx">Phone Number</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="phone"
                        type="text"
                        value={phone}
                        className="textbox" />
                </td>
                <td className="rfv">
                    {errors.phone && touched.phone ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.phone}</span>
                        </span>
                    ) : null}
                </td>
            </tr>

            <tr id="rowEmailAddress">
                <td className="cellaSx">State</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="state"
                        type="text"
                        value={state}
                        className="textbox" />
                </td>
                <td className="rfv">
                    {errors.state && touched.state ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.state}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr id="rowEmailAddress">
                <td className="cellaSx">Shop Address</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="shop_address"
                        type="text"
                        value={shop_address}
                        className="textbox" />
                </td>
                <td className="rfv">
                    {errors.shop_address && touched.shop_address ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.shop_address}</span>
                        </span>
                    ) : null}
                </td>
            </tr>
            <tr id="rowEmailAddress">
                <td className="cellaSx">Personal Address</td>
                <td className="cellaSx"><b>*</b></td>
                <td className="cellaDx">
                    <Field
                        name="personal_address"
                        type="text"
                        value={personal_address}
                        className="textbox" />
                </td>
                <td className="rfv">
                    {errors.personal_address && touched.personal_address ? (
                        <span id="s_w_PC_PC_reqEmail" style={{color:'Red'}}>
                            <span className="imgError">{errors.personal_address}</span>
                        </span>
                    ) : null}
                </td>
            </tr>

            <tr>
                <td colSpan="4">
                    <div className="spacer5"/>
                </td>
            </tr>
            <tr>
                <td align="right" colSpan="3">
                    <button
                        type="submit"
                        className="button"
                        disabled={!isValid}
                    >{isSubmitting ? 'Submitting' : 'Submit' }</button>
                </td>
                <td></td>
            </tr>
            <tr>
                <td colSpan="4">
                    <div className="spacer5"></div>
                </td>
            </tr>
            </tbody>
        </table>
        </form>
    )
}
