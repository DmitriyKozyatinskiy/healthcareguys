var Auth = (function () {
  'use strict';

  var $main = $('#js-main');
  var $tabs = $('#js-tabs');
  var $footer = $('#js-footer');
  var $loginForm = $('#js-login-form');
  var $contentForm = $('#js-content-form');
  var $registrationForm = $('#js-registration-form');

  function isSignedIn() {
    var dfd = $.Deferred();

    $.ajax({
      url: window.config.restUrl + '/wp-json/api/wp/v2/session',
      method: 'POST',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function (response) {
      response = JSON.parse(response);
      if (response.status === 'success') {
        $.when(saveToken(response.token), saveUserName(response.results.uname)).done(function(token, username) {
          updateConfig(response.results.uname, response.results.email);
          dfd.resolve(username);
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
      url: window.config.restUrl + '/wp-json/api/wp/v2/authentication/login',
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
          updateConfig(response.uname, data.username);
          config.telemetryAgent.pageData.setNotifyLogin(function( requestData ) {
            requestData['statName'] = 'Login';
            return requestData;
          }, '');
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

  function updateConfig(name, email) {
    config.userDetails.name = name;
    config.userDetails.email = email;
    config.userDetails.appVersion = config.appVersion;
    config.telemetryAgent = TelemetryAgent.getInstance({
      apiKey: config.appKey,
      releaseStage: config.releaseStage,
      userData: config.userDetails
    });
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
      url: config.restUrl + '/wp-json/api/wp/v2/authentication/logout',
      method: 'POST',
      contentType: 'application/json',
      xhrFields: {
        withCredentials: true
      }
    }).done(function() {
      $.when(saveToken(''), saveUserName('')).done(function() {
        config.telemetryAgent.pageData.setNotifyLogout(function(requestData) {
          requestData['statName']= 'Logout';
          return requestData;
        }, '');
        dfd.resolve();
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

  function hideContent() {
    $tabs.addClass('hidden');
    $footer.addClass('hidden');
    $main.addClass('is-login-form-shown');
    $contentForm.empty();
  }

  function showSignInForm() {
    var dfd = $.Deferred();
    $.get('../html/auth.html').done(function (template) {
      hideContent();
      $registrationForm.addClass('hidden');
      $loginForm.removeClass('hidden').html(template);
      dfd.resolve();
    }).fail(function () {
      dfd.reject();
    });
    return dfd.promise();
  }

  function showRegistrationForm() {
    var dfd = $.Deferred();
    $.get('../html/registration.html').done(function (template) {
      hideContent();
      $loginForm.addClass('hidden');
      $registrationForm.removeClass('hidden').html(template);
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
    showSignInForm: showSignInForm,
    showRegistrationForm: showRegistrationForm
  }
}());
