;(function(){
  'use strict';

  function getData() {
    var categories = '';
    $('.js-category-input:checked').each(function() {
      var categoryId = $(this).val();
      categories = categories + categoryId + ',';
    });
    categories = categories.slice(0, -1);

    return {
      'url': $('#js-url-input').val(),
      'title': $('#js-title-input').val(),
      'description': $('#js-description-input').val(),
      'image-url': $('#js-image').attr('src'),
      'category': categories,
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

  $(document).on('submit', '#js-content-form', function(event) {
    event.preventDefault();

    Loader.show();
    Auth.getToken().done(function(token) {
      var data = getData();
      submitData(data, token).done(function() {
        $('#js-submission-success').removeClass('hidden');
        $('#js-submission-error').addClass('hidden');
      }).fail(function(message) {
        $('#js-submission-error').removeClass('hidden');
        $('#js-submission-error-message').html(message);
        $('#js-submission-success').addClass('hidden');
      }).always(function () {
        Loader.hide();
      });
    });
  });
}());