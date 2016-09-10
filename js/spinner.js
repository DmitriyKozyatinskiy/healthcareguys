var Loader = (function() {
  'use strict';

  var $body = $('body');
  
  function show() {
    $body.addClass('no-events');
    $('.js-loading-container').removeClass('hidden');
    // new Spinner(spinnerOptions).spin(spinnerContainer);
  }

  function hide() {
    $('.js-loading-container').addClass('hidden');
    $body.removeClass('no-events');
  }

  return {
    show: show,
    hide: hide
  }
}());