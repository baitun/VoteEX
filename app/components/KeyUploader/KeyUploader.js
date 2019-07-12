import React from 'react';

import { Upload, Icon, message } from 'antd';

const { Dragger } = Upload;

const props = {
  accept: 'application/json',
  beforeUpload: (file) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const result = event.target.result;
      // @TODO Save jwk to chrome.storage
      console.log({ result });
    };
    fileReader.readAsText(file);

    return false; // do not upload file anywhere
  },
};

export const KeyUploader = ({}) => {
  return (
    <React.Fragment>
      <h4>Before write a review, you need to add your key file</h4>
      <p>
        If you don't have arweave key yet, you can get it on{' '}
        <a href="https://tokens.arweave.org/" target="blank">
          tokens.arweave.org
        </a>
      </p>
      <Dragger {...props}>
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">
          Drag your key file here or click to select one
        </p>
        {/* <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p> */}
      </Dragger>
    </React.Fragment>
  );
};
