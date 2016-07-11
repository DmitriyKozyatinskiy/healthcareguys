$(function() {
  requestData().done(function(data) {
    setContent('content', data).done(function () {
      $('#js-spinner').remove();
    });
  });
  
  $(document).on('click', '.js-navigation-button', function() {
    var $button = $(this);
    var dataType = $button.attr('href').substr(1);
  })
    .on('change', '#js-image-uploader', handleImageUpdate)
    .on('click', '#js-image-container', function() {
      $('#js-image-uploader').trigger('click');
    })
    .on('click', '#js-title, #js-description', function() {
      var $content = $(this);
      var $input = $('#' + $content.attr('data-input'));
      $content.addClass('hidden');
      $input.removeClass('hidden').focus();
    })
    .on('change, focusout', '#js-title-input, #js-description-input', function() {
      var $input = $(this);
      var $content = $('#' + $input.attr('data-content'));
      $input.addClass('hidden');
      $content.html($input.val()).removeClass('hidden');
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
      dfd.resolve(response);
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



