;(function () {
  function getTaxonomyList() {
    var dfd = $.Deferred();

    $.get('https://news-devl.healthcareguys.com/wp-json/api/wp/v2/taxonomy?post_type=wpri_submit', function(list) {
      dfd.resolve(list);
    });

    return dfd.promise();
  }

  getTaxonomyList().done(function(list) {
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      if (request.requestTaxonomyList) {
        sendResponse(list);
      }
    });
  });
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.token) {
      chrome.storage.sync.set({ 'token': request.token }, function() {
        sendResponse(request.token);
      });
    } else if (request.disablePopup) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log(tabs);
        chrome.browserAction.disable(tabs[0].id);
      });
    } else if (request.enablePopup) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        console.log(tabs);
        console.log('id: ', sender.tab.id);
        chrome.browserAction.enable(sender.tab.id);
      });
    }
    return true;
  });
}());