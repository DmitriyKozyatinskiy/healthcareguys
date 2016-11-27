import $ from 'jquery';
import Mustache from 'mustache';
import template from './Feedback.html';
import Loader from './../../Loader/Loader';
import { config } from './../../config';


export default class Feedback {
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
    $(document).on('click', '#js-feedback', () => {
      this._submit();
    });
    return this;
  }


  _submit() {
    const data = this._getData();
    const $submissionError = $('.js-feedback-submission-error');
    const $submissionSuccess = $('.js-feedback-submission-success');
    const errorList = this._validate(data);

    $submissionError.addClass('hidden');
    $submissionSuccess.addClass('hidden');
    if (errorList.length) {
      const errorIcon = ' <span class="glyphicon glyphicon glyphicon-remove text-danger"></span> ';
      const errorMessage = errorList.join(errorIcon).trim();
      $submissionError.removeClass('hidden').find('.js-submission-error-message').html(errorMessage);
    } else {
      Loader.show();
      $(document).trigger('submit-feedback:telemetry', [ data, () => {
        Loader.hide();
        $submissionSuccess.removeClass('hidden');
      } ]);
    }
    return this;
  }


  _getData() {
    return {
      apiKey: config.appKey,
      releaseStage: config.releaseStage,
      feedbackUser: config.userDetails.name,
      feedbackUserEmail: config.userDetails.email,
      feedbackType: $('#js-fed-support-type').val(),
      feedbackSubject: $('#js-fed-subject').val().trim(),
      feedbackDesc: $('#js-fed-description').val().trim(),
      feedbackAttachment: '',
      supportTimeStamp: '',
      userAgent: '',
      feedbackData: {
        REQUEST_METHOD: 'POST',
        CONTENT_TYPE: 'application/json',
        HTTP_USER_AGENT: '',
        HTTP_REFERER: ''
      }
    };
  }


  _validate(data) {
    const errors = [];
    const isValidSubject = data.feedbackSubject.match('^[a-zA-Z ]{3,50}$');
    if (!data.feedbackType) {
      errors.push('Select the support type');
    }
    if (!isValidSubject) {
      errors.push('Enter a valid subject');
    }
    if (!data.feedbackDesc) {
      errors.push('Description cannot be blank');
    }
    return errors;
  }
}
