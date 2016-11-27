import $ from 'jquery';
import Mustache from 'mustache';
import AutoSummarization from './AutoSummarization';
import jsonTreeGenerator from './../../Helpers/JsonTreeGenerator';
import template from './General.html';
import { MAXIMUM_CATEGORY_NUMBER } from './Settings';

export default class General {
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
    this._setTree();
    this._setDescription().then(description => {
      $('#js-description-input').val(description).removeClass('textarea-disabled');
      this._setAutoTags();
    });
    return this;
  }

  
  _render() {
    this._tab = $(Mustache.render(template, this._data));
    return this;
  }
  

  _setEvents() {
    $(document)
      .on('change', '#js-image-uploader', this._handleImageUpdate)
      .on('click', '#js-image-container', () => {
        $('#js-image-uploader').trigger('click');
      });
    return this;
  }


  _setTree() {
    const treeGenerator = new jsonTreeGenerator();
    const $categoryContainer = $('#js-categories-container');
    $categoryContainer.jstree(treeGenerator.generate(this._data.categories));
    $categoryContainer.on('changed.jstree', () => this._handleCategorySelection());
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


  _handleImageUpdate() {
    const file = this.files[0];
    const fileReader = new FileReader();
    $('#js-image').attr('data-type', 'base64');
    fileReader.readAsDataURL(file);
    return new Promise((resolve) => {
      fileReader.onload = event => {
        $('#js-image').attr('src', event.target.result).removeClass('hidden');
        $('#js-visuals-default-image').attr('src', event.target.result).removeClass('hidden');
        $('#js-add-image').remove();
        resolve();
      };
    });
  }


  _handleCategorySelection() {
    console.log('HELLO!!!');
    const $categoryContainer = $('#js-categories-container');
    const categoryIds = this._data.categories.map(category => category.id);
    const checkedCategories = $categoryContainer.jstree('get_bottom_checked');
    if (checkedCategories.length >= MAXIMUM_CATEGORY_NUMBER) {
      $categoryContainer.jstree().disable_node(categoryIds);
      $categoryContainer.jstree().enable_node(checkedCategories);
    } else {
      $categoryContainer.jstree().enable_node(categoryIds);
    }
    return this;
  }
}
