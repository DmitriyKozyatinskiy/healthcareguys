var AutoSaver = (function() {
  'use strict';

  function getTemporaryContent() {
    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'tweet-content': $('#js-tweet-content').val(),
      'share-content': $('#js-share-content').val()
    }
  }

  function getTemporaryData(url) {
    var dfd = $.Deferred();
    chrome.storage.sync.get('temporaryData', function(data) {
      if (data.temporaryData && data.temporaryData.url === url) {
        dfd.resolve(data.temporaryData);
      } else {
        dfd.resolve(false);
      }
    });
    return dfd.promise();
  }

  function storeTemporaryData(data) {
    var dfd = $.Deferred();
    chrome.storage.sync.set({ temporaryData: data }, function() {
      dfd.resolve(data);
    });
    return dfd.promise();
  }

  function getShortLinks(url) {
    var dfd = $.Deferred();
    chrome.storage.sync.get('shortLinks', function(links) {
      var linksObject;

      if (!links.shortLinks) {
        dfd.reject();
      } else {
        linksObject = links.shortLinks.find(function(item) {
          return item.cleanURL === url;
        });
      }

      if (linksObject) {
        dfd.resolve(linksObject);
      } else {
        dfd.reject();
      }
    });
    return dfd.promise();
  }

  function getAllShortLinks() {
    var dfd = $.Deferred();
    chrome.storage.sync.get('shortLinks', function(links) {
      dfd.resolve(links.shortLinks || []);
    });
    return dfd.promise();
  }

  function storeShortLinks(linkObject) {
    var dfd = $.Deferred();
    getAllShortLinks().done(function(links) {
      var itemId = links.findIndex(function(item) {
        return item.cleanURL == linkObject.cleanURL;
      });
      if (itemId === -1) {
        links.push(linkObject);
      } else {
        links[itemId] = linkObject;
      }
      chrome.storage.sync.set({ shortLinks: links }, function() {
        dfd.resolve(links);
      });
    });
    return dfd.promise();
  }

  $(document).on('change', '.js-change-observer', function() {
    var data = getTemporaryContent();
    storeTemporaryData(data);
  });

  window.setInterval(function() {
    var data = getTemporaryContent();
    storeTemporaryData(data);
  }, 1500);

  return {
    getShortLinks: getShortLinks,
    getAllShortLinks: getAllShortLinks,
    storeShortLinks: storeShortLinks,
    getTemporaryData: getTemporaryData
  }
}());