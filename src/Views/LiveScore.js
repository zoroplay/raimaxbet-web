import React, { useState, useEffect } from "react";
import { getAllLivescore, getLivescore } from "../Services/apis";
import LiveScoreCard from "./Components/ResultCard";
import "../Assets/scss/_livescore.scss";

const LiveScore = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [allLive, setAllLive] = useState([]);
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState([]);

  const toggleTab = (tab) => {
    setActiveTab(tab);
    fetchLive()
  };

  useEffect(() => {
    fetchAllLive();
  }, []);

  const fetchAllLive = () => {
    setLoading(true);
    getAllLivescore()
      .then((response) => {
        setLoading(false);
        setAllLive(response);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const fetchLive = () => {
    setLoading(true);
    getLivescore()
      .then((response) => {
        setLoading(false);
        setLive(response);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <div className="livescore">
      <div className="livescore-tab mt-2">
        <button
          className={
            activeTab === "All"
              ? `active bg-blue livescore-button`
              : "bg-blue livescore-button"
          }
          onClick={() => toggleTab("All")}
        >
          All
        </button>
        <button
          className={
            activeTab === "Live"
              ? `active bg-blue livescore-button`
              : "bg-blue livescore-button"
          }
          onClick={() => toggleTab("Live")}
        >
          Live
        </button>
      </div>
      {loading ? (
        <h4 className="loader">Loading...</h4>
      ) : (
        <div className="livescore-tab-content">
          {activeTab === "All" ? (
            <>
              {allLive &&
                allLive?.map((item) => (
                  <LiveScoreCard type={activeTab} liveItem={item} />
                ))}
            </>
          ) : (
            ""
          )}
          {activeTab === "Live" ? (
            <>
              {live &&
                live?.map((item) => (
                  <LiveScoreCard type={activeTab} liveItem={item} />
                ))}
            </>
          ) : (
            ""
          )}
        </div>
      )}
    </div>
  );
};

export default LiveScore;
