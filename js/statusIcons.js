var Status = (function() {
  'use strict';

  var $success = $('#js-success');
  var $error = $('#js-error');

  function showSuccess() {
    $success.removeClass('hidden');
    window.setTimeout(function() {
      $success.addClass('hidden');
    }, 1500)
  }

  function showError() {
    $error.removeClass('hidden');
    window.setTimeout(function() {
      $error.addClass('hidden');
    }, 1500)
  }


  return {
    showSuccess: showSuccess,
    showError: showError
  }
}());