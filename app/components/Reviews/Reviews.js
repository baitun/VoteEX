import React from 'react';
import { Review } from './Review/Review';
import {Spin } from 'antd'

export const Reviews = ({ posts }) => {
  
  if(posts.length===0) return <div style={{textAlign: "center"}}><Spin/></div>

  return (
    <div>
      <h3>{posts.length} reviews</h3>
      {posts.map((post, i) => (
        <Review key={i} post={post} />
      ))}
    </div>
  );
};
