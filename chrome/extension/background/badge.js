chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  const host = new URL(tab.url).host;
  const aggregate = require('../../../app/utils/aggregate');

  chrome.browserAction.setBadgeText({ text: '?' });
  aggregate.queryAggregate(host).then(result => {
    chrome.browserAction.setBadgeText({ text: `${result.count}` });

    const val = {};
    val.key = `${host}-reviews`;
    val.value = result;
    chrome.storage.local.set(val);
  });
});
