import React from "react";
import moment from "moment";

const LiveScoreCard = ({ type, liveItem }) => {
     const formatDate = (str, format = 'HH:mm') =>
    moment(str).format(format);
    
    return (
        <div className="livescore-item ">
            <div className="bg-blue livescore-flex livescore-header p-1">
                <small><strong>{liveItem?.section?.name}</strong> /</small>
                <small className="ml-1 ">{liveItem?.season?.name}</small>
            </div>
            <div className="flex livescore-item-detail">
                <div className="livescore-item-detail-time">
                    <p className="ml-1">{formatDate(liveItem?.start_at)}</p>
                    {type === "All" ? <span className="livescore-status">{liveItem?.status}</span> : <span className="livescore-stage">{liveItem?.status}</span>}
                </div>
                <div className=" livescore-item-detail-teams">
                    <p>{liveItem?.home_team?.name}</p>
                    <p className="-mt-1">{liveItem?.away_team?.name}</p>
                </div>
                <div className="livescore-item-detail-outcome">
                <p className="ml-1  text-green">{liveItem?.home_score?.current}</p>
                <p className="ml-1 text-green">{liveItem?.away_score?.current}</p>
                </div>
                
            </div>
        </div>
    )
}

export default LiveScoreCard;