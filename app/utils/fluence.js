import * as fluence from 'fluence';

import { getAuthor } from './arweave';

const contract = '0xeFF91455de6D4CF57C141bD8bF819E5f873c1A01';
const appId = 272;
const ethereumUrl = 'http://geth.fluence.one:8545';

/**
 * Creates new review using arweave
 * @param {{text:string, url:string, rating:number}} review Must contain fields text, rating (int 1 - 5), url
 */
async function createReview(review) {
  if (!review.rating) {
    throw new Error('Rating is required');
  }

  if (!review.url) {
    throw new Error('URL is required');
  }

  const id =
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36);
  const session = await fluence.connect(contract, appId, ethereumUrl);
  const timestamp = new Date().getTime();
  const author = await getAuthor();
  const text = encodeURI(review.text || '');
  const command = `SADD '${review.url}' '${text}:${review.rating}:${timestamp}:${author}:${id}'`;
  console.log('[createReview] command =', { command });
  return session
    .request(command)
    .result()
    .then((rs) => {
      return {
        id,
        timestamp,
        author,
        ...review,
      };
    });
}

/**
 * Queries reviews by url
 *
 * @param {URL to searh reviews for} url
 */
async function queryReviews(url) {
  let session;
  try {
    session = await fluence.connect(contract, appId, ethereumUrl);
  } catch (error) {
    console.error('[Error in fluence->getReviews()]');
    console.error(error);
    return Promise.resolve([]);
  }
  const command = `SMEMBERS ${url}`;

  return session
    .request(command)
    .result()
    .then((r) => {
      const reviews = [];
      const str = r.asString();

      const parts = str.split('\n');
      if (parts.length >= 3) {
        for (let i = 2; i < parts.length; i += 2) {
          const part = parts[i];

          const reviewParts = part.split(':');
          reviews.push({
            text: reviewParts[0] !== '0' ? decodeURI(reviewParts[0]) : '',
            rating: reviewParts[1],
            timestamp: reviewParts[2],
            author: reviewParts[3],
            id: reviewParts[4],
            url,
          });
        }
      }
      return reviews;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
}

/**
 * Leaves vote for review
 * @param {number} id review id to vote for
 * @param {'upvote'|'downvote'} type type of vote, either 'upvote' or 'downvote'
 * @returns {number} new number of likes
 */
async function vote(id, type) {
  console.log('[fluence->vote()]', { id, type });
  if (!(type === 'upvote' || type === 'downvote')) {
    throw new Error('Invalid vote type');
  }

  let session;

  try {
    session = await fluence.connect(contract, appId, ethereumUrl);
  } catch (error) {
    console.error('[Error in fluence->vote()]');
    console.error(error);
    return Promise.reject(error);
  }

  const command = `SADD ${id.trim()}_${type.trim()} ${await getAuthor()}`;

  return session
    .request(command)
    .result()
    .then((r) => {
      const rs = r.asString();
      return Number(rs.substr(1).trim());
    });
}

async function queryVotes(id) {
  if (!id) {
    throw new Error('Id should not be undefined');
  }
  let session;
  try {
    session = await fluence.connect(contract, appId, ethereumUrl);
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
  const upvote = `SCARD ${id.trim()}_upvote`;
  const downvote = `SCARD ${id.trim()}_downvote`;

  const p1 = session
    .request(upvote)
    .result()
    .then((r) => {
      const rs = r.asString();
      return {
        upvote: rs.substr(1).trim(),
      };
    });

  const p2 = session
    .request(downvote)
    .result()
    .then((r) => {
      const rs = r.asString();
      return {
        downvote: rs.substr(1).trim(),
      };
    });

  return Promise.all([p1, p2]).then((r) => ({
    ...r[0],
    ...r[1],
  }));
}

async function canVote(id) {
  if (!id) {
    throw new Error('Id should not be undefined');
  }

  const session = await fluence.connect(contract, appId, ethereumUrl);
  const upvote = `SISMEMBER ${id.trim()}_upvote ${await getAuthor()}`;
  const downvote = `SISMEMBER ${id.trim()}_downvote ${await getAuthor()}`;

  const p1 = session
    .request(upvote)
    .result()
    .then((r) => {
      const rs = r.asString();
      return {
        upvote: rs.substr(1).trim(),
      };
    });

  const p2 = session
    .request(downvote)
    .result()
    .then((r) => {
      const rs = r.asString();
      return {
        downvote: rs.substr(1).trim(),
      };
    });

  return Promise.all([p1, p2]).then((r) => {
    const result = {
      ...r[0],
      ...r[1],
    };
    return !(result.upvote > 0 || result.downvote > 0);
  });
}

export { createReview, queryReviews, vote, queryVotes, canVote };
