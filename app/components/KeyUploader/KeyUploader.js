import React from 'react';

import { Upload, Icon, message } from 'antd';

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
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
