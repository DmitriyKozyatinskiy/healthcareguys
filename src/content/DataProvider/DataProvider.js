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
      } else if (request.imageByNumberRequired === 0 || request.imageByNumberRequired) {
        const imageData = this._scrollImages(request.imageByNumberRequired);
        imageData.image = this._formatImage(imageData.image);
        sendResponse(imageData);
      }
      return true;
    });
    return this;
  }


  _getData() {
    const url = $('[property="og:url"]').attr('content') || location.href;
    const title = $('[property="og:title"]').attr('content') || $('title').text();
    const description = $('[property="og:description"]').attr('content') || '';
    const image = this._getImage();

    return {
      pageUrl: location.href,
      description: description,
      url: this._formatUrl(url),
      title: this._formatTitle(title),
      image: this._formatImage(image)
    };
  }


  _isValidImageExtension(image) {
    return image && image.search(/(\.png|\.jpg|\.jpeg)$/ig) !== -1;
  }


  _getImage() {
    const self = this;
    let image = $('[property="og:image"]').attr('content');
    if (this._isValidImageExtension(image)) {
      return image;
    }

    image = $('img').filter(function() {
      const src = $(this).attr('src');
      return self._isValidImageExtension(src);
    }).eq(0)
      .attr('src');

    return image || null;
  }


  _scrollImages(number = 0) {
    const self = this;
    const $images = $('img').filter(function() {
      const src = $(this).attr('src');
      return self._isValidImageExtension(src);
    });

    let contentImage = $('[property="og:image"]').attr('content');

    if (!this._isValidImageExtension(contentImage)) {
      contentImage = null;
    }

    if (!$images.length) {
      return {
        image: contentImage,
        number: 0
      };
    }

    let image;
    if (number < 0) {
      number = $images.length - 1;
    } else if (number === $images.length) {
      if (contentImage) {
        return {
          image: contentImage,
          number: 0
        };
      } else {
        number = 0;
      }
    } else if (number > $images.length) {
      number = 0;
    }

    image = $images.eq(number).attr('src') || null;

    return {
      image: image,
      number: number
    };
  }


  _formatImage(url) {
    if (!url) {
      return null;
    }

    if (url.search(/^(http[s]?)/ig) === -1) {
      return url.replace(/^(\/\/|\/)/gi, location.protocol + '//' + location.host + '/');
    } else {
      return url;
    }
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
