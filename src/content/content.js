import DataProvider from './DataProvider/DataProvider';


const insert_node = document.createElement('div');
insert_node.id = 'HOST_SITE';
document.documentElement.appendChild(insert_node);

const dataProvider = new DataProvider();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.validateCurrentUrl) {
    if (location.href.search('chrome://') !== -1) {
      sendResponse(false);
    } else {
      sendResponse(true)
    }
  }
});
