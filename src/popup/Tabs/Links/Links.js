import $ from 'jquery';
import Mustache from 'mustache';
import template from './Links.html';


export default class Links {
  constructor(container) {
    this._tab = null;
    this._container = container;
    this._setEvents();
  }


  get tab() {
    return this._tab;
  }


  show(data) {
    this._data = data;
    this._render();
    this._container.append(this._tab);
    return this;
  }
  

  _render() {
    this._tab = $(Mustache.render(template, this._data));
    return this;
  }


  _setEvents() {
    $(document)
      .on('click', '.js-copy-link-button', this._copyShortLink)
      .on('click', '.js-feedback-link', event => {
        event.preventDefault();
        $('#js-feedback-tab-button').trigger('click');
      });
    return this;
  }


  _copyShortLink() {
    var $button = $(this);
    var input = $button.closest('.form-group').find('.js-short-link-input').get(0);
    if (!input.value) {
      return;
    }
    input.disabled = false;
    input.select();
    document.execCommand('copy');
    input.disabled = true;
    return this;
  }
}
