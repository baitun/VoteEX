import React from 'react';
import { Card, Icon, Rate } from 'antd';
import moment from 'moment';

export const Review = ({ review }) => {
  return (
    <Card
      style={{ marginBottom: 10, padding: 4 }}
      title={
        <div>
          {moment(review.date).format('LLL')}
          &nbsp;
          {review.trusted && (
            <Icon
              type="safety-certificate"
              style={{ color: '#52c41a' }}
              title="Trusted review"
            />
          )}
        </div>
      }
      extra={<Rate disabled value={review.rate} />}
    >
      <p>{review.comment}</p>
      <p style={{ textAlign: 'right' }} title="Review rating">
        <Icon type="like" twoToneColor="#52c41a" theme="twoTone" />
        &nbsp; {review.likes} &nbsp;
        <Icon type="dislike" twoToneColor="#eb2f96" theme="twoTone" />
        &nbsp; {review.dislikes}
      </p>
    </Card>
  );
};
