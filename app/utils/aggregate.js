import * as arw from './arweave';
import * as fls from './fluence';

async function queryAggregate(url) {
  return Promise.all([arw.queryReviews(url), fls.queryReviews(url)]).then(
    (values) => {
      const posts = [].concat(...values);

      // Sort by date desc
      posts.sort((p1, p2) => p2.timestamp - p1.timestamp);

      const count = posts.length;

      return {
        count,
        posts,
      };
    }
  );
}

async function x() {
  return null;
}

export { queryAggregate, x };
