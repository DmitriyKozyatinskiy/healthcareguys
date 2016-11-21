import $ from 'jquery';
import signInTemplate from './SignInForm.html';
import { config } from './../config';
import Loader from './../Loader/Loader';


export default class Auth {
  constructor() {
    this._main = $('#js-main');
    this._tabs = $('#js-tabs');
    this._footer = $('#js-footer');
    this._loginForm = $('#js-login-form');
    this._contentForm = $('#js-content-form');
    this.config = config;
    this._setEvents();
  }

  
  _setEvents() {
    $(document)
      .on('click', '#js-logout-button', () => {
        this._handleLogOut();
      })
      .on('submit', '#js-login-form', event => {
        this._handleFormSubmission(event);
      });
  }
  

  showSignInForm() {
    this._tabs.addClass('hidden');
    this._footer.addClass('hidden');
    this._main.addClass('is-login-form-shown');
    this._contentForm.empty();
    this._loginForm.removeClass('hidden').html(signInTemplate);
  }
  

  signIn() {
    return new Promise((resolve, reject) => {
      var data = {
        username: $('#js-username').val(),
        password: $('#js-password').val()
      };

      $.ajax({
        url: config.restUrl + '/wp-json/api/wp/v2/authentication/login',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        xhrFields: {
          withCredentials: true
        }
      }).done(response => {
        response = JSON.parse(response);
        if (response.status === 'success') {
          this._saveToken(response.token).then(token => {
            this._updateConfig(response.uname, data.username);
            $(document).trigger('sign-in:telemetry', [ data ]);
            resolve(token);
          });
        } else {
          reject();
        }
      }).fail(() => {
        reject();
      });
    });
  }


  signOut() {
    return new Promise((resolve) => {
      $.ajax({
        url: config.restUrl + '/wp-json/api/wp/v2/authentication/logout',
        method: 'POST',
        contentType: 'application/json',
        xhrFields: {
          withCredentials: true
        }
      }).done(() => {
        Promise.all([
          this._saveToken(''), this._saveUserName('')
        ]).then(() => {
          $(document).trigger('sign-out:telemetry', [ data ]);
          resolve();
        });
      });
    });
  }


  isSignedIn() {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: config.restUrl + '/wp-json/api/wp/v2/session',
        method: 'POST',
        contentType: 'application/json',
        xhrFields: {
          withCredentials: true
        }
      }).done(response => {
        response = JSON.parse(response);
        if (response.status === 'success') {
          Promise.all(
            [this._saveToken(response.token), this._saveUserName(response.results.uname)]
          ).then(results => {
            const [ token, username ] = results;
            this._updateConfig(response.results.uname, response.results.email);
            resolve(username);
          });
        } else {
          reject();
        }
      }).fail(() => {
        this._saveToken('').then(reject);
      });
    });
  }


  static getToken() {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get('token', token => {
        token = token || {};
        try {
          if (token.token) {
            resolve(token.token);
          } else {
            reject();
          }
        } catch(e) {
          reject();
        }
      });
    });
  }
  

  _saveToken(token) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ token: token },() => {
        resolve(token);
      });
    });
  }


  _saveUserName(username) {
    return new Promise((resolve) => {
      chrome.storage.sync.set({ username: username },() => {
        resolve(username);
      });
    });
  }


  _getUserName() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('username', username => {
        resolve(username.username);
      });
    });
  }


  _updateConfig(name, email) {
    config.userDetails.name = name;
    config.userDetails.email = email;
    config.userDetails.appVersion = config.appVersion;
    $(document).trigger('update:telemetry', [{
      apiKey: config.appKey,
      releaseStage: config.releaseStage,
      userData: config.userDetails
    }]);
  }

  
  _handleFormSubmission(event) {
    event.preventDefault();
    const $loginFailedMessage = $('#js-wrong-credentials');
    $loginFailedMessage.addClass('hidden');
    Loader.show();
    this.signIn().then(() => {
      $(document).trigger('set-interface:popup');
    }, () => {
      $loginFailedMessage.removeClass('hidden');
    }).then(() => {
      Loader.hide();
    });
  }
  
  
  _handleLogOut() {
    this.showSignInForm();
    const $loginButton = $('#js-sign-in-button');
    $loginButton.prop('disabled', true);
    this.signOut().then(() => {
      $loginButton.prop('disabled', false);
    });
  }
}
