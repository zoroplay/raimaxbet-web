import React, { useState } from "react";
import { findCode, findFixture } from "../../Services/apis";
import { addToCoupon } from "../../Redux/actions";
import { createID } from "../../Utils/couponHelpers";
import { useDispatch } from "react-redux";
import { openFastCode } from "../../Utils/helpers";
import { toast } from "react-toastify";

export default function SmartBet() {
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [eventSearch, setEventSearch] = useState({
    event_id: "",
    code: "",
  });
  const dispatch = useDispatch();

  const findEvent = () => {
    if (eventSearch.event_id.length === 4) {
      setLoading(true);
      document.getElementById("FastCodeField").focus();
      findFixture(eventSearch.event_id)
        .then((res) => {
          setLoading(false);
          if (!res.message) {
            setFixture(res);
          } else {
            toast.error(res.message);
            setEventSearch({ ...eventSearch, event_id: "" });
            document.getElementById("code").focus();
          }
        })
        .catch(
          (err) =>
            setLoading(false) |
            toast.error("Something went wrong. Please try again")
        );
    }
  };

  const reset = () => {
    setFixture("");
    setEventSearch({
      event_id: "",
      code: "",
    });
    document.getElementById("code").focus();
  };

  const search = (e) => {
    e.preventDefault();

    findCode(eventSearch)
      .then((res) => {
        if (res.message === "found") {
          reset();

          let fixture = res.data.fixture;

          dispatch(
            addToCoupon(
              fixture,
              res.data.market_id,
              res.data.market_name,
              res.data.odd,
              res.data.odd_id,
              res.data.odd_name,
              createID(
                fixture.provider_id,
                res.data.market_id,
                res.data.odd_name,
                res.data.odd_id
              ),
              fixture.fixture_type
            )
          );
        } else {
          reset();
        }
      })
      .catch();
  };
  return (
    <div className="single-block closed">
      <div className="block-title toggle-title">
        <img src="/img/arrow-down.png" alt="" className="title-icon closed" />
        <span>SMARTBET</span>
        <div className="quick-btn">
          <a
            href="javascript:;"
            onClick={openFastCode}
            className="quick-btn-link"
            style={{ color: "white", fontSize: "2rem", marginTop: "-1rem" }}
          >
            {" "}
            +
          </a>
        </div>
      </div>
      <div className="block-content smartbet">
        <form onSubmit={search} name="fastslip2">
          <input
            type="text"
            autoComplete="off"
            name="code"
            id="code"
            maxLength={4}
            value={eventSearch.event_id}
            onChange={(e) =>
              setEventSearch({ ...eventSearch, event_id: e.target.value })
            }
            onKeyUp={findEvent}
          />
          <input type="submit" name="entercode" id="entercode" />
          <input
            type="text"
            autoComplete="off"
            id="FastCodeField"
            value={eventSearch.code}
            onChange={(e) =>
              setEventSearch({ ...eventSearch, code: e.target.value })
            }
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                search(e);
              }
            }}
          />
          <div className="doc-button">
            <i className="far fa-file-pdf" aria-hidden="true"></i>
          </div>
        </form>
        <span id="evento2" className="match-name">
          {fixture?.event_name}
        </span>
        {loading && <i className={`fa fa-spin fa-spinner`} />}
      </div>
    </div>
  );
}
