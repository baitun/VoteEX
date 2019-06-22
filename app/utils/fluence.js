import * as fluence from 'fluence';

import { getAuthor } from './arweave';

const contract = '0xeFF91455de6D4CF57C141bD8bF819E5f873c1A01';
const appId = 266;
const ethereumUrl = 'http://geth.fluence.one:8545';

/**
 * Creates new review using arweave
 *
 * @param {Keyfile that will be used to sign a transaction} jwk
 * @param {Review. Must contain fields text, rating (int 1 - 5), url} review
 */
async function createReview(review) {
  if (!review.text) {
    throw new Error('Text is required');
  }

  if (!review.rating) {
    throw new Error('Rating is required');
  }

  if (!review.url) {
    throw new Error('URL is required');
  }

  const id = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  const session = await fluence.connect(contract, appId, ethereumUrl);
  const command = `SADD '${review.url}' '${encodeURI(review.text)}:${review.rating}:${new Date().getTime()}:${await getAuthor()}:${id}'`;
  return session.request(command).result();
}

/**
 * Queries reviews by url
 *
 * @param {URL to searh reviews for} url
 */
async function queryReviews(url) {
  const session = await fluence.connect(contract, appId, ethereumUrl);
  const command = `SMEMBERS ${url}`;

  return session.request(command).result().then((r) => {
    const reviews = [];
    const str = r.asString();

    const parts = str.split('\n');
    if (parts.length >= 3) {
      for (let i = 2; i < parts.length; i += 2) {
        const part = parts[i];

        const reviewParts = part.split(':');
        reviews.push({
          text: decodeURI(reviewParts[0]),
          rating: reviewParts[1],
          timestamp: reviewParts[2],
          author: reviewParts[3],
          id: reviewParts[4],
          url,
        });
      }
    }
    return reviews;
  });
}

/**
 * Leaves vote for review
 *
 * @param {review id to vote for} id
 * @param {type of vote, either 'upvote' or 'downvote'} type
 */
async function vote(id, type) {
  if (!(type === 'upvote' || type === 'downvote')) {
    throw new Error('Invalid vote type');
  }

  const session = await fluence.connect(contract, appId, ethereumUrl);
  const command = `SADD ${id}_${type} ${await getAuthor()}`;

  return session.request(command).result().then((r) => {
    const rs = r.asString();
    return rs.substr(1).trim();
  });
}

async function queryVotes(id) {
  const session = await fluence.connect(contract, appId, ethereumUrl);
  const upvote = `SCARD ${id}_upvote`;
  const downvote = `SCARD ${id}_downvote`;

  const p1 = session.request(upvote).result().then((r) => {
    const rs = r.asString();
    return {
      upvote: rs.substr(1).trim()
    };
  });

  const p2 = session.request(downvote).result().then((r) => {
    const rs = r.asString();
    return {
      downvote: rs.substr(1).trim()
    };
  });

  return Promise.all([p1, p2]).then(r => ({
    ...r[0],
    ...r[1],
  }));
}

async function canVote(id) {
  const session = await fluence.connect(contract, appId, ethereumUrl);
  const upvote = `SISMEMBER ${id}_upvote ${await getAuthor()}`;
  const downvote = `SISMEMBER ${id}_downvote ${await getAuthor()}`;

  const p1 = session.request(upvote).result().then((r) => {
    const rs = r.asString();
    return {
      upvote: rs.substr(1).trim()
    };
  });

  const p2 = session.request(downvote).result().then((r) => {
    const rs = r.asString();
    return {
      downvote: rs.substr(1).trim()
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

export {
  createReview,
  queryReviews,
  vote,
  queryVotes,
  canVote,
};
