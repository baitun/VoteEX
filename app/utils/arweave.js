import Arweave from 'arweave/web';
import defaultJwk from './example.json';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

let jwk = defaultJwk;

/**
 *
 * @param {Keyfile that will be used to sign a transaction} newJwk
 */
function setJwk(newJwk) {
  jwk = newJwk;
}

/**
 * Creates new review using arweave
 *
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

  const tx = await arweave.createTransaction({
    data: review.text,
  }, jwk);

  tx.addTag('Content-Type', 'text/plain');
  tx.addTag('App-Name', 'Votics');
  tx.addTag('Votics-Rating', review.rating);
  tx.addTag('Votics-URL', review.url);

  await arweave.transactions.sign(tx, jwk);

  console.log(`Sending transaction with id: ${tx.id}`);
  return arweave.transactions.post(tx);
}

/**
 * Queries reviews by url
 *
 * @param {URL to searh reviews for} url
 */
async function queryReviews(url) {
  // Query transactions by tags from arweave
  const txids = await arweave.arql({
    op: 'equals',
    expr1: 'Votics-URL',
    expr2: url,
  });

  // For each transaction decode revuew from data and tags
  const reviews = [];
  txids.forEach((txid) => {
    const reviewPromise = arweave.transactions.get(txid).then((tx) => {
      const review = {};

      review.text = tx.get('data', { decode: true, string: true });

      tx.get('tags').forEach((tag) => {
        const key = tag.get('name', { decode: true, string: true });
        const value = tag.get('value', { decode: true, string: true });

        if (key === 'Votics-Rating') {
          review.rating = value;
        }
        if (key === 'Votics-URL') {
          review.url = value;
        }
      });

      return review;
    });

    reviews.push(reviewPromise);
  });

  return Promise.all(reviews);
}

export {
  createReview,
  queryReviews,
  setJwk,
};
