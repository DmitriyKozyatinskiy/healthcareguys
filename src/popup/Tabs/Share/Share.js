import $ from 'jquery';
window.$ = $;
window.jQuery = $;
window.jquery = $;
import 'jstree';
import Mustache from 'mustache';
import template from './Share.html';
import jsonTreeGenerator from './../../Helpers/JsonTreeGenerator';


export default class Share {
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
  }


  _render() {
    this._tab = $(Mustache.render(template, this._data));
    this._container.append(this._tab);
    return this;
  }


  _setEvents() {
    return this;
  }


  _setTree() {
    const treeGenerator = new jsonTreeGenerator();
    $('#js-tags-list-container').jstree(treeGenerator.generate(this._data.tags));
    return this;
  }
}
