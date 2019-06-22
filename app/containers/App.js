import { Divider, Rate, Button, BackTop } from 'antd';
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
          <div style={{ fontSize: 60 }}>{rate}</div>
          <Rate disabled allowHalf value={rate} />
        </header>

        <section
          style={{
            padding: 10,
            // marginTop: 230
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Button size="large">Rate this site</Button>
          </div>
          <div />
          <Reviews reviews={reviews} host={host} />
        </section>

        <BackTop />

        <footer style={{ textAlign: 'center', height: 90 }}>
          Made with ❤ in Minsk
        </footer>
      </div>
    );
  }
}
