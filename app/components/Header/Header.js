import React from 'react';
import { Spin, Rate } from 'antd';

export const Header = ({ host, average }) => {
  return (
    <header
      style={{
        textAlign: 'center',
        background: '#f0f2f5',
        padding: 10,
      }}
    >
      <h1>{host}</h1>
      <h4>Reputation</h4>
      <div style={{ fontSize: 60, lineHeight: '1' }}>
        {average === undefined ? <Spin /> : average ? average.toFixed(1) : 'NO'}
      </div>
      <Rate disabled allowHalf value={average} />
    </header>
  );
};
