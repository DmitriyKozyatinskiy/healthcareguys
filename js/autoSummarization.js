var AutoSummarization = (function() {
  'use strict';

  var API_KEY = 'simGaVZpKQKSKM4JLiMwTAg4AQS1';
  var AUTO_TAG_URL = 'algo://nlp/AutoTag/1.0.0';
  var SUMMARY_URL = 'algo://nlp/SummarizeURL/0.1.1';

  function generateSummary(url) {
    var dfd = $.Deferred();
    Algorithmia.client(API_KEY)
      .algo(SUMMARY_URL)
      .pipe(url)
      .then(function(output) {
        dfd.resolve(output.result);
      });
    return dfd.promise();
  }

  function generateTags(content) {
    var dfd = $.Deferred();
    Algorithmia.client(API_KEY)
      .algo(AUTO_TAG_URL)
      .pipe(content)
      .then(function(output) {
        dfd.resolve(output.result);
      });
    return dfd.promise();
  }

  return {
    generateTags: generateTags,
    generateSummary: generateSummary
  };
}());