const aggregate = require('../../app/utils/aggregate');

window.addEventListener('load', () => {
  document.querySelectorAll('.srg .r>a').forEach((googleItem) => {
    const host = new URL(googleItem.href).host;

    // aggregate.queryAggregate(host).then((res) => {
    //   console.log(res);
    // });

    const text = `[${host} votes]`;

    const span = document.createElement('span');
    span.innerText = text;
    googleItem.appendChild(span);
  });

  // (async function() {
  //   await aggregate.queryAggregate(host);
  // })()
});
