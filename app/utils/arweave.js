import Arweave from 'arweave/web';
import defaultJwk from './example.json';

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

/** JSON Web Key */
let jwk = defaultJwk;

/**
 * Set new JSON Web Key
 * @param {string} newJwk Keyfile that will be used to sign a transaction
 */
function setJwk(newJwk) {
  jwk = newJwk;
}

/**
 * Returns current active user public key
 */
async function getAuthor() {
  return await arweave.wallets.jwkToAddress(jwk);
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

  const tx = await arweave.createTransaction(
    {
      data: review.text,
    },
    jwk
  );

  const author = await getAuthor();
  const timestamp = new Date().getTime();

  tx.addTag('Content-Type', 'text/plain');
  tx.addTag('App-Name', 'Votics');
  tx.addTag('Votics-Rating', review.rating);
  tx.addTag('Votics-URL', review.url);
  tx.addTag('Votics-Timestamp', timestamp);
  tx.addTag('Votics-Author', author);

  await arweave.transactions.sign(tx, jwk);
  const txId = tx.id;
  console.log(`Sending transaction with id: ${JSON.stringify(tx)}`);
  return arweave.transactions.post(tx).then((rs) => ({
    ...review,
    txId,
    timestamp,
    author,
    id: txId,
    trusted: true,
  }));
}

async function waitForTxInternal(txId, resolve) {
  const status = await arweave.transactions.getStatus(txId);

  if (!status.confirmed) {
    setTimeout(() => waitForTxInternal(txId, resolve), 500);
  } else {
    return resolve(status);
  }
}

async function waitForTx(txId) {
  return new Promise(async (resolve) => {
    waitForTxInternal(txId, resolve);
  });
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
        if (key === 'Votics-Timestamp') {
          review.timestamp = value;
        }
        if (key === 'Votics-Author') {
          review.author = value;
        }

        review.trusted = true;
        review.txId = tx.id;
        review.id = tx.id;
      });

      return review;
    });

    reviews.push(reviewPromise);
  });

  return Promise.all(reviews);
}

export { createReview, queryReviews, setJwk, getAuthor, waitForTx };
