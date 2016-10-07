function checkCurrentUrl() {
  var dfd = $.Deferred();
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {validateCurrentUrl: true}, function(isValid) {
      if (isValid) {
        dfd.resolve(tabs[0].id);
      } else {
        dfd.reject(tabs[0].id);
      }
    });
  });
  return dfd.promise();
}

$(function () {
  checkCurrentUrl().done(function(tabId) {
  config = {
    appVersion: '2.0.4',
    appKey :'25447ae7-a97c-325e-bc52-e75814b61b07',
    restUrl: 'https://news-devl.healthcareguys.com',
    telemetryAgent:'',
    userDetails :{
                'name': '',
                'email': '',
                'account': 'Browser Extension',
                'appVersion':'',
                'role': 'admin'
    },
    releaseStage : 'Development'
};
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
      .on('click', '#js-registration-form-button', function (event) {
        event.preventDefault();
        Auth.showRegistrationForm();
      })
      .on('click', '#js-login-form-button', function (event) {
        event.preventDefault();
        Auth.showSignInForm();
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
        var $icon = $button.find('.js-list-icon');
        var $container = $button.closest('.js-expandable-container');
        $('.submission-notification').addClass('hidden');
        if ($container.hasClass('pull-down-expanded')) {
          $container.removeClass('pull-down-expanded').find('.list-container').addClass('list-cat-height');
          $icon.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
        } else {
          $container.addClass('pull-down-expanded').find('.list-container').removeClass('list-cat-height');
          $icon.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
        }
      })
      .on('click', '.js-feedback-link', function (event) {
        event.preventDefault();
        $('#js-feedback-tab-button').trigger('click');
	 }).on('click', '.lcopy', function(event){
        var fieldname = $(this).attr('data-copy');   
        var field = document.getElementById(fieldname);
        if(field.value.length > 7 ) {
          $('.l-fade').hide();
          $(this).parent().find('.l-fade').show();  
          field.focus();
          field.setSelectionRange(0, field.value.length)
          var copysuccess = copySelectionText(); 
          setTimeout(function(){  
	  	$('.l-fade').hide(); }, 500);
       	}
      });

    setInterface();
  }).fail(function() {
    window.close();
  });
});

var $loginForm = $('#js-login-form');
var $contentForm = $('#js-content-form');
var $tabs = $('#js-tabs');
var $footer = $('#js-footer');
var $main = $('#js-main');
function copySelectionText(){
    var copysuccess // var to check whether execCommand successfully executed
    try{
        copysuccess = document.execCommand("copy") // run command to copy selected text to clipboard
    } catch(e){
        copysuccess = false
    }
    return copysuccess
}
function setInterface() {
  // Loader.show();
  $.when(requestData(), requestTaxonomyList()).done(function(data, list) {
    data = extendData(data, list);
    Auth.getToken().done(function(startToken) {
      $contentForm.empty();
      setContent('content', data).done(function() {
        var $submitButton = $('.js-submit-button');
        $loginForm.addClass('hidden').empty();
        $main.removeClass('is-login-form-shown');
        $tabs.removeClass('hidden').addClass('no-events');
        $footer.removeClass('hidden');
        $loginForm.addClass('hidden').empty();
        $submitButton.prop('disabled', true);
        Auth.isSignedIn().done(function (username) {
          $.when.apply($, setAdditionalTabsContent(data)).done(function() {
            $tabs.removeClass('no-events');
            $submitButton.prop('disabled', false);
            $('#js-tags-list-container').jstree(generateTreeJSON(data.tags));
            $('#js-purpose-list-container').jstree(generateTreeJSON(data.purposes));
            $('#js-persona-list-container').jstree(generateTreeJSON(data.personas));
            $('.list-container p').remove();
            $('.js-name-label').html('as ' + username);
            setTooltips();
          });

          $.when(getDescription(data)).done(function(description) {
            data.description = description;
            $('#js-description-input').val(description).removeClass('textarea-disabled');
            setAutoTags(data);
          });
        }).fail(function() {
          Auth.showSignInForm();
        });
      });
    }).fail(function() {
      Auth.showSignInForm();
    });
  });
}

function setAdditionalTabsContent(data) {
  var deferres  = [];
  deferres.push(setContent('share', data));
  deferres.push(setContent('purpose', data));
  deferres.push(setContent('visuals', data));
  deferres.push(setContent('links', data));
  deferres.push(setContent('feedback', data));
  return deferres;
}

function setAutoTags(data) {
  var dfd = $.Deferred();
  var text = data.description || data.title;
  AutoSummarization.generateTags(text).done(function(tags) {
    var $tagContainer = $('#js-auto-tags-container');
    tags.forEach(function(tag) {
      var $tag = $('<span>', {
        'html': tag,
        'class': 'label label-info auto-tag'
      });
      $tagContainer.append($tag);
    });
    dfd.resolve(tags);
  });
  return dfd.promise();
}

function getDescription(data) {
  var dfd = $.Deferred();
  if (data.description) {
    window.setTimeout(function() {
      dfd.resolve(data.description);
    }, 1);
  } else {
    AutoSummarization.generateSummary(data.pageUrl).done(function(description) {
      dfd.resolve(description);
    });
  }
  return dfd.promise();
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
  fileSize = Math.round(file.size / 1024);
  var extension = file.name.split('.').pop().toLowerCase();
  var fileTypes = ['jpg', 'jpeg', 'png'];  //acceptable file types
  var isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types 
  if(fileSize < 1024) {   
    if(isSuccess) {
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
    }else{
      $(".js-submission-error-message").html('Ony jpg and png file types are allowed');
      $('.js-submission-error').removeClass('hidden');    
      $('.js-submission-error').show();    
    }
  } else{
    $(".js-submission-error-message").html('Filesize less than 1 MB is allowed');
    $('.js-submission-error').removeClass('hidden');    
    $('.js-submission-error').show();    
  }
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

function setTooltips() {
  $('.js-tooltip').each(function() {
    var $item = $(this);
    var text = $item.attr('data-title');
    var placement = $item.attr('data-placement');
    $item.tooltip({
      title: text,
      placement: placement
    })
  });
}
