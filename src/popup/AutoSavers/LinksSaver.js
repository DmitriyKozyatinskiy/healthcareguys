import $ from 'jquery';

export default class LinksSaver {
  constructor() {}
  
  
  static storeLinks(linkObject) {
    return new Promise((resolve) => {
      this._getAllLinks().then(links => {
        const itemId = links.findIndex(item => {
          return item.cleanURL == linkObject.cleanURL;
        });
        if (itemId === -1) {
          links.push(linkObject);
        } else {
          links[itemId] = linkObject;
        }
        chrome.storage.sync.set({shortLinks: links}, () => {
          resolve(links);
        });
      });
    });
  }


  static setLinks(url) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('shortLinks', links => {
        links = links || {};
        let linksObject;

        if (!links.shortLinks) {
          reject();
        } else {
          linksObject = links.shortLinks.find(item => {
            return item.cleanURL === url;
          });
        }

        if (linksObject) {
          this._placeLinks(linksObject);
          resolve(linksObject);
        } else {
          reject();
        }
      });
    });
  }


  static _getAllLinks() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('shortLinks', links => {
        resolve(links.shortLinks || []);
      });
    });
  }


  static _placeLinks(links) {
    $('#js-clean-link').val(links.cleanURL);
    $('#js-short-link').val(links.shortBadgedURL);
    $('#js-badged-link').val(links.badgedURL);
    $('#js-canonical-link').val(links.shortCanonicalURL);
  }
}
