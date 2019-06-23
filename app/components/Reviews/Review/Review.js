import React from 'react';
import { Icon, Rate, Button } from 'antd';
import moment from 'moment';
import { vote } from '../../../utils/fluence';

export const Review = ({ post, onVoteClick }) => {  
  return (
    <div className="ant-card ant-card-bordered" style={{ marginBottom: 5 }}>
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-title" style={{ padding: '8px 0' }}>
            <div>
              {moment(parseInt(post.timestamp)).format('LLL')}
              &nbsp;
              {post.trusted && (
                <Icon
                  type="safety-certificate"
                  style={{ color: '#52c41a' }}
                  title="This review is trusted"
                />
              )}
            </div>
          </div>
          <div className="ant-card-extra" style={{ padding: '8px 0' }}>
            <Rate disabled value={parseFloat(post.rating)} />
          </div>
        </div>
      </div>
      <div className="ant-card-body" style={{ padding: '5px 24px 0' }}>
        <p>{post.text}</p>
        <p
          style={{ textAlign: 'right', marginBottom: 4 }}
          title="Review rating"
        >
          <Button onClick={()=>onVoteClick(post.id, "upvote")}  type="link"><Icon type="like" style={{color: '#52c41a'}}  /> {post.upvote}</Button>
          <Button onClick={()=>onVoteClick(post.id, "downvote")} type="link"><Icon type="dislike" style={{color: '#eb2f96'}}  /> {post.downvote}</Button>
          
        </p>
      </div>
    </div>
  );
};
