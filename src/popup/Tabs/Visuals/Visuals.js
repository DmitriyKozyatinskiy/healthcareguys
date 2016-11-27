import $ from 'jquery';
import Mustache from 'mustache';
import template from './Visuals.html';
import FileUploader from './../../Helpers/FileUploader';


export default class Visuals {
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
    this._container.append(this._tab);
    return this;
  }


  _setEvents() {
    const self = this;
    
    $(document)
      .on('change', '.js-visuals-uploader', function() {
        FileUploader.uploadImage.call(this, self._handleImageUpload);
      })
      .on('click', '.js-visuals-image-remove', event => {
        const $removeButton = $(event.target);
        this._handleImageRemove($removeButton)
      })
      .on('change', '.js-visuals-select', event => {
        this._handleSelectorChange(event)
      })
      .on('click', '.js-visuals-image-upload-button', event => {
        $(event.target).parent().find('.js-visuals-uploader').trigger('click');
      });
    return this;
  }


  _handleImageUpload() {
    const $fileInput = $(this);
    const fileName = $fileInput.val().split(/(\\|\/)/g).pop();
    const className = '.' + $fileInput.attr('data-select-class');
    $fileInput.attr('data-src', event.target.result);
    $(className).removeClass('hidden');
    const $groupContainer = $fileInput.closest('.form-group');
    $groupContainer.find('.js-visuals-image-name').html(fileName);
    $groupContainer.find('.js-visuals-image-name-container').removeClass('hidden');
    $groupContainer.find('.js-visuals-select').prop('disabled', true).attr('data-image', true);
    $groupContainer.find('.js-visuals-option').prop('selected', false);
    $groupContainer.find('.js-visuals-selector-none').prop('selected', true);
    $('.js-visuals-select').filter(function() {
      return !$(this).attr('data-image');
    }).removeAttr('disabled');
  }
  
  
  _handleImageRemove($removeButton) {
    const $groupContainer = $removeButton.closest('.form-group');
    const $fileInput = $groupContainer.find('.js-visuals-uploader');
    const className = '.' + $fileInput.attr('data-select-class');
    $fileInput.attr('data-src', '').val('');
    $groupContainer.find('.js-visuals-image-name').empty();
    $groupContainer.find('.js-visuals-image-name-container').addClass('hidden');
    $groupContainer.find('.js-visuals-select').removeAttr('data-image').prop('disabled', false);
    $(className).removeAttr('selected').addClass('hidden');
    return this;
  }


  _handleSelectorChange(event) {
    const $select = $(event.target);
    const $groupContainer = $select.closest('.form-group');
    const $removeButton = $groupContainer.find('.js-visuals-image-remove');
    this._handleImageRemove($removeButton);
    return this;
  }
  
}
