import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StarRating from './StarRating';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, workerEmail, userEmail, bookingId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/reviews/', {
        worker_email: workerEmail,
        user_email: userEmail,
        booking_id: bookingId,
        rating: rating,
        review: review
      });
      toast.success("Thank you for your rating! ⭐");
      if (onReviewSubmitted) onReviewSubmitted();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to submit rating");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[3rem] p-10 shadow-2xl overflow-hidden text-center"
          >
            <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
              <CloseIcon />
            </button>

            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
               <StarRating rating={1} size="large" />
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">Rate Your Experience</h3>
            <p className="text-gray-500 font-bold mb-8 text-sm">How was your service with the worker?</p>

            <div className="flex justify-center mb-8">
               <StarRating 
                 rating={rating} 
                 interactive={true} 
                 size="large" 
                 onRatingChange={setRating} 
               />
            </div>

            <textarea 
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write a quick review (optional)..."
              className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-3xl outline-none focus:border-purple-600 transition-all font-bold min-h-[120px] resize-none mb-8 text-sm"
            />

            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-gray-900/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Rating'}
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
