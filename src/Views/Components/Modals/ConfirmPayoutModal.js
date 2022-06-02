import React, {useState} from 'react';
import { toast } from 'react-toastify';
import { payoutTicket } from '../../../Services/apis';
import { formatNumber } from '../../../Utils/helpers';

export default function ConfirmPayoutModal({closeModal, betslip}) {
    const [submitting, setSubmitting] = useState(false);

    const submit = () => {
        setSubmitting(true);
        payoutTicket(betslip?.id).then(res => {
            if(res.success) {
                closeModal()
                toast.success('Success');
            } else {
                toast.error(res.message)
            }
        }).catch(err => setSubmitting(false | toast.error('Internal server error')));
    }
    return (
        <div className="bet-confirm-popup-wrapper">
            <div className="bet-confirm-popup">
                <div className="close-bet-confirm-popup" onClick={closeModal}>
                    <i className="fa fa-times" aria-hidden="true" />
                </div>
                <div className="bet-confirm-content">
                    <div className="title">
                        <img src="/img/bet-confirm-info.png" alt="" />
                        <span style={{color: 'red'}}>Confirm Payout of  {formatNumber(betslip?.winnings)}<br />
                        </span>
                    </div>
                    <div className="buttons">
                        <div className="cancel-button button" onClick={closeModal}>
                            No
                        </div>
                        <div className="confirm-button button" onClick={submit}>
                            {submitting ? 'Submitting...' : 'Yes'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
