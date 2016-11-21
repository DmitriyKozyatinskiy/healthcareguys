export default class DataProvider {
  constructor() {}

  getTaxonomyList() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ requestTaxonomyList: true }, list => {
        resolve(list);
      });
    });
  }

  getPageData() {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { dataRequired: true }, response => {
          if (response) {
            resolve(response);
          } else {
            reject();
          }
        });
      });
    });
  }


  extendData(data, list, temporaryData) {
    if (temporaryData) {
      data['title'] = temporaryData['title'];
      data['description'] = temporaryData['description'];
      data['tweet_content'] = temporaryData['tweet-content'];
      data['share_content'] = temporaryData['share-content'];
    }
    data.categories = list.data.submit_cat;
    data.tags = list.data.hashtag;
    data.purposes = list.data.purpose;
    data.personas = list.data.persona;
    return data;
  }
}
