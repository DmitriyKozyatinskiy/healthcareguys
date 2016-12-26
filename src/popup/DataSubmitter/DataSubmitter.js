import $ from 'jquery';
import Auth from './../Auth/Auth';
import Loader from './../Loader/Loader';
import LinksSaver from './../AutoSavers/LinksSaver';
import { config } from './../config';

const MAX_CATEGORIES_NUMBER = 5;
const NO_TITLE_ERROR_MESSAGE = 'Title should not be empty';
const CATEGORIES_ERROR_MESSAGE = 'You must select from 1 to 5 categories';

export default class DataSubmitter {
  constructor() {
    this._setEvents();
  }


  _setEvents() {
    $(document)
      .on('submit', '#js-content-form', event => this._handleDataSubmissionProcess(event));
    return this;
  }

  // <span class="js-categories-error-message">
  
  
  _getContentData() {
    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'image-url': $('#js-image').attr('src'),
      'category': $('#js-categories-container').jstree('get_bottom_checked'),
      'tweet-content': $('#js-tweet-content').val(),
      'share-content': $('#js-share-content').val(),
      'hashtag': $('#js-tags-list-container').jstree('get_bottom_checked'),
      'purpose': $('#js-purpose-list-container').jstree('get_bottom_checked'),
      'personas': $('#js-persona-list-container').jstree('get_bottom_checked'),
      'thumb-image': $('#js-visuals-thumbnail-uploader').attr('data-src') || '',
      'set-thumb-image': $('#js-thumbnail-select').val() || '',
      'web-image': $('#js-visuals-web-uploader').attr('data-src') || '',
      'set-web-image': $('#js-web-select').val() || '',
      'share-image': $('#js-visuals-share-uploader').attr('data-src') || '',
      'set-share-image': $('#js-share-select').val() || '',
      'tweet-image': $('#js-visuals-tweet-uploader').attr('data-src') || '',
      'set-tweet-image': $('#js-tweet-select').val() || '',
      'post-type': 'wpri_submit'
    };
  }


  _submitData(data, token) {
    $(document).trigger('submit-data:telemetry', [ data ]);

    return new Promise((resolve, reject) => {
      $.ajax({
        url: config.restUrl + '/wp-json/api/wp/v2/post',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          data: data,
          token: token
        }),
        xhrFields: {
          withCredentials: true
        }
      }).done(response => {
        response = JSON.parse(response);
        if (response.status === 'success') {
          resolve(response);
        } else {
          reject(response);
        }
      }).fail(() => {
        reject('Unknown error');
      });
    });
  }


  _handleDataSubmissionProcess(event) {
    event.preventDefault();

    const errorMessage = { message: '' };
    const data = this._getContentData();

    $('.js-submission-error').addClass('hidden');
    $('.js-submission-success').addClass('hidden');

    if (!data.title && (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER)) {
      errorMessage.message = NO_TITLE_ERROR_MESSAGE + '; ' + '<span class="js-categories-error-message">' + CATEGORIES_ERROR_MESSAGE + '</span>';
    } else if (!data.title) {
      errorMessage.message = NO_TITLE_ERROR_MESSAGE;
    } else if (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER) {
      errorMessage.message = '<span class="js-categories-error-message">' + CATEGORIES_ERROR_MESSAGE + '</span>';
    }

    if (errorMessage.message) {
      this._showSubmissionStatus('error', errorMessage);
      return;
    }

    Loader.show();
    Auth.getToken().then(token => {
      this._submitData(data, token).then(response => {
        this._showSubmissionStatus('success', response);
        LinksSaver.storeLinks(response.results);
        $('#js-links-tab-button').trigger('click');
      }, response => {
        this._showSubmissionStatus('error', response);
      }).then(() => {
        Loader.hide();
      });
    });
  }


  _showSubmissionStatus(status, response) {
    const message = response.message;
    if (status == 'success') {
      $('.js-submission-success').removeClass('hidden');
      if (message) {
        $('#js-clean-link').val(response.results.cleanURL);
        $('#js-short-link').val(response.results.shortBadgedURL);
        $('#js-badged-link').val(response.results.badgedURL);
        $('#js-canonical-link').val(response.results.shortCanonicalURL);
      }
      $('.js-submission-error').addClass('hidden');
    } else {
      $('.js-submission-error').removeClass('hidden');
      $('.js-submission-error-message').html(message);
      $('.js-submission-success').addClass('hidden');
    }
  }
}

