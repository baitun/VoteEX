import React from 'react';
import { Modal, Button } from 'antd';

export const ModalNewReview = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: 8 }}>
      <Button size="large">Rate this site</Button>
      <Modal
        // title="Basic Modal"
        visible={true}
        // onOk={this.handleOk}
        // onCancel={this.handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </div>
  );
};
