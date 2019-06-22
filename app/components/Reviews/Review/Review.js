import React from 'react';
import { Icon, Rate } from 'antd';
import moment from 'moment';

export const Review = ({ review }) => {
  return (
    <div className="ant-card ant-card-bordered" style={{ marginBottom: 5 }}>
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-title" style={{ padding: '8px 0' }}>
            <div>
              {moment(review.date).format('LLL')}
              &nbsp;
              {review.trusted && (
                <Icon
                  type="safety-certificate"
                  style={{ color: '#52c41a' }}
                  title="This review is trusted"
                />
              )}
            </div>
          </div>
          <div className="ant-card-extra" style={{ padding: '8px 0' }}>
            <Rate disabled value={review.rate} />
          </div>
        </div>
      </div>
      <div className="ant-card-body" style={{ padding: '5px 24px 0' }}>
        <p>{review.comment}</p>
        <p
          style={{ textAlign: 'right', marginBottom: 4 }}
          title="Review rating"
        >
          <Icon type="like" twoToneColor="#52c41a" theme="twoTone" />
          &nbsp; {review.likes} &nbsp;
          <Icon type="dislike" twoToneColor="#eb2f96" theme="twoTone" />
          &nbsp; {review.dislikes}
        </p>
      </div>
    </div>
  );
};
