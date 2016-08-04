;(function(){
  'use strict';

  var MAX_CATEGORIES_NUMBER = 5;
  var noTitleErrorMessage = 'Title should not be empty';
  var categoriesErrorMessage = 'You must select from 1 to 5 categories';

  function getContentData() {
    var categories = [];
    $('.js-category-input:checked').each(function() {
      var categoryId = $(this).val();
      categories.push(categoryId);
    });

    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'image-url': $('#js-image').attr('src'),
      'category': categories,
      'post-type': 'wpri_submit'
    };
  }

  function submitData(data, token) {
    var dfd = $.Deferred();

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/post',
      method: 'POST',
      contentType : 'application/json',
      data:JSON.stringify({
        data: data,
        token: token
      }),
      xhrFields: {
        withCredentials: true
      }
    }).done(function(response) {
      response = JSON.parse(response);
      
      if (response.status === 'success') {
        dfd.resolve(response.message);
      } else {
        dfd.reject(response.message);
      }
    }).fail(function() {
      dfd.reject('Unknown error');
    });

    return dfd.promise();
  }

  function handleDataSubmissionProcess() {
    var errorMessage = '';
    var data = getContentData();

    if (!data.title && (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER)) {
      errorMessage = noTitleErrorMessage + '; ' + categoriesErrorMessage;
    } else if (!data.title) {
      errorMessage = noTitleErrorMessage;
    } else if (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER) {
      errorMessage = categoriesErrorMessage;
    }

    if (errorMessage) {
      showSubmissionStatus('error', errorMessage);
      return;
    }

    Loader.show();
    Auth.getToken().done(function(token) {
      submitData(data, token).done(function() {
        showSubmissionStatus('success');
      }).fail(function(message) {
        showSubmissionStatus('error', message);
      }).always(function () {
        Loader.hide();
      });
    });
  }

  function showSubmissionStatus(status, message) {
    if (status == 'success') {
      $('.js-submission-success').removeClass('hidden');
      $('.js-submission-error').addClass('hidden');
    } else {
      $('.js-submission-error').removeClass('hidden');
      $('.js-submission-error-message').html(message);
      $('.js-submission-success').addClass('hidden');
    }
  }

  $(document).on('submit', '#js-content-form', function(event) {
    event.preventDefault();
    handleDataSubmissionProcess();
  });
}());