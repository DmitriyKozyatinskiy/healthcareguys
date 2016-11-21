import $ from 'jquery';
import InstallHandler from './Install/InstallHandler';


function getTaxonomyList() {
  return new Promise((resolve) => {
    $.get('https://news-devl.healthcareguys.com/wp-json/api/wp/v2/taxonomy?post_type=wpri_submit', list => {
      resolve(list);
    });
  });
}


const installHandler = new InstallHandler();

getTaxonomyList().then(list => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.requestTaxonomyList) {
      sendResponse(list);
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.token) {
    chrome.storage.sync.set({ 'token': request.token }, () => {
      sendResponse(request.token);
    });
  } else if (request.disablePopup) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.browserAction.disable(tabs[0].id);
    });
  } else if (request.enablePopup) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.browserAction.enable(sender.tab.id);
    });
  }
  return true;
});

chrome.tabs.onActivated.addListener(() => {
  chrome.storage.sync.set({ temporaryData: null });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.active && tab.selected) {
    chrome.storage.sync.set({ temporaryData: null });
  }
});
