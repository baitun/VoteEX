import React from 'react';
import { Card } from 'antd';
import moment from 'moment';

export const Review = ({ review }) => {
  return (
    <Card
      style={{ marginBottom: 10 }}
      title={moment(review.date).format('LLL')}
      extra={review.rate.toFixed(1)}
    >
      <p>{review.comment}</p>
    </Card>
  );
};
