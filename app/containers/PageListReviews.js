import React from 'react';
import { Button } from 'antd';
import { Reviews } from '../components/Reviews/Reviews';

export const PageListReviews = ({ reviews, onOpenPageNew }) => {
  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: 8 }}>
        <Button size="large" onClick={onOpenPageNew}>
          Rate this site
        </Button>
      </div>

      <section style={{ padding: 10 }}>
        <Reviews reviews={reviews} />
      </section>
    </div>
  );
};
