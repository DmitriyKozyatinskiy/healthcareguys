var Auth = (function () {
  'use strict';

  var $loginForm = $('#js-login-form');
  var $contentForm = $('#js-content-form');
  var $tabs = $('#js-tabs');
  var $footer = $('#js-footer');
  var $main = $('#js-main');

  function isSignedIn() {
    var dfd = $.Deferred();

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/session',
      method: 'POST',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function (response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        saveToken(response.token).done(function () {
          saveUserName(response.results.uname).done(function() {
            dfd.resolve(response.results.uname);
          });
        });
      } else {
        dfd.reject();
      }
    }).fail(function () {
      saveToken('').done(function () {
        dfd.reject();
      });
    });

    return dfd.promise();
  }

  function signIn() {
    var dfd = $.Deferred();
    var data = {
      username: $('#js-username').val(),
      password: $('#js-password').val()
    };

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/authentication/login',
      method: 'POST',
      data: JSON.stringify(data),
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function (response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        saveToken(response.token).done(function (token) {
          dfd.resolve(token);
        });
      } else {
        dfd.reject();
      }
    }).fail(function () {
      dfd.reject();
    });

    return dfd.promise();
  }

  function saveToken(token) {
    var dfd = $.Deferred();
    chrome.storage.sync.set({ 'token': token }, function() {
      dfd.resolve(token)
    });
    return dfd.promise();
  }

  function getToken() {
    var dfd = $.Deferred();
    chrome.storage.sync.get('token', function(token) {
      if (token.token) {
        dfd.resolve(token.token)
      } else {
        dfd.reject('')
      }
    });
    return dfd.promise();
  }

  function signOut() {
    var dfd = $.Deferred();

    $.ajax({
      url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/authentication/logout',
      method: 'POST',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function() {
      saveToken('').done(function () {
        saveUserName('').done(function () {
          dfd.resolve();
        });
      });
    });

    return dfd.promise();
  }

  function saveUserName(username) {
    var dfd = $.Deferred();
    chrome.storage.sync.set({ 'username': username }, function() {
      dfd.resolve(username);
    });
    return dfd.promise();
  }

  function getUserName() {
    var dfd = $.Deferred();
    chrome.storage.sync.get('username', function(username) {
      dfd.resolve(username.username)
    });
    return dfd.promise();
  }

  function showSignInForm() {
    var dfd = $.Deferred();
    $.get('../html/auth.html').done(function (template) {
      $tabs.addClass('hidden');
      $footer.addClass('hidden');
      $main.addClass('is-login-form-shown');
      $loginForm.removeClass('hidden').html(template);
      $contentForm.empty();
      dfd.resolve();
    }).fail(function () {
      dfd.reject();
    });
    return dfd.promise();
  }

  return {
    signIn: signIn,
    signOut: signOut,
    getToken: getToken,
    saveToken: saveToken,
    isSignedIn: isSignedIn,
    getUserName: getUserName,
    showSignInForm: showSignInForm
  }
}());
