import React, { useCallback, useEffect, useState } from "react";
import { getPersonalData } from "../../Services/apis";
import { updateProfile } from "../../Services/apis";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER_DATA } from "../../Redux/types";

export default function PersonalData({ history }) {
  const [isSubmitting, setSubmitting] = useState(false);
  const [errMsg, setErrmsg] = useState("");
  const [err, setErr] = useState(false);
  const dispatch = useDispatch();

  const [inputObj, setInputObj] = useState({
    first_name: "",
    code: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    country_id: "",
    state_id: "",
    city: "",
    address: "",
    phone_number: "",
    username: "",
    email: "",
    balance: 0,
  });
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const init = useCallback(() => {
    getPersonalData()
      .then((res) => {
        setInputObj({
          ...inputObj,
          code: res.user.code,
          first_name: res.user.details.first_name,
          last_name: res.user.details.last_name,
          phone: res?.user?.details?.phone_number,
          // date_of_birth: res.user.details.date_of_birth,
          gender: res.user.details.gender,
          country_id: res.user.details.country_id,
          state_id: res.user.details.state_id,
          city: res.user.details.city,
          address: res.user.details.address,
          phone_number: res.user.details.phone_number,
          username: res.user.username,
          email: res.user.email,
          balance: res.user.balance,
        });
        setCountries(res.countries);
        setStates(res.states);
      })
      .catch((err) => {});
  }, []);

  const handleChange = (e) => {
    e.preventDefault();

    setInputObj({
      ...inputObj,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    init();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      email: inputObj.email,
      details: {
        first_name: inputObj.first_name,
        last_name: inputObj.last_name,
      },
    };
    if (
      inputObj.email === null ||
      inputObj.first_name === null ||
      inputObj.last_name === null
    ) {
      setErrmsg("All fields are required");
      setErr(true);
    } else {
      setErr(false);
      updateProfile(payload)
        .then((res) => {
          console.log(res);
          const { data } = res;
          setSubmitting(false);
          dispatch({
            type: SET_USER_DATA,
            payload: {
              user: { ...data?.user, details: data?.details },
              isAuthenticated: true,
            },
          });
          toast.success(res?.message);
          history.goBack();
        })
        .catch((err) => {
          console.log(err.response);
          setSubmitting(false);
          if (err.response.status === 422) {
            let errors = Object.values(err?.response?.data?.errors);
            errors = errors?.flat();
            toast.error(errors);
          }
          toast.error(err?.response?.data?.message);
        });
    }
  };
  return (
    <>
      <div id="MainContent" className="">
        <div className="Riquadro">
          {/*<div className="TopSX">
                        <div className="TopDX"><h3>User Details</h3></div>
                    </div>*/}
          <div className="CntSX">
            <div className="CntDX">
              <div id="s_w_PC_PC_panelSquare">
                <div className="RiquadroNews Reg">
                  <div className="Cnt">
                    {/* <div>
                      <div id="s_w_PC_PC_upDati">
                        <table
                          width="100%"
                          cellSpacing="0"
                          className="tblDatiUser"
                        >
                          <tbody>
                            <tr>
                              <td className="cellaSx" width="100%">
                                ID
                              </td>
                              <td className="cellaSx">&nbsp;</td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtIDUtente"
                                  type="text"
                                  value={personalData.code}
                                  id="s_w_PC_PC_txtIDUtente"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv" style={{ width: "15px" }} />
                            </tr>
                            <tr>
                              <td className="cellaSx">Username</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$Username"
                                  type="text"
                                  value={personalData.username}
                                  maxLength="20"
                                  id="s_w_PC_PC_Username"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv" />
                            </tr>
                            <tr id="rowEmailAddress">
                              <td className="cellaSx">Email</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$Email"
                                  type="text"
                                  value={personalData.email}
                                  maxLength="50"
                                  id="s_w_PC_PC_Email"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqEmail"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError" />
                                </span>
                                <span
                                  id="s_w_PC_PC_cvFormatoEmail"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError" />
                                </span>
                              </td>
                            </tr>

                            <tr>
                              <td className="cellaSx">Namebbb</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtNome"
                                  type="text"
                                  value={personalData.first_name}
                                  maxLength="50"
                                  id="s_w_PC_PC_txtNome"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqNome"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError" />
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cellaSx">Surname</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtCognome"
                                  type="text"
                                  value={personalData.last_name}
                                  maxLength="50"
                                  id="s_w_PC_PC_txtCognome"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqCognome"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError" />
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cellaSx">Date of birth</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtDataNascita"
                                  type="text"
                                  value={personalData.date_of_birth}
                                  maxLength="10"
                                  id="s_w_PC_PC_txtDataNascita"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqDate"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                                <span
                                  id="s_w_PC_PC_cmpDate"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cellaSx">Gender</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <select
                                  name="s$w$PC$PC$ddlSx"
                                  id="s_w_PC_PC_ddlSx"
                                  disabled="disabled"
                                  className="dropdown"
                                  style={{ width: "40px" }}
                                >
                                  <option selected="selected" value="M">
                                    M
                                  </option>
                                  <option value="F">F</option>
                                </select>
                              </td>
                              <td className="rfv"></td>
                            </tr>

                            <tr>
                              <td className="cellaSx" width="100%">
                                Country
                              </td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <select
                                  name="s$w$PC$PC$ddlPaese"
                                  id="s_w_PC_PC_ddlPaese"
                                  disabled="disabled"
                                  className="dropdown"
                                  style={{ width: "150px" }}
                                ></select>
                              </td>
                              <td className="rfv" style={{ width: "15px" }}>
                                <span
                                  id="s_w_PC_PC_reqPaese"
                                  style={{ color: "Red", visibility: "hidden" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                              </td>
                            </tr>
                            <tr id="s_w_PC_PC_trLinguaMessaggi">
                              <td className="cellaSx">Message Lang.</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <select
                                  name="s$w$PC$PC$ddlLinguaMessaggi"
                                  id="s_w_PC_PC_ddlLinguaMessaggi"
                                  className="dropdown"
                                  style={{ width: "150px" }}
                                >
                                  <option selected="selected" value="2">
                                    English
                                  </option>
                                </select>
                              </td>
                              <td className="rfv"></td>
                            </tr>
                            <tr>
                              <td className="cellaSx">Address</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtIndirizzo"
                                  type="text"
                                  value={personalData.address}
                                  maxLength="50"
                                  id="s_w_PC_PC_txtIndirizzo"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqIndirizzo"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                              </td>
                            </tr>

                            <tr>
                              <td className="cellaSx">City</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtCitta"
                                  type="text"
                                  value={personalData.city}
                                  maxLength="50"
                                  id="s_w_PC_PC_txtCitta"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqCitta"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cellaSx">State</td>
                              <td className="cellaSx">
                                <b>*</b>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtProvincia"
                                  type="text"
                                  value=""
                                  maxLength="50"
                                  id="s_w_PC_PC_txtProvincia"
                                  disabled="disabled"
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv">
                                <span
                                  id="s_w_PC_PC_reqProvincia"
                                  style={{ color: "Red", display: "none" }}
                                >
                                  <span className="imgError"></span>
                                </span>
                              </td>
                            </tr>
                            <tr>
                              <td className="cellaSx">Tel.:</td>
                              <td className="cellaSx">
                                <div id="s_w_PC_PC_lbTelObbligatorio">
                                  <b>*</b>
                                </div>
                              </td>
                              <td className="cellaDx">
                                <input
                                  name="s$w$PC$PC$txtTelefono"
                                  type="text"
                                  maxLength="50"
                                  id="s_w_PC_PC_txtTelefono"
                                  disabled="disabled"
                                  value={personalData.phone_number}
                                  className="textbox"
                                />
                              </td>
                              <td className="rfv" />
                            </tr>

                            <tr>
                              <td className="cellaSx">Balance</td>
                              <td className="cellaSx">&nbsp;</td>
                              <td className="cellaDx">
                                <span
                                  id="s_w_PC_PC_lblSaldo"
                                  className="lblSaldo"
                                >
                                  {formatNumber(personalData.balance)}{" "}
                                  {SportsbookGlobalVariable.Currency}
                                </span>
                              </td>
                              <td className="rfv" />
                            </tr>
                            <tr>
                              <td colSpan="4">
                                <div className="spacer5" />
                              </td>
                            </tr>
                            <tr>
                              <td align="right" colSpan="3">
                                <input
                                  type="submit"
                                  name="s$w$PC$PC$btnReset"
                                  value="Cancel"
                                  onClick={() => history.goBack()}
                                  id="s_w_PC_PC_btnReset"
                                  className="button"
                                />
                                <input
                                  type="submit"
                                  name="s$w$PC$PC$btnCreateUser"
                                  value="Confirm"
                                  id="s_w_PC_PC_btnCreateUser"
                                  className="button"
                                />
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
                      </div>
                    </div> */}
                    <form className="personal-profile">
                      <div className="flex">
                        <div className="form-row">
                          <label>Account Id</label>
                          <input
                            name="code"
                            value={inputObj.code}
                            onChange={(e) => handleChange(e)}
                            disabled={true}
                          />
                        </div>
                        <div className="form-row">
                          <label>Contact Number</label>
                          <input
                            name="phone"
                            required
                            value={inputObj.phone}
                            onChange={(e) => handleChange(e)}
                            disabled={true}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <div className="form-row">
                          <label>Username</label>
                          <input
                            name="username"
                            value={inputObj.username}
                            onChange={(e) => handleChange(e)}
                            disabled={true}
                            autoComplete={false}
                          />
                        </div>
                        <div className="form-row">
                          <label>Email</label>
                          <input
                            type="email"
                            name="email"
                            value={inputObj.email}
                            autoComplete={false}
                            required
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <div className="form-row">
                          <label>First Name</label>
                          <input
                            name="first_name"
                            required
                            value={inputObj.first_name}
                            autoComplete={false}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                        <div className="form-row">
                          <label>Last Name</label>
                          <input
                            required
                            name="last_name"
                            value={inputObj.last_name}
                            autoComplete={false}
                            onChange={(e) => handleChange(e)}
                          />
                        </div>
                      </div>
                      <div
                        className=""
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          margin: "2rem auto",
                        }}
                      >
                        <button
                          type="submit"
                          className="update-btn"
                          onClick={submit}
                        >
                          UPDATE
                        </button>
                      </div>
                    </form>
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
  );
}
