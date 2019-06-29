import { BackTop, Rate, Spin } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TodoActions from '../actions/todos';
import { queryAggregate } from '../utils/aggregate';
import { queryVotes, vote } from '../utils/fluence';
import { PageListReviews } from './PageListReviews';
import { PageNewReview } from './PageNewReview';

const PAGES = {
  NEW: 'PageNewReview',
  LIST: 'PageListReviews',
};

@connect(
  (state) => ({
    // host: 'aviasales.ru',
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
    host: undefined,
  };

  openPageNew = () => {
    this.setState({ page: PAGES.NEW });
  };

  openPageList = () => {
    this.setState({ page: PAGES.LIST });
  };

  addNewPost = (newPost, advanced = false) => {
    console.log('[addNewPost]', { newPost, advanced });
    const newPosts = [newPost, ...this.state.posts];
    this.setState({ page: PAGES.LIST, posts: newPosts });
  };

  handleVoteClick = async (id, type) => {
    // positive adding likes
    const posts = this.state.posts.map((post) => {
      if (post.id === id) {
        if (type === 'upvote') {
          return { ...post, upvote: parseInt(post.upvote) + 1 };
        } else {
          return { ...post, downvote: parseInt(post.downvote) + 1 };
        }
      } else {
        return post;
      }
    });
    this.setState({ posts });

    vote(id, type).then((newNumber) => {
      const posts = this.state.posts.map((post) => {
        if (post.id === id) {
          if (type === 'upvote') {
            return { ...post, upvote: newNumber };
          } else {
            return { ...post, downvote: newNumber };
          }
        } else {
          return post;
        }
      });
      console.log('newPosts after load new likes', posts);
      this.setState({ posts: posts });
    });
  };

  loadLikes = async (posts) => {
    return; // @TODO remove this line when fluence will be fixed
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      queryVotes(post.id).then((votes) => {
        const newPosts = this.state.posts.map((p) =>
          p.id !== post.id ? p : { ...p, ...votes }
        );
        this.setState(newPosts);
      });
    }
  };

  loadReviews = (host) => {
    this.setState({ loading: true });
    queryAggregate(host).then((response) => {
      console.log('[loadReviews->queryAggregate]', { response });
      this.setState({ posts: response.posts, loading: false });
      this.loadLikes(response.posts);
    });
  };

  componentDidMount() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      const host = new URL(tabs[0].url).host;
      this.setState({ host });
      this.loadReviews(host);
    });
  }

  render() {
    // const { todos, actions, host } = this.props;
    const { page, posts, host, loading } = this.state;

    const average =
      posts.length > 0
        ? posts.reduce((acc, post) => acc + parseFloat(post.rating), 0) /
          posts.length
        : 0;

    if (host === undefined) return null;

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
          <div style={{ fontSize: 60, lineHeight: '1' }}>
            {average === undefined ? (
              <Spin />
            ) : average ? (
              average.toFixed(1)
            ) : (
              'NO'
            )}
          </div>
          <Rate disabled allowHalf value={average} />
        </header>

        {page === PAGES.LIST ? (
          <PageListReviews
            posts={posts}
            loading={loading}
            onVoteClick={this.handleVoteClick}
            onOpenPageNew={this.openPageNew}
          />
        ) : page === PAGES.NEW ? (
          <PageNewReview
            host={host}
            onOpenPageList={this.openPageList}
            addNewPost={this.addNewPost}
          />
        ) : null}

        <BackTop />

        <footer style={{ textAlign: 'center', height: 90 }}>
          Made with ❤ in Minsk
        </footer>
      </div>
    );
  }
}
