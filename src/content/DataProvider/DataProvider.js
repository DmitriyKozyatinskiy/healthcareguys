import $ from 'jquery';


export default class DataProvider {
  constructor() {
    this._setEvents();
  }


  _setEvents() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.dataRequired) {
        const data = this._getData();
        this._checkImageExistence(data.image).then(() => {
          sendResponse(data);
        }, () => {
          data.image = null;
          sendResponse(data);
        })
      }
      return true;
    });
    return this;
  }


  _getData() {
    const url = $('[property="og:url"]').attr('content') || location.href;
    const title = $('[property="og:title"]').attr('content') || $('title').text();
    const description = $('[property="og:description"]').attr('content') || '';
    const image = $('[property="og:image"]').attr('content') || null;

    return {
      url: this._formatUrl(url),
      title: this._formatTitle(title),
      description: description,
      image: image,
      pageUrl: location.href
    };
  }


  _formatUrl(url) {
    return url.split('?')[0];
  }


  _formatTitle(title) {
    return title.split('|')[0].trim();
  }


  _checkImageExistence(imageUrl) {
    return new Promise((resolve, reject) => {
      if (imageUrl) {
        $.get(imageUrl).done(() => {
          resolve();
        }).fail(() => {
          reject();
        });
      } else {
        resolve();
      }
    });
  }
}
