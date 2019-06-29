chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'complete') return;
  const aggregate = require('../../../app/utils/aggregate');

  const host = new URL(tab.url).host;
  console.log('[onTabUpdated]', host, tab);

  chrome.browserAction.setBadgeText({ text: '?' });
  aggregate.queryAggregate(host).then((result) => {
    const { count, average } = result;
    const title = `${host}: ${count} votes, avg. rate ${average.toFixed(2)}`;
    const color = average > 3 ? '#00FF00' : '#FF0000';

    chrome.browserAction.setTitle({ title, tabId });
    chrome.browserAction.setBadgeText({ text: String(count), tabId });
    chrome.browserAction.setBadgeBackgroundColor({ color, tabId });

    //   const val = {};
    //   val.key = `${host}-reviews`;
    //   val.value = result;
    //   chrome.storage.local.set(val);
  });
});
