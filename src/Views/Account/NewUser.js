import React from "react";
import {useSelector} from "react-redux";
import {Formik} from "formik";
import {UserForm} from "../Components/UserForm";
import * as Yup from "yup";
import {addUser} from "../../Services/apis";
import {toast} from "react-toastify";
import moment from "moment";
import {formattedPhoneNumber} from "../../Utils/helpers";

const UserSchema = Yup.object().shape({
    first_name: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter first name"),
    last_name: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter first name"),
    email: Yup.string()
        .email("Wrong email format")
        .required("Enter an email address"),
    // phone_number: Yup.string()
    //     .required("Please provide a valid phone number"),
    username: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter a username"),
    password: Yup.string()
        .min(3, "Minimum 3 letters")
        .required("Enter a password"),
});

export default function PersonalData({history, location}) {
    const urlParam = new URLSearchParams(location.search);
    const usertype = urlParam.get('usertype');
    const {user} = useSelector(state => state.auth);

    const submitForm = (values, {setSubmitting, resetForm}) => {
        values.username = formattedPhoneNumber(values.username);

        const data = {...values}; //clone form data
        // data.date_of_birth = moment(values.date_of_birth).format('DD/MM/YYYY'); // change date of birth format

        addUser(data).then(res => {
            setSubmitting(false);
            if(res.success) {
                resetForm({})
                toast.success('User details has been submitted successfully');
            } else {
                toast.error(`Something went wrong. Unable to save new ${usertype}!`);
            }
        }).catch(err => setSubmitting(false) | toast.error('Internal server error'));
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
                                                <Formik
                                                    enableReinitialize={true}
                                                    initialValues={{
                                                        country:'160',
                                                        state: '',
                                                        language: 'EN',
                                                        currency: 'KSH',
                                                        first_name:'',
                                                        last_name:'',
                                                        date_of_birth:'',
                                                        gender:'Male',
                                                        address:'',
                                                        phone_number:'',
                                                        email:'',
                                                        username: '',
                                                        password: '',
                                                        user_type: usertype,
                                                        parent_agent: user.id
                                                    }}
                                                    validationSchema={UserSchema}
                                                    children={(props) => <UserForm {...props} history={history} />}
                                                    onSubmit={submitForm}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="BtmSX">
                                        <div className="BtmDX"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="BtmSX">
                        <div className="BtmDX"></div>
                    </div>
                </div>
            </div>
        </>
    )
}
