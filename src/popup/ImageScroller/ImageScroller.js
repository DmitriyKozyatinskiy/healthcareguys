import './ImageScroller.scss';

export default class ImageScroller {
  constructor() {
    this._currentImageNumber = 0;
    this._setEvents();
  }


  _setEvents() {
    $(document).on('click', '.js-image-scroller', event => this._handleImageSwitch(event));

    return this;
  }


  _handleImageSwitch(event) {
    const $scroller = $(event.target);
    const $scrollers = $('.js-image-scroller');
    const action = $scroller.attr('data-action');

    switch(action) {
      case 'prev':
        this._currentImageNumber = this._currentImageNumber - 1;
        break;
      case 'next':
        this._currentImageNumber = this._currentImageNumber + 1;
        break;
    }

    $scrollers.addClass('no-events');
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { imageByNumberRequired: this._currentImageNumber }, data => {
        $('#js-image').attr('src', data.image);
        this._currentImageNumber = data.number;
        $scrollers.removeClass('no-events');
      });
    });
  }
}
