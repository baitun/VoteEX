import * as fluence from 'fluence';

const contract = '0xeFF91455de6D4CF57C141bD8bF819E5f873c1A01';
const appId = 252;
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

  const session = await fluence.connect(contract, appId, ethereumUrl);
  const command = `SADD '${review.url}' '${encodeURI(review.text)}:${review.rating}'`;
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
          url,
        });
      }
    }
    return reviews;
  });
}

export {
  createReview,
  queryReviews,
};
