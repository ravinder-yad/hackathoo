import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const StarRating = ({ rating, totalReviews, size = 'small', interactive = false, onRatingChange }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  if (interactive) {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRatingChange(star)}
            className="text-amber-400 hover:scale-110 transition-transform active:scale-95"
          >
            {star <= rating ? (
              <StarIcon fontSize={size} />
            ) : (
              <StarBorderIcon fontSize={size} />
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 font-bold">
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => <StarIcon key={`f-${i}`} fontSize={size} />)}
        {hasHalfStar && <StarHalfIcon fontSize={size} />}
        {[...Array(emptyStars)].map((_, i) => <StarBorderIcon key={`e-${i}`} fontSize={size} />)}
      </div>
      {totalReviews !== undefined && (
        <span className="text-gray-400 text-xs tracking-tight">({totalReviews} reviews)</span>
      )}
    </div>
  );
};

export default StarRating;
