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
      if (request.requestTaxonomyList)
        sendResponse(list);
      });
  });
  
  chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    chrome.storage.sync.set({ 'token': data.token }, function() {
      sendResponse(data.token);
    });
    return true;
  });
}());