;(function() {
  'use strict';
  
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.validateCurrentUrl) {
      if (location.href.search('chrome://') !== -1) {
        sendResponse(false);
      } else {
        sendResponse(true)
      }
    }
  });
}());

