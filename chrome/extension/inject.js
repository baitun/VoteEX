window.addEventListener('load', () => {
  document.querySelectorAll('#rso .r').forEach((googleRow) => {
    const h3 = googleRow.querySelector('h3');
    const a = googleRow.querySelector('a');
    const host = new URL(a.href).host;
    if (h3) {
      chrome.runtime.sendMessage({ method: 'test', host }, function(response) {
        console.log(response);
        const posts = response.posts;
        const average =
          posts.reduce((acc, post) => acc + parseFloat(post.rating), 0) /
          posts.length;
        const text = `${posts.length} votes, avg. rate ${
          posts.length > 0 ? average.toFixed(1) : 'NO'
        }`;
        const img = document.createElement('img');
        img.title = text;
        const image =
          posts.length === 0 ? 'unknown' : average > 3 ? 'good' : 'bad';
        img.src = chrome.runtime.getURL(`img/${image}.png`);
        img.style.width = '20px';
        img.style.marginLeft = '5px';
        console.log(img.src);
        h3.appendChild(img);
      });
    }
  });
});
