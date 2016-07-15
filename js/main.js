$(function() {
  $(document).on('click', '.js-navigation-button', function() {
    var $button = $(this);
    var dataType = $button.attr('href').substr(1);
  })
    .on('change', '#js-image-uploader', handleImageUpdate)
    .on('click', '#js-image-container', function() {
      $('#js-image-uploader').trigger('click');
    })
    .on('submit', '#js-login-form', function (event) {
      var $loginFailedMessage = $('#js-wrong-credentials');

      event.preventDefault();
      Loader.show();
      Auth.signIn().done(function () {
        requestData().done(function(data) {
          setContent('content', data);
        }).fail(function () {
          setContent('no-data-found');
        }).always(function () {
          Loader.hide();
        });
      }).fail(function () {
        $loginFailedMessage.removeClass('hidden');
        Loader.hide();
      });
    })
    .on('click', '#js-logout-button', function () {
      Loader.show();
      Auth.signOut().done(function () {
        Auth.showSignInForm();
        Loader.hide();
      });
    });


  Loader.show();
  Auth.isSignedIn().done(function () {
    requestData().done(function(data) {
      setContent('content', data);
    }).fail(function () {
      setContent('no-data-found');
    }).always(function () {
      Loader.hide();
    });
  }).fail(function () {
    Auth.showSignInForm().always(function () {
      Loader.hide();
    });
  });
});

var $dataContainer = $('#js-main');

function setContent(dataType, data) {
  var dfd = $.Deferred();

  $.get('../html/' + dataType + '.html', function(html) {
    var renderedTemplate = Mustache.render(html, data);
    $dataContainer.html(renderedTemplate);

    dfd.resolve();
  });

  return dfd.promise();
}

function requestData() {
  var dfd = $.Deferred();

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {dataRequired: true}, function(response) {
      if (response) {
        dfd.resolve(response);
      } else {
        dfd.reject(response);
      }
    });
  });

  return dfd.promise();
}

function handleImageUpdate() {
  var dfd = $.Deferred();
  var file = this.files[0];
  var fileReader = new FileReader();

  fileReader.onload = function(event) {
    $('#js-image').attr('src', event.target.result).removeClass('hidden');
    $('#js-add-image').remove();
    dfd.resolve();
  };
  fileReader.readAsDataURL(file);

  return dfd.promise();
}



