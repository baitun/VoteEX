import { Divider, Rate, Button, BackTop } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TodoActions from '../actions/todos';
import { Reviews } from '../components/Reviews/Reviews';
import { PageListReviews } from './PageListReviews';
import { PageNewReview } from './PageNewReview';
import { queryAggregate } from '../utils/aggregate';

const PAGES = {
  NEW: 'PageNewReview',
  LIST: 'PageListReviews',
};

@connect(
  (state) => ({
    host: 'aviasales.ru',
  }),
  (dispatch) => ({
    actions: bindActionCreators(TodoActions, dispatch),
  })
)
export default class App extends Component {
  state = {
    page: PAGES.LIST,
    posts: [],
    loading: false,
    average: 0
  };

  openPageNew = () => {
    this.setState({ page: PAGES.NEW });
  };

  openPageList = () => {
    this.setState({ page: PAGES.LIST });
  };

  loadReviews = ()=>{
    this.setState({loading: true})
    queryAggregate(this.props.host).then(response=>{
      console.log(response)
      this.setState({posts: response.posts, average: response.average, loading: false})
    })
  }

  componentDidMount(){
    this.loadReviews();
  }

  render() {
    const { todos, actions, host } = this.props;
    const { page, posts, average } = this.state;

    return (
      <div>
        <header
          style={{
            textAlign: 'center',
            background: '#f0f2f5',
            padding: 10,
            // position: 'fixed',
            // width: '100%',
            // height: 230,
            // zIndex: 999,
          }}
        >
          <h1>{host}</h1>
          <h4>Reputation</h4>
          <div style={{ fontSize: 60, lineHeight: '1' }}>{average.toFixed(1)}</div>
          <Rate disabled allowHalf value={average} />
        </header>

        {page === PAGES.LIST ? (
          <PageListReviews posts={posts} onOpenPageNew={this.openPageNew} />
        ) : page === PAGES.NEW ? (
          <PageNewReview host={host} onOpenPageList={this.openPageList} />
        ) : null}

        <BackTop />

        <footer style={{ textAlign: 'center', height: 90 }}>
          Made with ❤ in Minsk
        </footer>
      </div>
    );
  }
}
