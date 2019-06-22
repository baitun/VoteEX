import { Divider, Rate, Button } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TodoActions from '../actions/todos';
import { Reviews } from '../components/Reviews/Reviews';

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
  render() {
    const { todos, actions, host, rate, reviews } = this.props;
    console.log(reviews);

    return (
      <div style={{ padding: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <h1>{host}</h1>
          <h4>Reputation</h4>
          <div style={{ fontSize: 60 }}>{rate}</div>
          <Rate disabled allowHalf value={rate} />
          <Divider />
          <Button>Rate this site</Button>
        </div>
        <div />
        <Divider />
        <Reviews reviews={reviews} host={host} />
      </div>
    );
  }
}
