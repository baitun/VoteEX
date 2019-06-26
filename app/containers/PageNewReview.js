import React from 'react';
import { Button, Rate, Icon, Switch } from 'antd';
import { Reviews } from '../components/Reviews/Reviews';
import TextArea from 'antd/lib/input/TextArea';
import * as fluence from '../utils/fluence';
import * as arweave from '../utils/arweave';

export class PageNewReview extends React.Component {
  state = {
    rate: undefined,
    comment: '',
    advanced: false,
    loading: false,
  };

  submit = () => {
    const { rate, comment, advanced } = this.state;
    const { host } = this.props;
    this.setState({ loading: true });

    const newPost = {
      text: comment,
      rating: rate,
      url: host,
    };

    const lib = advanced ? arweave : fluence;

    lib.createReview(newPost).then((post) => {
      this.setState({ loading: false });
      this.props.addNewPost(post, advanced);
    });
  };

  render() {
    const { host, onOpenPageList } = this.props;
    const { rate, comment, advanced } = this.state;
    return (
      <div>
        <div>
          <Button type="link" onClick={onOpenPageList}>
            <Icon type="arrow-left" />
          </Button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <h3>Rate your overall experience on {host}</h3>
          <Rate allowClear onChange={(rate) => this.setState({ rate })} />
          <h3>Write a review (optional)</h3>
          <p>
            <TextArea
              onChange={(e) => {
                const { value: comment } = e.target;
                this.setState({ comment });
              }}
              style={{ maxWidth: '70%' }}
            />
          </p>
          <p>
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              onChange={(advanced) => this.setState({ advanced })}
            />{' '}
            &nbsp; Advanced storage
          </p>
          <p>
            <Button
              disabled={rate === undefined}
              onClick={this.submit}
              loading={this.state.loading}
            >
              Submit
            </Button>
          </p>
        </div>
      </div>
    );
  }
}
