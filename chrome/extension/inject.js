const aggregate = require('../../app/utils/aggregate');

window.addEventListener('load', () => {
  let hosts = [];
  document.querySelectorAll('.srg .r>a').forEach((googleItem) => {
    const host = new URL(googleItem.href).host;

    chrome.runtime.sendMessage({ method: 'test', host }, function(response) {
      console.log(response);
      const posts = response.posts;
      const text = `[${posts.length} votes]`;
      const span = document.createElement('span');
      span.innerText = text;
      googleItem.appendChild(span);
    });
  });

  // (async function() {
  //   await aggregate.queryAggregate(host);
  // })()
});
