import React from 'react';
import { Review } from './Review/Review';

export const Reviews = ({ reviews, host }) => {
  return (
    <div>
      <h3>{reviews.length} reviews</h3>
      {reviews.map((review, i) => (
        <Review key={i} review={review} />
      ))}
    </div>
  );
};
