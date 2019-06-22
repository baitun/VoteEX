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
    todos: state.todos,
    host: 'aviasales.ru',
    rate: 4.5,
    reviews: require('./mock_reviews'),
  }),
  (dispatch) => ({
    actions: bindActionCreators(TodoActions, dispatch),
  })
)
export default class App extends Component {
  state = {
    page: PAGES.NEW,
  };

  openPageNew = () => {
    this.setState({ page: PAGES.NEW });
  };

  openPageList = () => {
    this.setState({ page: PAGES.LIST });
  };

  componentDidMount(){
    queryAggregate(this.props.host).then(response=>{
      console.log(response)
    })
  }

  render() {
    const { todos, actions, host, rate, reviews } = this.props;
    const { page } = this.state;

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
          <div style={{ fontSize: 60, lineHeight: '1' }}>{rate}</div>
          <Rate disabled allowHalf value={rate} />
        </header>

        {page === PAGES.LIST ? (
          <PageListReviews reviews={reviews} onOpenPageNew={this.openPageNew} />
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
