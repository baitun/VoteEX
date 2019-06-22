import React, { Component, PropTypes } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as TodoActions from "../actions/todos";

import { Button, Row, Col, Rate } from "antd";

@connect(
  state => ({
    todos: state.todos
  }),
  dispatch => ({
    actions: bindActionCreators(TodoActions, dispatch)
  })
)
export default class App extends Component {
  static propTypes = {
    todos: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired
  };

  render() {
    const { todos, actions } = this.props;

    return (
      <div>
        <h1>Commets for this site</h1>
        Rate this site:
        <Rate />
      </div>
    );
  }
}
