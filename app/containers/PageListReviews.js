import React from 'react';
import { Button, Spin } from 'antd';
import { Reviews } from '../components/Reviews/Reviews';

export const PageListReviews = ({ posts, onOpenPageNew, onVoteClick, loading }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Button size="large" onClick={onOpenPageNew}>
          Rate this site
        </Button>
      </div>

      <section style={{ padding: 10 }}>
        <Reviews posts={posts} onVoteClick={onVoteClick} loading={loading}/>
      </section>
    </div>
  );
};
