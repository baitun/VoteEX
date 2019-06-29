import * as arw from './arweave';
import * as fls from './fluence';

/**
 * Get merget reviews from both fluence and arvweave
 * @param {string} host
 * @returns {Promise<{count:number, average:number, posts: {}[]>}
 */
async function queryAggregate(host) {
  const promises = [
    //
    arw.queryReviews(host),
    fls.queryReviews(host),
  ];
  return Promise.all(promises).then((values) => {
    const posts = [].concat(...values);

    // Sort by date desc
    posts.sort((p1, p2) => p2.timestamp - p1.timestamp);

    const count = posts.length;
    const average =
      posts.length === 0
        ? 0
        : posts.reduce((acc, post) => acc + parseFloat(post.rating), 0) /
          posts.length;

    return {
      count,
      average,
      posts,
    };
  });
}

export { queryAggregate };
