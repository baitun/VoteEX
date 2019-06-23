import React from 'react';
import { Icon, Rate, Button } from 'antd';
import moment from 'moment';

export const Review = ({ post, onVoteClick }) => {
  if (!post) return null;
  if (post.text.length === 0) return null;
  return (
    <div className="ant-card ant-card-bordered" style={{ marginBottom: 5 }}>
      <div className="ant-card-head">
        <div className="ant-card-head-wrapper">
          <div className="ant-card-head-title" style={{ padding: '8px 0' }}>
            <div>
              {moment(parseInt(post.timestamp)).format('LLL')}
              &nbsp;
              {post.trusted && (
                <a
                  target="_blank"
                  href={`https://viewblock.io/arweave/tx/${post.id}`}
                >
                  <Icon
                    type="safety-certificate"
                    style={{ color: '#52c41a' }}
                    title="This review is trusted"
                  />
                </a>
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
          style={{
            textAlign: 'right',
            marginBottom: 4,
            opacity: (post.upvote === undefined || post.downvote === undefined)?0:1,
          }}
        >
          <Button
            onClick={() => onVoteClick(post.id, 'upvote')}
            title="Upvote this review"
            type="link"
          >
            <Icon type="like" style={{ color: '#52c41a' }} /> {post.upvote}
          </Button>
          <Button
            onClick={() => onVoteClick(post.id, 'downvote')}
            title="Downvote this review"
            type="link"
          >
            <Icon type="dislike" style={{ color: '#eb2f96' }} /> {post.downvote}
          </Button>
        </p>
      </div>
    </div>
  );
};
