;(function(){
  'use strict';

  var noTitleErrorMessage = 'Title should not be empty';
  var noCategoryErrorMessage = 'Select at least one category';

  function getContentData() {
    var categories = [];
    $('.js-category-input:checked').each(function() {
      var categoryId = $(this).val();
      categories.push(categoryId);
    });
    var tags = [];
    $('.js-tag-input:checked').each(function() {
      var tagId = $(this).val();
      tags.push(tagId);
    });

    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'image-url': $('#js-image').attr('src'),
      'tweet-content': $('#js-tweet-content').val(),
      'share-content': $('#js-share-content').val(),
      'category': categories,
      'hashtag': tags,
      'purpose': $('#js-purpose-list-container').jstree('get_bottom_checked'),
      'personas': $('#js-persona-list-container').jstree('get_bottom_checked'),
      'post-type': 'wpri_submit'
    }
  }

  function submitData(data, token) {
    var dfd = $.Deferred();

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/post',
      method: 'POST',
      data: JSON.stringify({
        data: data,
        token: token
      }),
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function(response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        dfd.resolve();
      } else {
        dfd.reject(JSON.parse(response).message);
      }
    }).fail(function() {
      dfd.reject('Unknown error');
    });

    return dfd.promise();
  }

  function handleDataSubmissionProcess() {
    var data = getContentData();
    console.log(data);
    var errorMessage = '';

    if (!data.title && !data.category.length) {
      errorMessage = noTitleErrorMessage + '; ' + noCategoryErrorMessage;
    } else if (!data.title) {
      errorMessage = noTitleErrorMessage;
    } else if (!data.category.length) {
      errorMessage = noCategoryErrorMessage;
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
      $('#js-submission-success').removeClass('hidden');
      $('#js-submission-error').addClass('hidden');
    } else {
      $('#js-submission-error').removeClass('hidden');
      $('#js-submission-error-message').html(message);
      $('#js-submission-success').addClass('hidden');
    }
  }

  $(document).on('submit', '#js-content-form', function(event) {
    event.preventDefault();
    handleDataSubmissionProcess();
  });
}());