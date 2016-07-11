;(function () {
  'use strict';

  function getData() {
    var title = $('[property="og:title"]').attr('content');
    var description = $('[property="og:description"]').attr('content');
    var image = $('[property="og:image"]').attr('content');

    return {
      title: title || '',
      description: description || '',
      image: image || null
    };
  }

  function getCategories() {
    var dfd = $.Deferred();

    $.get('https://news-devl.healthcareguys.com/wp-json/taxonomies/submit_cat/terms', function(categories) {
      dfd.resolve(categories);
    });

    return dfd.promise();
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.dataRequired) {
      var data = getData();
      getCategories().done(function(categories) {
        data.categories = categories;
        sendResponse(data);
      });
    }
    return true;
  });
}());
