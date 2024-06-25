import React, { useState, useEffect } from 'react';
import axiosInstance from '../config/axiosConfig';
import centre from '../assets/images/demo-centre.png';
import Rating from '../components/Rating';
import PopupModal from '../components/PopupModal';
import { toast } from "react-toastify";

function FeedbackForm(props) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (props.isOpen) {
            setRating(0);
            setComment('');
        }
    }, [props.isOpen]);

    // Close feedback popup
    const handleClose = () => {
        props.setIsOpen();
    };

    // Handle rating change
    const handleRatingChange = (newRating) => {
        setRating(newRating);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        const feedbackData = {
            content: comment,
            rate: rating,
            centreId: props.booking.centreId,
            bookingId: props.booking.id
        };

        try {
            await axiosInstance.post('/courtstar/feedback/create', feedbackData);
            handleClose();
            toast.success("Feedback submitted successfully!", {
                toastId: 'feedback-success'
            });
            props.onFeedbackSubmitted();  // Trigger refresh of booking data
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error(error.message, {
                toastId: 'feedback-error'
            });
        }
    };

    const html = (
        <form onSubmit={handleSubmit} className="w-[28rem] mx-auto">
            <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-3 text-center">Rate us!</h2>
                <p className="text-gray-600 text-sm mb-3 text-center">
                    Your feedback is useful for us to understand your needs, <br />so we can customize our services to suit you perfectly.
                </p>
                <div className="mb-3">
                    <p className="text-gray-700 font-semibold text-center">How would you rate our centre?</p>
                </div>
                <div className="text-center mb-3">
                    <img
                        src={props?.booking?.centreImg || centre}
                        alt={props?.booking?.centreName}
                        className="mx-auto object-cover object-center min-w-72 max-w-72 h-44 rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{props?.booking?.centreName}</h3>
                </div>
                <div className="flex justify-center mb-3">
                    <Rating
                        ratingWrapper="flex gap-1"
                        value={rating}
                        editable={true}
                        onChange={handleRatingChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="block text-gray-700 font-bold mb-2" htmlFor="comment">
                        Add a comment...
                    </label>
                    <textarea
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="comment"
                        rows="3"
                        placeholder="Enter your comment here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-primary-green hover:bg-teal-900 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Send now
                    </button>
                </div>
            </div>
        </form>
    );

    return (
        <div>
            <PopupModal
                html={html}
                isOpen={props.isOpen}
                setIsOpen={handleClose}
            />
        </div>
    );
}

export default FeedbackForm;
