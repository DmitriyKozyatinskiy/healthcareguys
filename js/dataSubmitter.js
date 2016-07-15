;(function(){
  'use strict';

  function getData() {
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
    }
  }

  function submitData(data, token) {
    var dfd = $.Deferred();

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/addpost/v1/addpost',
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
      if (response.status === 'success') {
        dfd.resolve();
      } else {
        dfd.reject();
      }
    }).fail(function() {
      dfd.reject();
    });

    return dfd.promise();
  }

  $(document).on('submit', '#js-content-form', function(event) {
    event.preventDefault();

    Loader.show();
    Auth.getToken().done(function(token) {
      var data = getData();
      submitData(data, token).done(function() {
        Status.showSuccess();
      }).fail(function() {
        Status.showError();
      }).always(function () {
        Loader.hide();
      });
    });
  });
}());