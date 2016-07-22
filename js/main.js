$(function () {
  $(document)
    .on('change', '#js-image-uploader', handleImageUpdate)
    .on('click', '#js-image-container', function () {
      $('#js-image-uploader').trigger('click');
    })
    .on('submit', '#js-login-form', function (event) {
      var $loginFailedMessage = $('#js-wrong-credentials');
      event.preventDefault();
      Loader.show();
      Auth.signIn().done(function () {
        setInterface();
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

  setInterface();
});

var $loginForm = $('#js-login-form');
var $contentForm = $('#js-content-form');
var $tabs = $('#js-tabs');

function setInterface() {
  Loader.show();
  Auth.isSignedIn().done(function () {
    requestData().done(function (data) {
      $tabs.removeClass('hidden');
      $loginForm.empty();
      $contentForm.empty();
      setContent('content', data).done(function () {
        setContent('share', data).done(function () {
          setContent('purpose', data).always(function () {
            $('#js-purpose-list-container').jstree(generateTreeJSON(data.purposes));
            $('#js-persona-list-container').jstree(generateTreeJSON(data.personas));
            Loader.hide();
          });
        });
      });
    });
  }).fail(function () {
    $tabs.addClass('hidden');
    Auth.showSignInForm().always(function () {
      Loader.hide();
    });
  });
}

function setContent(dataType, data) {
  var dfd = $.Deferred();

  $.get('../html/' + dataType + '.html', function (html) {
    var renderedTemplate = Mustache.render(html, data);
    $contentForm.append($(renderedTemplate));

    dfd.resolve();
  });

  return dfd.promise();
}

function requestData(dataType) {
  var dfd = $.Deferred();

  chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {dataRequired: true, dataType: dataType}, function (response) {
      if (response) {
        dfd.resolve(response);
      } else {
        dfd.reject(response);
      }
    });
  });

  return dfd.promise();
}

function generateTreeJSON(data) {
  var treeData = {
    core: {
      data: [],
      themes: {
        icons: false
      }
    },
    'plugins': [ 'checkbox' ]
  };

  data.forEach(function(item) {
    var treeItem = {
      id: item.id,
      parent: item.parent || '#',
      text: item.name,
      state: {
        opened: true
      }
    };
    treeData.core.data.push(treeItem);
  });

  return treeData;
}

function handleImageUpdate() {
  var dfd = $.Deferred();
  var file = this.files[0];
  var fileReader = new FileReader();

  fileReader.onload = function (event) {
    $('#js-image').attr('src', event.target.result).removeClass('hidden');
    $('#js-add-image').remove();
    dfd.resolve();
  };
  fileReader.readAsDataURL(file);

  return dfd.promise();
}



