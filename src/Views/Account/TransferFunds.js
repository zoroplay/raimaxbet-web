import React, { useState } from "react";
import { useDispatch } from "react-redux";
import useSWR from "swr/esm/use-swr";
import { formatNumber } from "../../Utils/helpers";
import { Formik } from "formik";
import * as Yup from "yup";
import { TransferForm } from "../Components/TransferForm";
import { sendFund } from "../../Services/apis";
import { toast } from "react-toastify";
import { UPDATE_USER_DATA } from "../../Redux/types";

const FormSchema = Yup.object().shape({
  amount: Yup.number().min(1, "Missing amount").required("Enter an amount"),
  username: Yup.string().required("Please enter a username"),
});

export default function TransferFunds() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  const { data: users, error } = useSWR("/user/account/agent-users");

  const fundUser = (values, { setSubmitting, resetForm }) => {
    sendFund(values)
      .then((res) => {
        setSubmitting(false);
        console.log(res);
        if (res.success) {
          resetForm({});
          dispatch({ type: UPDATE_USER_DATA, payload: res.user });
          toast.success("Transaction was completed successfully");
        } else {
          toast.success(res.message);
        }
      })
      .catch(
        (err) => setSubmitting(false) | toast.error("Internal server error!")
      );
  };

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
                        <div className="page__head-item">
                          <h1> Transfer Funds</h1>
                        </div>
                      </div>
                      <div className="pt15 pb15">
                        <div className="divide-holder">
                          <div className="one-half pr5">
                            <table
                              className="dgStyle"
                              cellSpacing="0"
                              border="0"
                              id="ac_w_PC_PC_grid"
                              style={{
                                borderWidth: "0px",
                                borderStyle: "None",
                                width: "100%",
                                borderCollapse: "collapse",
                              }}
                            >
                              <tbody>
                                <tr className="dgHdrStyle">
                                  <th>Name</th>
                                  <th>Balance</th>
                                  <th></th>
                                </tr>
                              </tbody>
                              <tbody>
                                {users &&
                                  !error &&
                                  users.map((row, i) => (
                                    <tr className="dgItemStyle" key={i}>
                                      <td align="center">{row.username}</td>
                                      <td align="center">
                                        {formatNumber(row.balance)}
                                      </td>
                                      <td
                                        align="center"
                                        onClick={() => setUser(row)}
                                      >
                                        <img
                                          src="/img/SendFastSport.png"
                                          style={{ cursor: "pointer" }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                {users && users.length === 0 && (
                                  <tr className="dgItemStyle">
                                    <td colSpan="4">No result found</td>
                                  </tr>
                                )}
                                {!users && (
                                  <tr className="dgItemStyle">
                                    <td colSpan="4">Loading...</td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                          <div className="one-half">
                            <Formik
                              enableReinitialize={true}
                              initialValues={{
                                username: user?.username || "",
                                amount: "",
                                notes: "",
                                type: "top-up",
                                action: "deposit",
                              }}
                              validationSchema={FormSchema}
                              children={(props) => <TransferForm {...props} />}
                              onSubmit={fundUser}
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
      </div>
    </>
  );
}
