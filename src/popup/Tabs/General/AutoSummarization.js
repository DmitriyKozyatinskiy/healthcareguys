import Algorithmia from './Algorithmia';


const API_KEY = 'sim87w5zAIIeAAHUgQxghLJqTPg1';
const AUTO_TAG_URL = 'algo://nlp/AutoTag/1.0.0';
const SUMMARY_URL = 'algo://nlp/SummarizeURL/0.1.1';


export default class AutoSummarization {
  constructor() {
    this._setEvents();
  }
  

  _setEvents() {
    return this;
  }


  static generateSummary(url) {
    return new Promise((resolve) => {
      Algorithmia.client(API_KEY)
        .algo(SUMMARY_URL)
        .pipe(url)
        .then(output => {
          resolve(output.result);
        });
    });
  }


  static generateTags(content) {
    return new Promise((resolve) => {
      Algorithmia.client(API_KEY)
        .algo(AUTO_TAG_URL)
        .pipe(content)
        .then(output => {
          resolve(output.result);
        });
    });
  }
}
