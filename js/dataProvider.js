;(function () {
  'use strict';

  function getData() {    
    var url = $('[property="og:url"]').attr('content') || location.href;
    var title = $('[property="og:title"]').attr('content') || $('title').text();
    var description = $('[property="og:description"]').attr('content') || formatUrl(location.href);
    var image = $('[property="og:image"]').attr('content') || null;

    return {
      url: formatUrl(url),
      title: formatTitle(title),
      description: description,
      image: image
    };
  }

  function checkImageExistence(imageUrl) {
    var dfd = $.Deferred();
    if (imageUrl) {
      $.get(imageUrl).done(function() {
        dfd.resolve();
      }).fail(function() {
        dfd.reject();
      });
    } else {
      window.setTimeout(function() {
        dfd.resolve();
      }, 1);
    }
    return dfd.promise();
  }

  function formatUrl(url) {
    return url.split('?')[0];
  }

  function formatTitle(title) {
    return title.split('|')[0].trim();
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.dataRequired) {
      var data = getData();
      checkImageExistence(data.image).done(function() {
        sendResponse(data);
      }).fail(function() {
        data.image = null;
        sendResponse(data);
      });
    }
    return true;
  });
}());
