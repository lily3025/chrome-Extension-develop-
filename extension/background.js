chrome.webRequest.onBeforeRequest.addListener(function(info) {
    var match = info.url.match(/location=([\d.]+),([\d.]+)/);
    var message = {
        longitude: match[1],
        latitude: match[2]
    };
    // 发送消息给审核页面的 Content Script
    chrome.tabs.sendMessage(senderTab.id, message, function(response) {});
    chrome.tabs.sendMessage(newTab.id, message, function(response) {
        // 发送地址给审核页面的 Content Script
        chrome.tabs.sendMessage(senderTab.id, response, function(response) {});
    });
}, {
    urls: ["http://restapi.amap.com/*"]
});

var senderTab;
var newTab;
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    senderTab = sender.tab;
    if (newTab) {
        chrome.tabs.update(newTab.id, {
            active: true,
            url: request.url
        }, function(tab) {});
    } else {
        chrome.tabs.create({
            active: true,
            url: request.url
        }, function(tab) {
            newTab = tab;
        });
    }
  });

chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
    if (newTab && newTab.id === tabId) {
        newTab = null;
    }
});
