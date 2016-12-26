import $ from 'jquery';
import Mustache from 'mustache';
import template from './Visuals.html';
import { uploadImage } from '../../../helpers/FileUploader';
import { isValidImageExtension } from './../../../helpers/InputValidation';


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
      .on('change', '.js-visuals-uploader', event => uploadImage(event.target, self._handleImageUpload.bind(this)))
      .on('click', '.js-visuals-image-remove', event => {
        const $removeButton = $(event.target);
        const $groupContainer = $removeButton.closest('.form-group');
        this._handleImageRemove($groupContainer);
        this._clearImageUrl($groupContainer);
      })
      .on('change', '.js-visuals-select', event => this._handleSelectorChange(event))
      .on('click', '.js-visuals-image-upload-button', event => {
        $(event.target).parent().find('.js-visuals-uploader').trigger('click');
      })
      .on('change', '.js-image-url-input', event => self._handleImageUrlInput(event));
    return this;
  }


  _handleImageUpload(source, $fileInput) {
    const fileName = $fileInput.val().split(/(\\|\/)/g).pop();
    $fileInput.attr('data-src', source);
    const $groupContainer = $fileInput.closest('.form-group');
    $groupContainer.find('.js-visuals-image-name').html(fileName);
    this._handleImageSelectorsStatus($groupContainer);
  }


  _handleImageSelectorsStatus($groupContainer) {
    const $fileInput = $groupContainer.find('.js-visuals-uploader');
    const className = '.' + $fileInput.attr('data-select-class');
    $(className).removeClass('hidden');

    $groupContainer.find('.js-visuals-image-name-container').removeClass('hidden');
    $groupContainer.find('.js-visuals-select').attr('data-image', true);
    const $select = $groupContainer.find('.js-visuals-select');
    const $selectedOption = $select.find('option:selected');

    if (!$selectedOption.hasClass('js-visuals-selector-url')) {
      $groupContainer.find('.js-visuals-option').prop('selected', false);
      $groupContainer.find('.js-visuals-selector-upload').prop('selected', true);
    }
    
    $('.js-visuals-select').filter(function() {
      return !$(this).attr('data-image');
    }).removeAttr('disabled');
  }

  
  _handleImageRemove($groupContainer) {
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
    if ($select.find('option:selected').hasClass('js-visuals-selector-url')) {
      this._handleUseUrlSelection($select);
    } else {
      this._hideUrlInput($select);
    }
    this._handleImageRemove($groupContainer);
    this._clearImageUrl($groupContainer);
    return this;
  }


  _handleUseUrlSelection($select) {
    const $container = $select.closest('.form-group');
    $container.find('.js-visuals-image-upload-button').addClass('hidden');
    $container.find('.js-visuals-url-container').removeClass('hidden');
    return this;
  }


  _hideUrlInput($select) {
    const $container = $select.closest('.form-group');
    $container.find('.js-visuals-image-upload-button').removeClass('hidden');
    $container.find('.js-visuals-url-container').addClass('hidden');
    return this;
  }


  _handleImageUrlInput(event) {
    const self = this;
    const $input = $(event.target);
    const $container = $input.closest('.js-visual-group-container');
    const url = $input.val();

    if (!isValidImageExtension(url)) {
      self._setImageUrlError($container);
      return;
    }

    $('<img>').attr('src', url).on('load', function(event) {
      if (!this.complete || typeof this.naturalWidth == 'undefined' || this.naturalWidth == 0) {
        self._setImageUrlError($container);
        return;
      }

      const canvas = document.createElement('CANVAS');
      const canvContext = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      canvContext.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL();
      $('.js-visuals-uploader', $container).attr('data-src', dataURL);
      self._handleImageSelectorsStatus($container);
      self._setImageUrlSuccess($container);
    }).on('error', () => {
      self._setImageUrlError($container);
      self._handleImageRemove($container)
    });
  }


  _clearImageUrl($container) {
    $('.js-image-url-error', $container).addClass('hidden');
    $('.js-image-url-success', $container).addClass('hidden');
    $('.js-image-url-input', $container).val('').parent().removeClass('has-error').removeClass('has-success');
    $('.js-visuals-uploader', $container).attr('data-src', '').val('');
  };


  _setImageUrlSuccess($container) {
    $('.js-image-url-error', $container).addClass('hidden');
    $('.js-image-url-success', $container).removeClass('hidden');
    $('.js-image-url-input', $container).parent().removeClass('has-error').addClass('has-success');
  }

  
  _setImageUrlError($container) {
    $('.js-image-url-error', $container).removeClass('hidden');
    $('.js-image-url-success', $container).addClass('hidden');
    $('.js-image-url-input', $container).parent().removeClass('has-success').addClass('has-error');
    $('.js-visuals-uploader', $container).attr('data-src', '').val('');
  }
}
