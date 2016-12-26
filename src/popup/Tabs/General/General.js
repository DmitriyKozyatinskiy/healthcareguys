import $ from 'jquery';
import Mustache from 'mustache';
import AutoSummarization from './AutoSummarization';
import { uploadImage } from '../../../helpers/FileUploader';
import { generateJSONTree } from './../../../helpers/JsonTreeGenerator';
import { isValidImageExtension } from './../../../helpers/InputValidation';
import template from './General.html';
import { MAXIMUM_CATEGORY_NUMBER } from './Settings';
import ImageScroller from './../../ImageScroller/ImageScroller';

export default class General {
  constructor(container) {
    this._tab = null;
    this._container = container;
    this._setEvents();
    this.imageScroller = new ImageScroller();
  }


  get tab() {
    return this._tab;
  }
  
  
  show(data) {
    this._data = data;
    this._render();
    this._container.append(this._tab);
    this._setTree();
    this._setDescription().then(description => {
      $('#js-description-input').val(description).removeClass('textarea-disabled');
      this._setAutoTags();
    });

    if (!data.image) {
      this.imageScroller.getNewImage().then(source => {
        this._handleImageUpdate(source);
        this._clearImageUrl();
      });
    }

    this.imageScroller.setEvents();
    $('#js-categories-container').on('changed.jstree', () => this._handleCategorySelection());

    return this;
  }

  
  _render() {
    this._tab = $(Mustache.render(template, this._data));
    return this;
  }
  

  _setEvents() {
    const self = this;

    $(document)
      .on('change', '#js-image-uploader', event => uploadImage(event.target, source => {
        self._handleImageUpdate(source);
        self._clearImageUrl();
      }))
      .on('click', '#js-image-container', event => $('#js-image-uploader').trigger('click'))
      .on('change', '#js-image-url-input', event => this._handleImageUrlUpdate(event))
      .on('change', '#js-title-input', event => this._handleTitleChange());

    return this;
  }


  _setTree() {
    $('#js-categories-container').jstree(generateJSONTree(this._data.categories));
    return this;
  }


  _setDescription() {
    return new Promise(resolve => {
      if (this._data.description) {
        resolve(this._data.description);
      } else {
        AutoSummarization.generateSummary(this._data.pageUrl).then(description => {
          this._data.description = description;
          resolve(description);
        });
      }
    });
  }


  _setAutoTags() {
    return new Promise(resolve => {
      const text = this._data.description || this._data.title;
      AutoSummarization.generateTags(text).then(tags => {
        const $tagContainer = $('#js-auto-tags-container');
        tags.forEach(tag => {
          const $tag = $('<span>', {
            'html': tag,
            'class': 'label label-info auto-tag'
          });
          $tagContainer.append($tag);
        });
        resolve(tags);
      });
    });
  }


  _handleImageUpdate(source) {
    const $image = $('#js-image');
    $image.attr({
      'data-type': 'base64',
      'src': source
    }).removeClass('hidden');
    $('#js-visuals-default-image').attr('src', source).removeClass('hidden');
    $('#js-add-image').remove();
  }


  _handleCategorySelection() {
    const $categoriesError = $('.js-categories-error-message');
    const $errorContainer = $categoriesError.closest('.js-submission-error');
    $categoriesError.remove();
    if (!$errorContainer.text().trim()) {
      $errorContainer.addClass('hidden');
    }
    const $categoryContainer = $('#js-categories-container');
    const categoryIds = this._data.categories.map(category => category.id);
    const checkedCategories = $categoryContainer.jstree('get_bottom_checked');
    if (checkedCategories.length >= MAXIMUM_CATEGORY_NUMBER) {
      $categoryContainer.jstree().disable_node(categoryIds);
      $categoryContainer.jstree().enable_node(checkedCategories);
    } else {
      $categoryContainer.jstree().enable_node(categoryIds);
    }
  }


  _handleTitleChange() {
    const $titleError = $('.js-title-error-message');
    const $errorContainer = $titleError.closest('.js-submission-error');
    $titleError.remove();
    if (!$errorContainer.text().trim()) {
      $errorContainer.addClass('hidden');
    }
  }


  _handleImageUrlUpdate(event) {
    const self = this;
    const $input = $(event.target);
    const url = $input.val();

    if (!isValidImageExtension(url)) {
      self._setImageUrlError();
      return;
    }
    
    $('<img>').attr('src', url).on('load', function(event) {
      if (!this.complete || typeof this.naturalWidth == 'undefined' || this.naturalWidth == 0) {
        self._setImageUrlError();
        return;
      }

      const canvas = document.createElement('CANVAS');
      const canvContext = canvas.getContext('2d');
      canvas.height = this.height;
      canvas.width = this.width;
      canvContext.drawImage(this, 0, 0);
      const dataURL = canvas.toDataURL();
      self._handleImageUpdate(dataURL);
      self._setImageUrlSuccess();
      self._clearImageUrl();
    }).on('error', () => {
      this._setImageUrlError();
    });
  }


  _setImageUrlSuccess() {
    $('#js-image-url-error').addClass('hidden');
    $('#js-image-url-success').removeClass('hidden');
    $('#js-image-url-input').parent().removeClass('has-error').addClass('has-success');
    $('.js-image-tab-button').trigger('click');
    return this;
  }
  
  
  _setImageUrlError() {
    $('#js-image-url-error').removeClass('hidden');
    $('#js-image-url-success').addClass('hidden');
    $('#js-image-url-input').parent().removeClass('has-success').addClass('has-error');
    return this;
  }


  _clearImageUrl() {
    $('#js-image-url-error').addClass('hidden');
    $('#js-image-url-success').addClass('hidden');
    $('#js-image-url-input').val('').parent().removeClass('has-success').removeClass('has-error');
  }
}
