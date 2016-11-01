;(function () {
  'use strict';

  var MAX_CATEGORIES_NUMBER = 5;
  var NO_TITLE_ERROR_MESSAGE = 'Title should not be empty';
  var CATEGORIES_ERROR_MESSAGE = 'You must select from 1 to 5 categories';

  function getContentData() {
    var categories = [];
    $('.js-category-input:checked').each(function () {
      var categoryId = $(this).val();
      categories.push(categoryId);
    });

    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'image-url': $('#js-image').attr('src'),
      'category': categories,
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

  function submitData(data, token) {
    var dfd = $.Deferred();
    $.ajax({
      url: window.config.restUrl + '/wp-json/api/wp/v2/post',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        data: data,
        token: token
      }),
      xhrFields: {
        withCredentials: true
      }
    }).done(function(response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        dfd.resolve(response);
        //dfd.resolve(response.message);
      } else {
        dfd.reject(response);
      }
    }).fail(function () {
      dfd.reject('Unknown error');
    });
   var teleCustomData={};
    teleCustomData.customData = data;
    window.config.telemetryAgent.pageData.Event('Post Submission','Post', 'Post Submission',1,teleCustomData);
    return dfd.promise();
  }

  function handleDataSubmissionProcess() {
    var errorMessage = { message: '' };
    var data = getContentData();

    $('.js-submission-error').addClass('hidden');
    $('.js-submission-success').addClass('hidden');

    if (!data.title && (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER)) {
      errorMessage.message = NO_TITLE_ERROR_MESSAGE + '; ' + CATEGORIES_ERROR_MESSAGE;
    } else if (!data.title) {
      errorMessage.message = NO_TITLE_ERROR_MESSAGE;
    } else if (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER) {
      errorMessage.message = CATEGORIES_ERROR_MESSAGE;
    }

    if (errorMessage.message) {
      showSubmissionStatus('error', errorMessage);
      return;
    }

    Loader.show();
    Auth.getToken().always(function (token) {
      submitData(data, token).done(function (response) {
        showSubmissionStatus('success', response);
        AutoSaver.storeShortLinks(response.results);
        $('#js-links-tab-button').trigger('click');
      }).fail(function (response) {
        showSubmissionStatus('error', response);
      }).always(function () {
        Loader.hide();
      });
    });
  }

  function showSubmissionStatus(status, response) {
    var message = response.message;
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

  function getFeedbackData() {
    return {
  	  apiKey:window.config.appKey,
  	  releaseStage:window.config.releaseStage,
      feedbackUser: window.config.userDetails.name,
      feedbackUserEmail: window.config.userDetails.email,
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

  function validateFeedback(data) {
    var errors = [];
    var isValidSubject = data.feedbackSubject.match('^[a-zA-Z ]{3,50}$');
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

  $(document).on('submit', '#js-content-form', function (event) {
    event.preventDefault();
    handleDataSubmissionProcess();
  }).on('click', '#js-feedback', function () {
    var data = getFeedbackData();
    var $submissionError = $('.js-feedback-submission-error');
    var $submissionSuccess = $('.js-feedback-submission-success');
    var errorList = validateFeedback(data);

    $submissionError.addClass('hidden');
    $submissionSuccess.addClass('hidden');
    if (errorList.length) {
      var errorIcon = ' <span class="glyphicon glyphicon glyphicon-remove text-danger"></span> ';
      var errorMessage = errorList.join(errorIcon).trim();
      $submissionError.removeClass('hidden').find('.js-submission-error-message').html(errorMessage);
    } else {
      Loader.show();
      window.config.telemetryAgent.supportWidget.widgetApiPost(data, function() {
        Loader.hide();
        $submissionSuccess.removeClass('hidden');
      });
    }
  });
}());


