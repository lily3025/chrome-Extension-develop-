chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    $('#found').remove();
    $('.list_item[current=1]').prepend('<p id="found">' + [request.longitude, request.latitude].join(',') + '</p>');
    // 地址响应给 background.js
    var firstTitle = '';
    var firstTitleChildNodes = $('.list_item[current=1] .firstTitle')[0].childNodes;
    for (var i = 0, len = firstTitleChildNodes.length, childNode; i < len; i++) {
        childNode = firstTitleChildNodes[i];
        if (childNode.nodeType === Node.TEXT_NODE) {
            firstTitle = $.trim($(childNode).text().replace(/\s+-\s*/i, ''));
            break;
        }
    }
    sendResponse({
        address: $('.list_item[current=1] .item-address').text(),
        title: firstTitle
    });
  });
