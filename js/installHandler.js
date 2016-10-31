;(function() {
  'use strict';

  var manifest = chrome.runtime.getManifest();

  function injectIntoTab (tab) {
    var scripts = manifest.content_scripts[0].js;
    var i;
    var scriptsAmount = scripts.length;
    for(i = 0; i < scriptsAmount; i++ ) {
      chrome.tabs.executeScript(tab.id, {
        file: scripts[i]
      });
    }
  }

  chrome.runtime.onInstalled.addListener(function() {
    chrome.windows.getAll({ populate: true }, function (windows) {
      var i;
      var j;
      var windowAmount = windows.length;
      var tabsAmount;
      var currentWindow;
      var currentTab;
      for(i = 0; i < windowAmount; i++ ) {
        currentWindow = windows[i];
        tabsAmount = currentWindow.tabs.length;
        for(j = 0; j < tabsAmount; j++ ) {
          currentTab = currentWindow.tabs[j];
          if(!currentTab.url.match(/(chrome):\/\//gi) ) {
            injectIntoTab(currentTab);
          }
        }
      }
    });
  })
}());