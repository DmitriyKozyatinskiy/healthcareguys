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
      $loginFailedMessage.addClass('hidden');

      event.preventDefault();
      Loader.show();
      Auth.signIn().done(function () {
        setInterface();
      }).fail(function () {
        $loginFailedMessage.removeClass('hidden');
      }).always(function () {
        Loader.hide();
      });
    })
    .on('click', '#js-logout-button', function () {
      Auth.showSignInForm().always(function () {
        var $loginButton = $('#js-sign-in-button');

        $loginButton.prop('disabled', true);
        Auth.signOut().done(function() {
          $loginButton.prop('disabled', false);
        });
      });
    })
    .on('change', '.js-category-input', function () {
      var $categories = $('.js-category-input');
      var checkedCategoriesNumber = $categories.filter(':checked').length;
      if (checkedCategoriesNumber >= 5) {
        $categories.filter(':not(:checked)').prop('disabled', true);
      } else {
        $categories.prop('disabled', false);
      }
    })
    .on('click', '.js-visuals-image-remove', handleVisualsImageRemove)
    .on('change', '.js-visuals-select', handleVisualsSelectorChange)
    .on('click', '.js-list-toggler', function () {
      var $button = $(this);
      var $container = $(this).closest('.js-expandable-container');
      $('.submission-notification').addClass('hidden');
      if ($container.hasClass('pull-down-expanded')) {
        $container.removeClass('pull-down-expanded').find('.list-container').addClass('list-cat-height');
        $button.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
      } else {
        $container.addClass('pull-down-expanded').find('.list-container').removeClass('list-cat-height');
        $button.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
      }
    });

  setInterface();
});

var $loginForm = $('#js-login-form');
var $contentForm = $('#js-content-form');
var $tabs = $('#js-tabs');
var $footer = $('#js-footer');
var $main = $('#js-main');

function setInterface() {
  // Loader.show();
  requestData().done(function(data) {
    requestTaxonomyList().done(function(list) {
      data = extendData(data, list);
      Auth.getToken().done(function(startToken) {
        $contentForm.empty();
        if (startToken) {
          setContent('content', data).done(function() {
            var $submitButton = $('.js-submit-button');
            $loginForm.addClass('hidden').empty();
            $main.removeClass('is-login-form-shown');
            $tabs.removeClass('hidden').addClass('no-events');
            $footer.removeClass('hidden');
            $loginForm.addClass('hidden').empty();
            $submitButton.prop('disabled', true);
            Auth.isSignedIn().done(function (username) {
              setContent('share', data).done(function () {
                setContent('purpose', data).always(function () {
                  setContent('visuals', data).always(function () {
                    setContent('feedback', data).always(function () {
                      setContent('links', data).always(function () {
                        $tabs.removeClass('no-events');
                        $submitButton.prop('disabled', false);
                        $('#js-purpose-list-container').jstree(generateTreeJSON(data.purposes));
                        $('#js-persona-list-container').jstree(generateTreeJSON(data.personas));
                        $('.list-container p').remove();
                        $('.js-name-label').html('as ' + username);
                      });
                    });
                  });
                });
              });
            }).fail(function() {
              Auth.showSignInForm();
            });
          });
        } else {
          Auth.showSignInForm();
        }
      });
    });
  });
}

function extendData(data, list) {
  data.categories = list.data.submit_cat;
  data.tags = list.data.hashtag;
  data.purposes = list.data.purpose;
  data.personas = list.data.persona;
  return data;
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

function requestTaxonomyList() {
  var dfd = $.Deferred();
  chrome.runtime.sendMessage({ requestTaxonomyList: true }, function(list) {
    dfd.resolve(list);
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
        dfd.reject();
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
    $(className).removeClass('hidden');
    var $groupContainer = $fileInput.closest('.form-group');
    $groupContainer.find('.js-visuals-image-name').html(fileName);
    $groupContainer.find('.js-visuals-image-name-container').removeClass('hidden');
    $groupContainer.find('.js-visuals-select').prop('disabled', true).attr('data-image', true);
    $groupContainer.find('.js-visuals-option').prop('selected', false);
    $groupContainer.find('.js-visuals-selector-none').prop('selected', true);
    $('.js-visuals-select').filter(function() {
      return !$(this).attr('data-image');
    }).removeAttr('disabled');

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
  $groupContainer.find('.js-visuals-select').removeAttr('data-image').prop('disabled', false);
  $(className).removeAttr('selected').addClass('hidden');
}

function handleVisualsSelectorChange() {
  var $select = $(this);
  var $groupContainer = $select.closest('.form-group');
  var $removeButton = $groupContainer.find('.js-visuals-image-remove');
  handleVisualsImageRemove.call($removeButton.get(0));
}
