import React, { useEffect, useState } from 'react';
import Rating from '@mui/material/Rating';
import { Tadpole } from "react-svg-spinners";



const Feedback = () => {

    const [feedback, setFeedback] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null); 
    const [formVisible, setFormVisible] = useState(false);

    const [rating, setRating] = useState(5);

    const handleSubmit = async (e) => {

        e.preventDefault();
        
        try {
            // Submit the feedback to the server
            const response = await fetch('https://sumbroo.com/server-api/feedback-handler', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                // @TODO: Add The Name & Email of the user sending the feedback
                // you can get it from localStorage
                body: JSON.stringify({ rating, feedback })
            });
    
            const data = await response.json();
    
            if (data.message === 'Feedback successfully stored!') {
                setSubmissionStatus('submitted');
            } else {
                console.error("Error:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };
    

    useEffect(() => {
        if (submissionStatus === 'submitted') {
            setTimeout(() => {
                setSubmissionStatus(null)
                setFormVisible(false)
            }, 1000);
        }
    }, [submissionStatus])

    return (
        <div className={`feedback-container ${formVisible ? 'expanded' : ''}`} style={{ paddingBottom: submissionStatus === 'submitted' ? '0px' : '37px' }}>
            {submissionStatus === 'submitted' ? (
                <div className="submission-message">Thanks a ton for sharing! 🌟</div>
            ) : (
                <>
                    <button className="toggle-feedback-btn" onClick={() => setFormVisible(!formVisible)}>
                        Feedback
                    </button>
                    <form onSubmit={handleSubmit} className={formVisible ? 'visible' : ''}>
                        <div className="rating-section">
                            <span id='stars-txt'>🌟 How&apos;s your journey going with SumBroo?</span>
                            <Rating
                                size="large"
                                name="simple-controlled"
                                id="rating-stars"
                                value={rating}
                                onChange={(event, newValue) => {
                                    if (newValue !== null) { 
                                        setRating(newValue);
                                    } else {
                                        setRating(1); 
                                    }
                                }}
                            />
                        </div>
                        <div className="feedback-section">
                            <label id='feedback-txt' htmlFor="feedback">How can we make your experience even better?</label>
                            <textarea
                                id="feedback"
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                            />
                        </div>
                        <div className="submit-section">
                            {
                                submissionStatus === 'submitted' ? 
                                <Tadpole height={5} color='white' /> :
                                <button type="submit" disabled={submissionStatus==='submitted'} className={submissionStatus==='submitted' ? 'active' : ''} >Submit</button>
                            }
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};

export default Feedback;
