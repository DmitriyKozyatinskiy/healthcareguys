;(function () {
  'use strict';

  function getData() {
    var url = $('[property="og:url"]').attr('content');
    var title = $('[property="og:title"]').attr('content');
    var description = $('[property="og:description"]').attr('content');
    var image = $('[property="og:image"]').attr('content');

    return {
      url: url || '',
      title: title || '',
      description: description || '',
      image: image || null
    };
  }

  function getCategories() {
    var dfd = $.Deferred();

    $.get('https://news-devl.healthcareguys.com/wp-json/wp/v2/categories', function(categories) {
      dfd.resolve(categories);
    });

    return dfd.promise();
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.dataRequired) {
      var data = getData();

      if (!data.title) {
        sendResponse(false);
      } else {
        getCategories().done(function(categories) {
          data.categories = categories;
          sendResponse(data);
        });
      }
    }
    return true;
  });
}());
