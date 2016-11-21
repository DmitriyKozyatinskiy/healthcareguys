import $ from 'jquery';

export default class DataSaver {
  constructor(data) {
    this._setEvents();
  }


  _setEvents() {
    $(document).on('change', '.js-change-observer', () => {
      const data = this._getNewData();
      this._storeData(data);
    });

    window.setInterval(() => {
      const data = this._getNewData();
      this._storeData(data);
    }, 1500);
    return this;
  }
  
  
  _getNewData() {
    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'tweet-content': $('#js-tweet-content').val(),
      'share-content': $('#js-share-content').val()
    }
  }


  _storeData(data) {
    const self = this;
    return new Promise((resolve) => {
      chrome.storage.sync.set({temporaryData: data}, () => {
        self._data = data;
        resolve(data);
      });
    });
  }
  

  getData(url) {
    return new Promise((resolve) => {
      chrome.storage.sync.get('temporaryData', data => {
        if (data.temporaryData && data.temporaryData.url === url) {
          resolve(data.temporaryData);
        } else {
          resolve(false);
        }
      });
    });
  }
}
