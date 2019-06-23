import { Divider, Rate, Button, BackTop } from 'antd';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as TodoActions from '../actions/todos';
import { Reviews } from '../components/Reviews/Reviews';
import { PageListReviews } from './PageListReviews';
import { PageNewReview } from './PageNewReview';
import { queryAggregate } from '../utils/aggregate';
import { queryVotes, vote } from '../utils/fluence';

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
    average: 'NO',
    host: undefined
  };

  openPageNew = () => {
    this.setState({ page: PAGES.NEW });
  };

  openPageList = () => {
    this.setState({ page: PAGES.LIST });
  };

  addNewPost = (newPost, advanced=false)=>{
    console.log('[addNewPost]', {newPost, advanced})
    const newPosts = [newPost, ...this.state.posts];
    this.setState({page: PAGES.LIST, posts: newPosts});
  }

  handleVoteClick = async (id, type)=>{
    vote(id, type).then(res=>{
      const newPosts = this.state.posts.map(async (p)=>{
        if(p.id===id) {
          const likes = await queryVotes(id);
          return {...p, ...likes}
        } else {
          return p;
        }
      })
      this.setState({posts: newPosts})
    })
  }

  loadLikes = async (posts)=>{
    let promises = [];
    for(let i=0;i<posts.length; i++) {
      const post=posts[i];
      promises.push(queryVotes(post.id));
    }

    Promise.all(promises).then(values=>{
      const newPosts = values.map((v,i)=>{
        return {
          ...posts[i],
          ...v
        }
      })
      this.setState({posts:newPosts})
    })

  }

  loadReviews = (host)=>{
    this.setState({loading: true})
    queryAggregate(host).then(response=>{
      console.log(response)
      this.setState({posts: response.posts, loading: false})
      this.loadLikes(response.posts);
    })
  }

  componentDidMount(){
    
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true},  (tabs)=> {
      const host =   new URL(tabs[0].url).host;
      this.setState({host})
      this.loadReviews(host);
    });
  }

  render() {
    // const { todos, actions, host } = this.props;
    const { page, posts, host, loading } = this.state;

    const average = posts.reduce((acc, post) => acc + parseFloat(post.rating), 0) / posts.length;

    if(host===undefined) return null;

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
          <div style={{ fontSize: 60, lineHeight: '1' }}>{average?average.toFixed(1):'NO'}</div>
          <Rate disabled allowHalf value={average} />
        </header>

        {page === PAGES.LIST ? (
          <PageListReviews posts={posts} loading={loading} onVoteClick={this.handleVoteClick} onOpenPageNew={this.openPageNew} />
        ) : page === PAGES.NEW ? (
          <PageNewReview host={host} onOpenPageList={this.openPageList} addNewPost={this.addNewPost} />
        ) : null}

        <BackTop />

        <footer style={{ textAlign: 'center', height: 90 }}>
          Made with ❤ in Minsk
        </footer>
      </div>
    );
  }
}
