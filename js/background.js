;(function () {
  chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
    chrome.storage.sync.set({ 'token': data.token }, function() {
      sendResponse(data.token);
    });
    return true;
  });
}());