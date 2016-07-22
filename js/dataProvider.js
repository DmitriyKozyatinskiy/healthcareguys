;(function () {
  'use strict';

  function getTaxonomiesList() {
    var dfd = $.Deferred();

      $.get('https://news-devl.healthcareguys.com/wp-json/api/wp/v2/taxonomy?post_type=wpri_submit', function(list) {
      dfd.resolve(list);
    });

    return dfd.promise();
  }

  function getData() {
    var dfd = $.Deferred();
    getTaxonomiesList().done(function(list) {
      var url = $('[property="og:url"]').attr('content');
      var title = $('[property="og:title"]').attr('content');
      var description = $('[property="og:description"]').attr('content');
      var image = $('[property="og:image"]').attr('content');

      dfd.resolve({
        url: url || location.href,
        title: title ||  $('title').text(),
        description: description || location.href,
        image: image || null,
        categories: list.data.submit_cat,
        tags: list.data.submit_tag,
        purposes: list.data.purpose,
        personas: list.data.persona
      });
    });
    return dfd.promise();
  }

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.dataRequired) {
      getData().done(function(data) {
        sendResponse(data);
      });
    }
    return true;
  });
}());
