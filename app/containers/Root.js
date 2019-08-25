import React, { Component } from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { KeyUploader } from '../components/KeyUploader/KeyUploader';

export default class Root extends Component {
  render() {
    const { store } = this.props;
    console.log('[Root render]', { store });
    return (
      <Provider store={store}>
        {/* <App /> */}
        <KeyUploader />
      </Provider>
    );
  }
}
