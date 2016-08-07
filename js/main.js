$(function () {
  $(document)
    .on('click', '.js-tab-button', function(event) {
      var $tabButton = $(this);
      $('.js-tab-button').removeClass('active');
      $tabButton.addClass('active');
      event.preventDefault();
    })
    .on('change', '#js-image-uploader', handleImageUpdate)
    .on('click', '#js-image-container', function () {
      $('#js-image-uploader').trigger('click');
    })
    .on('change', '.js-visuals-uploader', handleVisualsImageUpload)
    .on('click', '.js-visuals-image-upload-button', function() {
      $(this).parent().find('.js-visuals-uploader').trigger('click');
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
    })
    .on('change', '.js-category-input', function (event) {
      var $categories = $('.js-category-input');
      var checkedCategoriesNumber = $categories.filter(':checked').length;
      if (checkedCategoriesNumber >= 5) {
        $categories.filter(':not(:checked)').prop('disabled', true);
      } else {
        $categories.prop('disabled', false);
      }
    })
    .on('click', '.js-visuals-image-remove', handleVisualsImageRemove)
    .on('change', '.js-visuals-select', handleVisualsSelectorChange);

  setInterface();
});

var $loginForm = $('#js-login-form');
var $contentForm = $('#js-content-form');
var $tabs = $('#js-tabs');
var $footer = $('#js-footer');
var $main = $('#js-main');

function setInterface() {
  Loader.show();
  Auth.isSignedIn().done(function () {
    requestData().done(function (data) {
      $main.removeClass('is-login-form-shown');
      $tabs.removeClass('hidden');
      $footer.removeClass('hidden');
      $loginForm.addClass('hidden').empty();
      $contentForm.empty();
      setContent('content', data).done(function () {
        setContent('share', data).done(function () {
          setContent('purpose', data).always(function () {
            setContent('visuals', data).always(function () {
              $('#js-purpose-list-container').jstree(generateTreeJSON(data.purposes));
              $('#js-persona-list-container').jstree(generateTreeJSON(data.personas));
              Loader.hide();
            });
          });
        });
      });
    });
  }).fail(function () {
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

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { dataRequired: true, dataType: dataType }, function (response) {
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

  $('#js-image').attr('data-type', 'base64');

  fileReader.onload = function (event) {
    $('#js-image').attr('src', event.target.result).removeClass('hidden');
    $('#js-visuals-default-image').attr('src', event.target.result).removeClass('hidden');
    $('#js-add-image').remove();
    dfd.resolve();
  };
  fileReader.readAsDataURL(file);

  return dfd.promise();
}

function handleVisualsImageUpload() {
  var dfd = $.Deferred();
  var file = this.files[0];
  var $fileInput = $(this);
  var fileReader = new FileReader();

  fileReader.onload = function (event) {
    var fileName = $fileInput.val().split(/(\\|\/)/g).pop();
    var className = '.' + $fileInput.attr('data-select-class');

    $fileInput.attr('data-src', event.target.result);
    $('.js-visuals-select').removeAttr('disabled');
    $(className).removeClass('hidden');
    var $groupContainer = $fileInput.closest('.form-group');
    $groupContainer.find('.js-visuals-image-name').html(fileName);
    $groupContainer.find('.js-visuals-image-name-container').removeClass('hidden');
    
    dfd.resolve();
  };

  fileReader.readAsDataURL(file);
}

function handleVisualsImageRemove() {
  var $removeButton = $(this);
  var $groupContainer = $removeButton.closest('.form-group');
  var $fileInput = $groupContainer.find('.js-visuals-uploader');
  var className = '.' + $fileInput.attr('data-select-class');
  $fileInput.attr('data-src', '').val('');
  $groupContainer.find('.js-visuals-image-name').empty();
  $groupContainer.find('.js-visuals-image-name-container').addClass('hidden');
  $(className).removeAttr('selected').addClass('hidden');
}

function handleVisualsSelectorChange() {
  var $select = $(this);
  var $groupContainer = $select.closest('.form-group');
  var $removeButton = $groupContainer.find('.js-visuals-image-remove');
  handleVisualsImageRemove.call($removeButton.get(0));
}
