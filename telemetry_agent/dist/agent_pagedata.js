 /*
  * class TelemetryAgent pageData
  *
  * This is statistics javascript library
  * Send statistics data with the user details
  * sent statcount and statvalue with userdetails and custom details
  * Notify login and Notify logout with custom details
  *
  * Version 4.1.21
  **/
 var TelemetryAgentPageData = (function() {
     var PageDatainstance;

     var createInstance = function(config) {

         var self = this;

         self.configData = config.settings;
         self.microServiceUrl = config.settings.microServiceUrl;
         self.configSettingsActivityType = config.settings.configSettingsActivityType;
         self.statisticType = config.settings.statisticType;
         self.customStatistics = config.pageData.customStatistics;
         self.googleAnalytics = config.googleAnalytics.enable;
         self.gaTrackingId = config.googleAnalytics.trackingId;
         self.microServiceParams = config.microServiceParams;
         self.register = config.register;
         self.pageData = config.pageData;
         self.agentSource = self.configData.agentSource;
         self.loginRequestType = self.configData.loginRequestType;
         self.logoutRequestType = self.configData.logoutRequestType;
         self.nowTime = new Date().getTime();
         self.ajaxData = JSON.parse(localStorage.getItem('ajaxData')) || [];
         self.pageData.allowEnvironmentCapture = self.pageData.allowEnvironmentCapture !== undefined ? self.pageData.allowEnvironmentCapture : false;
         self.pageData.allowNetworkCapture = self.pageData.allowNetworkCapture !== undefined ? self.pageData.allowNetworkCapture : false;
         self.telemetryCustomData = {

             deviceData: {
                 deviceName: '',
                 deviceUuid: '',
                 osVersion: '',
                 osName: '',
                 modelName: ''
             },
             applicationData: {
                 appName: '',
                 appVersion: '',
                 releaseNote: ''
             },
             userData: {
                 name: '',
                 email: '',
                 phoneNumber: '',
                 dob: '',
                 nationality: ''
             },
             demoGraphics: {
                 age: '',
                 location: '',
                 language: '',
                 gender: ''
             },
             customData: {}

         }
         if (typeof self.register.userDetails == 'undefined' || self.register.userDetails == '')
             self.register.userDetails = {};
         /**
          * Convert string's first letter to uppercase
          */
         capitalise = function(string) {
             return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
         };
         /**
          * Enter your settings here
          */
         self.settings = {
             "apiKey": self.register.apiKey, // Your Project API-KEY
             "releaseStage": self.register.releaseStage, //Release Stage 1-Development, 2-Production, 3-Staging
             "userData": self.register.userDetails,
             "customStorageLimit": 20 // As per this size bulk data will store in local storage. rest of the storage for queuing .
         };

         /**
          * Return Settings by name
          */
         self.getSetting = function(name) {
             var setting = self.settings[name] !== undefined ? self.settings[name] : false;
             return setting;
         }

         /**
          * Return Release Stage
          */
         getReleaseStage = function() {
             name = 'releaseStage';
             var setting = self.settings[name] !== undefined ? self.settings[name] : "Development";
             return setting;
         }

         /**
          * Return Context with url and method
          */
         getContext = function(url, method) {
             method = typeof method == 'undefined' ? 'window.onerror' : method;
             var res = url.replace(window.location.origin, "");
             var context = method + " " + res;
             return context;
         }

         /**
          * Return Current Time
          */
         getCurrentTime = function() {
             var d = new Date(),
                 dformat = [
                     d.getFullYear(), (d.getMonth() + 1),
                     d.getDate()
                 ].join('-') +
                 ' ' + [d.getHours(),
                     d.getMinutes(),
                     d.getSeconds()
                 ].join(':');

             return dformat;
         }
         /**
         * Send to Google analytics.
         */
        self.postPagedataGa = function(category, action, label, value) {
        	if (self.googleAnalytics) {
        		ga('send', {
                    hitType: 'event',
                    eventCategory: category,
                    eventAction: action,
                    eventLabel: label,
                    eventValue: value
                });
        	};
        }
        
         /**
          * To send custom stat count.
          * example if you want to count the logged in users.
          * This will automatically adds your new value to old value
          */
         var statCount = function(name, value, customDataCallback, time) {
                 if (self.customStatistics) {

                     customDataCallback = (typeof customDataCallback === 'undefined') ? '' : customDataCallback;
                     time = (typeof(time) == undefined) ? "" : Math.floor(new Date().getTime() / 1000);
                     // Prepare data for statistics
                     var pageName = location.pathname.substring(1) + location.hash;
                     var data = [{
                         'statName': name,
                         'statCount': value,
                         'statTime': time
                     }];

                     customMetaData = (typeof customDataCallback == 'function') ? customDataCallback() : customDataCallback;

                     var customData = self.setCustomData(customMetaData);
                     var requestData = {
                         'type': 'count',
                         'data': data,
                         'apiKey': self.getSetting('apiKey'),
                         'releaseStage': getReleaseStage(),
                         'pageName': '/' + pageName,
                         'exitpage': '',
                         'pageTitle': document.title,
                         'url': window.location.href,
                         'userAgent': navigator.userAgent,
                         'userData': self.settings.userData,
                         'customData': customData,
                         'agentSource':self.agentSource

                     };
                     self.sendStatData(requestData, self.statisticType);
                     self.postPagedataGa('statCount', 'Click', name, value);
                 }
             }
             /**
              * To set customData
              * This will set your customData.
              */
         self.setCustomData = function(data) {

                 if (data) {

                     var customData = self.telemetryCustomData;


                     if (data.hasOwnProperty("deviceData")) {
                         if (data.deviceData.hasOwnProperty("deviceName")) {
                             customData.deviceData.deviceName = data.deviceData.deviceName;
                         }
                         if (data.deviceData.hasOwnProperty("deviceUuid")) {
                             customData.deviceData.deviceUuid = data.deviceData.deviceUuid;
                         }
                         if (data.deviceData.hasOwnProperty("osVersion")) {
                             customData.deviceData.osVersion = data.deviceData.osVersion;
                         }
                         if (data.deviceData.hasOwnProperty("osName")) {
                             customData.deviceData.osName = data.deviceData.osName;
                         }
                         if (data.deviceData.hasOwnProperty("modelName")) {
                             customData.deviceData.modelName = data.deviceData.modelName;
                         }



                     }
                     if (data.hasOwnProperty("applicationData")) {
                         if (data.applicationData.hasOwnProperty("appName")) {
                             customData.applicationData.appName = data.applicationData.appName;
                         }
                         if (data.applicationData.hasOwnProperty("appVersion")) {
                             customData.applicationData.appVersion = data.applicationData.appVersion;
                         }
                         if (data.applicationData.hasOwnProperty("releaseNote")) {
                             customData.applicationData.releaseNote = data.applicationData.releaseNote;
                         }
                     }

                     if (data.hasOwnProperty("userData")) {
                         if (data.userData.hasOwnProperty("name")) {
                             customData.userData.name = data.userData.name;
                         }
                         if (data.userData.hasOwnProperty("email")) {
                             customData.userData.email = data.userData.email;
                         }
                         if (data.userData.hasOwnProperty("phoneNumber")) {
                             customData.userData.phoneNumber = data.userData.phoneNumber;
                         }
                         if (data.userData.hasOwnProperty("dob")) {
                             customData.userData.dob = data.userData.dob;
                         }
                         if (data.userData.hasOwnProperty("nationality")) {
                             customData.userData.nationality = data.userData.nationality;
                         }

                     }
                     if (data.hasOwnProperty("demoGraphics")) {
                         if (data.demoGraphics.hasOwnProperty("age")) {
                             customData.demoGraphics.age = data.demoGraphics.age;
                         }
                         if (data.demoGraphics.hasOwnProperty("location")) {
                             customData.demoGraphics.location = data.demoGraphics.location;
                         }
                         if (data.demoGraphics.hasOwnProperty("language")) {
                             customData.demoGraphics.language = data.demoGraphics.language;
                         }
                         if (data.demoGraphics.hasOwnProperty("gender")) {
                             customData.demoGraphics.gender = data.demoGraphics.gender;
                         }

                     }
                     if (data.hasOwnProperty("customData")) {
                         customData.customData = data.customData;
                     }

                     return customData;

                 } else {
                     return self.telemetryCustomData;
                 }

             }
             /**
              * To send custom event.
              */
         var Event = function(category, action, label, value, customData) {
             if (self.customStatistics) {
                 var customData = self.setCustomData(customData);
                 var data = [{
                     eventCategory: category,
                     eventAction: action,
                     eventLabel: label,
                     eventValue: value
                 }];
                 var requestData = {
                     data: data,
                     type: 'event',
                     apiKey: self.getSetting('apiKey'),
                     releaseStage: getReleaseStage(),
                     customData: customData,
                     'agentSource':self.agentSource

                 };
                 self.sendStatData(requestData, self.statisticType);
                 self.postPagedataGa(category, action, label, value);
             }
         }



         /**
          * To send custom config settings.
          * This will keep your telemetry config.
          */
         var sendConfigData = function(Settings, Type, callback) {
             time = (typeof(time) == undefined) ? "" : Math.floor(new Date().getTime() / 1000);

             // Prepare data for statistics
             var pageName = location.pathname.substring(1) + location.hash;
             var requestData = {
                 'Configdata': Settings,
                 'apiKey': self.getSetting('apiKey'),
                 'releaseStage': getReleaseStage(),
                 'agentSource':self.agentSource


             };
             self.sendStatData(requestData, Type, callback);

         }


         /**
          * To send custom stat value.
          * This will update your old value with new value.
          */
         var statValue = function(name, value, customDataCallback, time) {
             if (self.customStatistics) {
                 customDataCallback = (typeof customDataCallback === 'undefined') ? '' : customDataCallback;
                 time = (typeof(time) == undefined) ? "" : Math.floor(new Date().getTime() / 1000);
                 customMetaData = (typeof customDataCallback == 'function') ? customDataCallback() : customDataCallback;
                 var customData = self.setCustomData(customMetaData);
                 // Prepare data for statistics
                 var pageName = location.pathname.substring(1) + location.hash;
                 var data = [{
                     'statName': name,
                     'statValue': value,
                     'statTime': time
                 }];
                 var requestData = {
                     'type': 'value',
                     'data': data,
                     'apiKey': self.getSetting('apiKey'),
                     'releaseStage': getReleaseStage(),
                     'pageName': '/' + pageName,
                     'exitpage': '',
                     'pageTitle': document.title,
                     'url': window.location.href,
                     'userAgent': navigator.userAgent,
                     'userData': self.settings.userData,
                     'customData': customData,
                     'agentSource':self.agentSource

                 };
                 self.sendStatData(requestData, self.statisticType);
                 self.postPagedataGa('statValue', 'Click', name, value);
             }
         }

         /**
          * To track the users.
          * if you notify an user is logged in , TelemetryAgent can track other activities with this user.
          */
         var setNotifyLogin = function(requestDataCallback, customDataCallback) {
             customDataCallback = (typeof customDataCallback === 'undefined') ? '' : customDataCallback;
             name = '';
             time = Math.floor(new Date().getTime() / 1000);

             // Prepare data for statistics
             var pageName = location.pathname.substring(1) + location.hash;
             var data = [{
                 'statName': name,
                 'statTime': time
             }];
             var requestData = {
                 'type': 'notifyLogin',
                 'statName': "",
                 'apiKey': self.getSetting('apiKey'),
                 'requestType': self.loginRequestType,
                 'releaseStage': getReleaseStage(),
                 'pageName': '/' + pageName,
                 'exitpage': '',
                 'pageTitle': document.title,
                 'url': window.location.href,
                 'userAgent': navigator.userAgent,
                 'agentSource':self.agentSource

             };
             requestData = requestDataCallback(requestData);
             var statName = requestData['statName'];

             requestData['data'] = data;
             requestData['data'][0]['statName'] = (statName == "") ? "Login" : statName;
             customMetaData = (typeof customDataCallback == 'function') ? customDataCallback() : customDataCallback;

             requestData['customData'] = self.setCustomData(customMetaData);

             requestData['userData'] = self.settings.userData;

             self.sendStatData(requestData, self.statisticType);
         }

          /**
          * To nofity an user in logged out from your application.
          */
         var setNotifyLogout = function(requestDataCallback,customDataCallback,userData) {
                 customDataCallback = (typeof customDataCallback === 'undefined') ? '' : customDataCallback;
                 name = '';
                 time = Math.floor(new Date().getTime() / 1000);

                 // Prepare data for statistics
                 var pageName = location.pathname.substring(1) + location.hash;
                 var data = [{
                     'statName': name,
                     'statTime': time
                 }];
                 var requestData = {
                     'type': 'notifyLogout',
                     'statName': "",
                     'apiKey': self.getSetting('apiKey'),
                     'releaseStage': getReleaseStage(),
                     'requestType': self.logoutRequestType,
                     'pageName': '/' + pageName,
                     'exitpage': '',
                     'pageTitle': document.title,
                     'url': window.location.href,
                     'userAgent': navigator.userAgent,
                     'agentSource':self.agentSource

                 };
                 requestData = requestDataCallback(requestData);
                 var statName = requestData['statName'];
                 requestData['data'] = data;
                 requestData['data'][0]['statName'] = (statName == "") ? "Logout" : statName;
                 customMetaData = (typeof customDataCallback == 'function') ? customDataCallback() : customDataCallback;
                 requestData['customData'] = self.setCustomData(customMetaData);
                 requestData['userData'] = self.settings.userData;  
                 if(userData !== undefined){
                    if(userData.name!==null){
                        requestData['userData'] = userData;
                    }
                 }
                 self.sendStatData(requestData, self.statisticType);
             }
             /**
              * To Store Bulk data.
              */
         self.addToLocalStorage = function(data) {
             flag = false;
             if (self.ajaxData.length != 0) {
                 self.ajaxData = JSON.parse(localStorage.getItem('ajaxData'));
             }
             if (self.ajaxData == null) {
                 self.ajaxData = [];
             };
             var currentStorageSize = self.getLengthInKB(self.ajaxData);
             var currentdataSize = self.getLengthInKB(data);
             if (currentdataSize < (self.configData.localStorageSize - currentStorageSize)) {
                 self.ajaxData.push(data);
                 localStorage.setItem('ajaxData', JSON.stringify(self.ajaxData));
                 flag = true;
             };
         };
         /**
          * Return last Inserted id
          */
         self.getLastInsertedId = function() {
             var id = self.readCookie('lastInsertedId');
             if (id == null) {
                 id = 0;
             };
             return parseInt(id);
         };
         /**
          * Return size of the data.
          * @param data - array
          */
         self.getLengthInKB = function(data) {
             var jsonString = JSON.stringify(data);
             var m = jsonString.match(/[^\x00-\xff]/g); //encodeURIComponent(testData).match(/%[89ABab]/g);
             var dataLength = jsonString.length + (!m ? 0 : m.length);
             dataLengthInKB = Math.round((dataLength / 1000).toFixed(2));
             return dataLengthInKB;
         };
         /**
          * Summary : Perform Data Transfer Service
          * @param ajaxParams - ajax parameters
          */
         self.serviceData = function(ajaxParams, Type, callback) {

             var serverParams = {};
             if (document.cookie.indexOf("EMSSESSID") == -1) {
                 var cookie = self.randomString(30);
                 self.setCookie('EMSSESSID', cookie, 1);
             }
             ajaxParams.data.EMSSESSID = self.readCookie('EMSSESSID');
             if (ajaxParams.data.requestType) {
                 if (ajaxParams.data.requestType == self.logoutRequestType) {
                     self.eraseCookie("EMSSESSID");
                 }
             }
             if (ajaxParams.httpMethod) {
                 serverParams.type = ajaxParams.httpMethod;
             }
             if (ajaxParams.data) {
                 serverParams.data = ajaxParams.data;
             }
             if (ajaxParams.params.async) {
                 serverParams.async = ajaxParams.params.async;
             }
             if (ajaxParams.params.dataType) {
                 serverParams.dataType = ajaxParams.params.dataType;
             }
             if (ajaxParams.httpHeaders) {
                 serverParams.headers = ajaxParams.httpHeaders;
             }
             if (ajaxParams.params.crossDomain) {
                 serverParams.crossDomain = ajaxParams.params.crossDomain;
             }
             if (ajaxParams.params.contentType) {
                 serverParams.contentType = ajaxParams.params.contentType;
             } else {
                 serverParams.contentType = self.configData.contentType;
             }
             if (ajaxParams.params.errorCallback) {
                 serverParams.error = ajaxParams.params.errorCallback;
             }
             serverParams.data.cookieValue = document.cookie;
             serverParams.success = ajaxParams.params.successCallback;
             //commented to make activitydata in json
             var data = serverParams.data;

             var microServiceParams = self.microServiceParams;
             microServiceParams.activityDataStructured = data;
             microServiceParams.createdAtGmt = new Date().valueOf();
             var now = new Date();
             var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
             var month = ('0' + (parseInt(now_utc.getMonth()) + 1)).slice(-2);
             var date = ('0' + (now_utc.getDate())).slice(-2);
             var hour = ('0' + (now_utc.getHours())).slice(-2);
             var minute = ('0' + (now_utc.getMinutes())).slice(-2);
             var seconds = ('0' + (now_utc.getSeconds())).slice(-2);
             var createdAT = now_utc.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
             microServiceParams.createdAt = createdAT;
             microServiceParams.activityName = Type;
             microServiceParams.activityType = Type;
             if (data.data)
                 microServiceParams.activityTag = data.data[0].statName;
             else if (data.isAjax == true)
                 microServiceParams.activityTag = "Ajax Statistic Data";
             else if (Type == 'ConfigSettings')
                 microServiceParams.activityTag = "";
             else
                 microServiceParams.activityTag = "Statistic Data";

         if(data.type == 'notifyLogin' || data.type == 'notifyLogout'){

             var rand = Math.random().toString(36).slice(2).substring(1);
             var timestamp = (new Date().getTime() / 1000).toFixed(0);
             var sessionUniqueId = rand+timestamp;
             if(data.type == 'notifyLogin'){
                document.cookie = "telemetryAgentSessionUniqueId="+sessionUniqueId+"; expires=0; path=/";
                
             }
             if(data.type == 'notifyLogout'){

                if (document.cookie.indexOf("telemetryAgentSessionUniqueId") != -1) {
                    sessionUniqueId = self.readCookie('telemetryAgentSessionUniqueId');
                    document.cookie = 'telemetryAgentSessionUniqueId=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
                }

             }
             microServiceParams.sessionUniqueId = sessionUniqueId;
         }
         
         microServiceParams.scope = {};
         var microServiceUrl = self.microServiceUrl;
         var username = '';
         try {
             var jsonObj = JSON.parse('[' + data + ']');
             if (jsonObj[0]['userData']['name'] && data.userData.name != undefined) {
                 var username = jsonObj[0]['userData']['name'];
             } else {
                 var username = 'Anonymous';
             }
         } catch (e) {
             var username = 'Anonymous';
         }
         jQuery.ajax({
             async: true,
             cache: false,
             type: 'post',
             url: microServiceUrl,
             data: JSON.stringify(microServiceParams),
             contentType: 'application/json',
             beforeSend: function(request) {
                 request.setRequestHeader("OperatedBy", username);
                 request.setRequestHeader("ServiceId", config.settings.serviceId);
                 
             },
             success: function(data) {
                 if (callback && typeof(callback) == 'function') {
                     callback(true);
                 }
                              
                  
             },
             error: function(jqXHR, textStatus, errorThrown) {
                 return false;
             }
         });
     };

         /**
          * To return page metrics like loadTime, latency, cssCount, jsCount etc.
          */
         self.pageMetricsData = function() {

             var headJson = {};
             var ajaxParams = {
                 params: {}
             };
             var performance = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
             var now = new Date().getTime();
             if (!performance) {
                 var pageMetrics = {
                     "pageLoadTime": Math.abs((now - self.nowTime)),
                     "perfbar": Math.abs((now - self.nowTime)),
                     "googleAnalytics": Math.abs((now - self.nowTime)),
                     "normalJavaScript": Math.abs((now - self.nowTime)),
                     "navigationTimingAPI": Math.abs((now - self.nowTime)),
                     "cssCount": document.querySelectorAll('link[rel="stylesheet"]').length,
                     "jsCount": document.querySelectorAll('script').length,
                     "imgCount": document.querySelectorAll('img').length
                 }
             } else {
                 pageMetrics = {
                     "pageLoadTime": Math.abs((performance.timing.loadEventStart - performance.timing.navigationStart)),
                     "perfbar": Math.abs((performance.timing.loadEventStart - performance.timing.navigationStart)),
                     "googleAnalytics": Math.abs((performance.timing.loadEventStart - performance.timing.navigationStart)),
                     "normalJavaScript": Math.abs((now - self.nowTime)),
                     "navigationTimingAPI": Math.abs((performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart)),
                     "latency": Math.abs((performance.timing.responseStart - performance.timing.connectStart)),
                     "frontEnd": Math.abs((performance.timing.loadEventStart - performance.timing.responseEnd)),
                     "backEnd": Math.abs((performance.timing.responseEnd - performance.timing.navigationStart)),
                     "responseDuration": Math.abs((performance.timing.responseEnd - performance.timing.responseStart)),
                     "requestDuration": Math.abs((performance.timing.responseStart - performance.timing.requestStart)),
                     "redirectCount": Math.abs(performance.navigation.redirectCount),
                     "loadEventTime": Math.abs((performance.timing.loadEventEnd - performance.timing.loadEventStart)),
                     "domContentLoaded": Math.abs((performance.timing.domContentLoadedEventStart - performance.timing.domInteractive)),
                     "processing": Math.abs((performance.timing.loadEventStart - performance.timing.domLoading)),
                     "cssCount": document.querySelectorAll('link[rel="stylesheet"]').length,
                     "jsCount": document.querySelectorAll('script').length,
                     "imgCount": document.querySelectorAll('img').length
                 }
             }
             return pageMetrics;
         };
         /**
          * Return Resource timing metrics.
          */
         self.resourceTimingData = function() {
             var resourceMetrics = [];
             var performance = window.performance || window.msPerformance || window.webkitPerformance || window.mozPerformance;
             if (typeof(performance) != 'undefined') {
                 if (!!performance.getEntries) {
                     var resourceMetrics = jQuery.map(performance.getEntriesByType('resource'), function(jsonObj) {
                         var obj = jQuery.extend({}, jsonObj);
                         delete obj.toJSON;
                         return obj;
                     });
                 }
             }
             return resourceMetrics;
         };
         /**
          * To track console like log, xhr request data from web console.
          */
         networkFromConsole = function() {
             //main function
             var mainFunction = function() {
                 var result = {
                     xhr: [],
                     environment: []
                 };

                 var data = {
                     enabled: !0,
                     display: !0,
                     error: !0,
                     watch: ["log", "debug", "info", "warn", "error"]
                 }

                 this.networkWatcher = new networkWrap()
                 if (self.pageData.allowEnvironmentCapture) {
                     var environment = new environmentWrap(window);
                 }
                 if (self.pageData.allowNetworkCapture) {

                     result.xhr = this.networkWatcher.log.appender;
                 }
                 result.environment = environment;
                 return result;
             };
             //rest functions
             var restFunction = function(utilData) {
                 this.util = utilData;
                 this.appender = [];
                 this.maxLength = 30;
             };
             restFunction.prototype = {
                 all: function(a) {
                     var b = [],
                         c, d;
                     for (d = 0; d < this.appender.length; d++)(c = this.appender[d]) && c.category === a && b.push(c.value);
                     return b
                 },
                 clear: function() {
                     this.appender.length = 0
                 },
                 truncate: function() {
                     this.appender.length > this.maxLength && (this.appender = this.appender.slice(Math.max(this.appender.length - this.maxLength, 0)))
                 },
                 add: function(a, b) {
                     var c = this.util.uuid();
                     this.appender.push({
                         key: c,
                         category: a,
                         value: b
                     });
                     this.truncate();
                     return c
                 },
                 get: function(a, b) {
                     var c, d;
                     for (d = 0; d < this.appender.length; d++)
                         if (c =
                             this.appender[d], c.category === a && c.key === b) return c.value;
                     return !1
                 }
             };

             //Network Url wrapping 
             var networkWrap = function() {

                 this.util = new extraActions(window),
                     this.log = new restFunction(this.util),
                     this.window = window;
                 this.options = {
                     enabled: true,
                     error: true
                 };

                 this.initialize(window);
             };
             networkWrap.prototype = {
                 initialize: function(a) {
                     this.watchNetworkObject(a.XMLHttpRequest);
                 },
                 watchNetworkObject: function(a) {
                     var b = f = this,
                         c = a.prototype.open,
                         d = a.prototype.send;

                     a.prototype.open =
                         function(method, url, async, user, password) {
                             this._xhrTrack = {
                                 method: method,
                                 url: url,
                                 async: typeof(async) != 'undefined' ? async : '',
                                 user: typeof(user) != 'undefined' ? user : '',
                                 password: typeof(password) != 'undefined' ? password : ''
                             };

                             b.listenForNetworkComplete(this)

                             c.apply(this, arguments)
                             this._xhrTrack.logId = f.log.add("n", {
                                 startedOn: f.util.isoNow(),
                                 method: this._xhrTrack.method,
                                 url: this._xhrTrack.url,
                                 async: this._xhrTrack.async,
                                 user: this._xhrTrack.user,
                                 password: this._xhrTrack.password,
                             });
                             return arguments
                         };
                 },
                 listenForNetworkComplete: function(a) {
                     var b = this;
                     b.window.ProgressEvent && a.addEventListener && a.addEventListener("readystatechange", function() {
                         4 === a.readyState && b.finalizeNetworkEvent(a)
                     }, !0);
                 },
                 finalizeNetworkEvent: function(a) {
                     var b = this.log.get("n", a._xhrTrack.logId);
                     b && (b.completedOn = this.util.isoNow(), b.statusCode = 1223 == a.status ? 204 : a.status, b.statusText = 1223 == a.status ? "No Content" : a.statusText)
                 },
                 report: function() {
                     return this.log.all("n")
                 }
             };


             self.UserAction = {
                 now: function() {
                     var date = new Date;
                     return date.toISOString ? date.toISOString() : date.getUTCFullYear() + "-" + this.pad(date.getUTCMonth() + 1) + "-" + this.pad(date.getUTCDate()) + "T" + this.pad(date.getUTCHours()) + ":" + this.pad(date.getUTCMinutes()) + ":" + this.pad(date.getUTCSeconds()) + "." + ((date.getUTCMilliseconds() / 1e3).toFixed(3) + "").slice(2, 5) + "Z"
                 },
                 pad: function(value) {
                     return value += "", 1 === value.length && (value = "0" + value), value
                 },
                 bind: function(event, obj) {
                     return function() {
                         return event.apply(obj, Array.prototype.slice.call(arguments))
                     }
                 },
                 eventObject: {},
                 all: function(EventObject) {

                     for (var t = this.getEventObject(EventObject), n = [], i = 0; t.length > i; i++) n.push(t[i].value);
                     return n
                 },
                 clear: function() {
                     for (var e in this.eventObject) this.eventObject.hasOwnProperty(e) && (this.eventObject[e].length = 0)
                 },
                 add: function(EventObject, options) {
                     var n = this.getEventObject(EventObject);
                     return n.push({
                         value: options
                     }), this.truncateEventObject(EventObject, 10);
                 },
                 getEventObject: function(EventObject) {
                     return this.eventObject[EventObject] || (this.eventObject[EventObject] = []), this.eventObject[EventObject]
                 },
                 truncateEventObject: function(EventObject, limit) {
                     var n = this.getEventObject(EventObject);
                     n.length > limit && (this.eventObject[EventObject] = n.slice(n.length - limit))
                 },

                 attach: function() {
                     var e = this.bind(this.onDocumentClicked, this),
                         n = this.bind(this.onInputChanged, this);
                     document.addEventListener ? (document.addEventListener("click", e, !0), document.addEventListener("blur", n, !0)) : document.attachEvent && (document.attachEvent("onclick", e), document.attachEvent("onfocusout", n))
                 },
                 writeUserEvent: function(element, event, value, attribute) {
                     "password" === this.getElementType(element) && (value = void 0), this.add("user", {
                         timestamp: new Date().getTime(),
                         action: event,
                         element: this.getOuterHTML(element),
                         val: this.getValueKind(value, attribute)
                     })
                 },
                 onDocumentClicked: function(event) {
                     var element = this.getElementFromEvent(event);
                     element && element.tagName && (this.isTarget(element, "a") || this.isTarget(element, "button") || this.isTarget(element, "input", ["button", "submit"]) ? this.writeUserEvent(element, "click") : this.isTarget(element, "input", ["checkbox", "radio"]) && this.writeUserEvent(element, "check", element.value, element.checked))
                 },
                 onInputChanged: function(event) {
                     var element = this.getElementFromEvent(event);
                     element && element.tagName && (this.isTarget(element, "textarea") ? this.writeUserEvent(element, "input", element.value) : this.isTarget(element, "select") && element.options && element.options.length ? this.onSelectInputChanged(element) : this.isTarget(element, "input") && !this.isTarget(element, "input", ["button", "submit", "hidden", "checkbox", "radio"]) && this.writeUserEvent(element, "input", element.value))
                 },
                 onSelectInputChanged: function(event) {
                     if (event.multiple) {
                         for (var t = 0; event.options.length > t; t++)
                             if (event.options[t].selected) {
                                 this.writeUserEvent(event, "select", event.options[t].value);
                                 break
                             }
                     } else event.selectedIndex >= 0 && event.options[event.selectedIndex] && this.writeUserEvent(event, "select", event.options[event.selectedIndex].value)
                 },
                 getElementFromEvent: function(event) {
                     return event.target || document.elementFromPoint(event.clientX, event.clientY)
                 },
                 isTarget: function(element, type, attribute) {
                     if (element.tagName.toLowerCase() !== type.toLowerCase()) return !1;
                     if (!attribute) return !0;
                     for (var i = this.getElementType(element), r = 0; attribute.length > r; r++)
                         if (attribute[r] === i) return !0;
                     return !1
                 },
                 getElementType: function(element) {
                     return (element.getAttribute("type") || "").toLowerCase()
                 },
                 getOuterHTML: function(element) {
                     for (var html = "<" + element.tagName.toLowerCase(), attributes = element.attributes, i = 0, r = attributes.length; r > i; i++) {
                         var o = attributes[i].name;
                         "value" !== o.toLowerCase() && (html += " " + o + '="' + attributes[i].value + '"')
                     }
                     return html += ">"
                 },
                 getValueKind: function(value, attribute) {
                     return null == value ? null : {
                         length: value.length,
                         checked: attribute,
                         pattern: this.matchInputPattern(value)
                     }
                 },
                 matchInputPattern: function(value) {
                     return "" === value ? "empty" : /^[a-z0-9!#$%&'*+=?\^_`{|}~\-]+(?:\.[a-z0-9!#$%&'*+=?\^_`{|}~\-]+)*@(?:[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9\-]*[a-z0-9])?$/.test(value) ? "email" : /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(value) || /^(\d{4}[\/\-](0?[1-9]|1[012])[\/\-]0?[1-9]|[12][0-9]|3[01])$/.test(value) ? "date" : /^(?:(?:\+?1\s*(?:[.\-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.\-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.\-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/.test(value) ? "phone" : /^\s*$/.test(value) ? "whitespace" : /^\d*$/.test(value) ? "numeric" : /^[a-zA-Z]*$/.test(value) ? "alphabet" : /^[a-zA-Z0-9]*$/.test(value) ? "alphanumeric" : "character"
                 },
                 getAllEvents: function() {
                     return this.all("user")
                 }
             };

             //environment Wrapping
             var environmentWrap = function(a) {
                 this.loadedOn = (new Date).getTime();
                 var a,
                     b = {};
                 window.jQuery && (window.jQuery.fn && window.jQuery.fn.jquery) && (b.jQuery = window.jQuery.fn.jquery);
                 window.jQuery && (window.jQuery.ui && window.jQuery.ui.version) && (b.jQueryUI = window.jQuery.ui.version);
                 window.angular && (window.angular.version && window.angular.version.full) && (b.angular = window.angular.version.full);
                 for (a in window)
                     if ("webkitStorageInfo" !== a) try {
                         if (window[a]) {
                             var c = window[a].version ||
                                 window[a].Version || window[a].VERSION;
                             "string" === typeof c && (b[a] = c)
                         }
                     } catch (d) {}
                 return {
                     timeOnPage: this.loadedOn,
                     dependencies: b,
                     plugins: getBrowserPlugins(),
                     userAgent: window.navigator.userAgent,
                     viewportHeight: window.document.documentElement.clientHeight,
                     viewportWidth: window.document.documentElement.clientWidth
                 }
             }

             //serialize function
             var serialize = function(a) {
                 return void 0 === a ? "undefined" : null === a ? "null" : "number" === typeof a && isNaN(a) ? "NaN" : "" === a ? "Empty String" : 0 === a ? "0" : !1 === a ? "false" : a && a.toString ? a.toString() : "unknown"
             }


             // To get all the plugins installed in browser 
             var getBrowserPlugins = function() {
                     var pluginsNames = navigator.plugins;
                     var pluginsNamesLength = navigator.plugins.length;
                     var pluginArr = [];
                     for (var i = 0; i < pluginsNamesLength; i++) {
                         pluginArr.push({
                             name: navigator.plugins[i].name,
                             description: navigator.plugins[i].description,
                             filename: navigator.plugins[i].filename,
                             version: navigator.plugins[i].version
                         });
                     }

                     return pluginArr;
                 }
                 //extra functions
             var extraActions = function(a) {
                 this.window = a
             };
             extraActions.prototype = {
                 bind: function(a, b) {
                     return function() {
                         return a.apply(b, Array.prototype.slice.call(arguments))
                     }
                 },
                 isoNow: function() {
                     var a = new Date;
                     return a.getTime();
                 },
                 uuid: function() {
                     return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,
                         function(a) {
                             var b = 16 * Math.random() | 0;
                             return ("x" == a ? b : b & 3 | 8).toString(16)
                         })
                 }
             };

             mainObject = mainFunction();
             return mainObject;
         }


         networkFromConsole();


         /**
          * Prepare statistics data for sending.
          */
         self.sendStatData = function(data, Type, callback) {
             data.version = self.configData.version;
             data.lang = self.configData.lang;

             var headJson = {};
             var ajaxParams = {
                 params: {}
             };

             ajaxParams.httpHeaders = headJson;
             ajaxParams.params.dataType = 'jsonp';
             ajaxParams.params.crossDomain = true;
             ajaxParams.data = data;
             ajaxParams.createdAt = getCurrentTime();
             if (storageSupport() && self.getLengthInKB(self.ajaxData) <= self.configData.localStorageSize) {
                 self.bulkProcessing(ajaxParams);
             } else {
                 self.serviceData(ajaxParams, Type, callback);
             }
         };

         /**
          * To generate a random string.
          */
         self.randomString = function(len, bits) {
             bits = bits || 36;
             var outStr = "",
                 newStr;
             while (outStr.length < len) {
                 newStr = Math.random().toString(bits).slice(2);
                 outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
             }
             return outStr;
         };
         /**
          * Check support for localstorage.
          */
         function storageSupport() {
             return false;
         }
         /**
          * To save cookie.
          */
         self.setCookie = function(name, value, days) {
             if (days) {
                 var date = new Date();
                 date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                 var expires = "; expires=" + date.toGMTString();
             } else var expires = "";
             document.cookie = name + "=" + value + expires + "; path=/";
             return true;
         };
         /**
          * To Process bulking.
          */
         self.bulkProcessing = function(ajaxParams) {
             var localCount = self.readCookie('localCount');
             if (localCount == null) {
                 self.setCookie('localCount', 1, 1);
                 localCount = self.readCookie('localCount');
             }
             var lastId = self.getLastInsertedId();
             var id = lastId + parseInt(localCount);
             localCount = parseInt(localCount) + 1;
             self.setCookie('localCount', localCount, 1);
             ajaxParams.id = id;
             ajaxParams.bulk = true;
             if (document.cookie.indexOf("EMSSESSID") == -1) {
                 var cookie = self.randomString(30);
                 self.setCookie('EMSSESSID', cookie, 1);
             }
             ajaxParams.data.EMSSESSID = self.readCookie('EMSSESSID');
             if (ajaxParams.data.requestType) {
                 if (ajaxParams.data.requestType == self.logoutRequestType) {
                     self.eraseCookie("EMSSESSID");
                 }
             }
             self.addToLocalStorage(ajaxParams);
         };

         /**
          * To read cookie.
          */
         self.readCookie = function(name) {
                 var nameEQ = name + "=";
                 var ca = document.cookie.split(';');
                 for (var i = 0; i < ca.length; i++) {
                     var c = ca[i];
                     while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                     if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
                 }
                 return null;
             }
             /**
              * To delete cookie
              */
         self.eraseCookie = function(name) {
             self.setCookie(name, "", -1);
             return true;
         };
         /*------------ Send every 1MB of Bulkdata --------------*/

         var size = self.getLengthInKB(self.ajaxData);
         if (self.ajaxData.length != 0 && self.settings.customStorageLimit < size && storageSupport()) {
             self.configData.bulkData = true;

             var success = self.serviceData(self.ajaxData, self.statisticType);
             if (success) {
                 success.forEach(function(successEntry) {
                     self.ajaxData.forEach(function(fullEntry, index) {
                         if (fullEntry.id === successEntry.id) {
                             self.ajaxData.splice(index, 1);
                         }
                     });
                 });
                 localStorage.setItem('ajaxData', JSON.stringify(self.ajaxData));
                 self.eraseCookie('localCount');
             }

         };

         /**
          * To send automatic statistics about a page.
          * This will happen on page change or refresh.
          */
         var statisticData = function(enableStat,callback) {

        if (enableStat) {
             var nVer = navigator.appVersion;
             var nAgt = navigator.userAgent;
             var nameOffset, verOffset, ix, OSName;

                 if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
                 else if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
                 else if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
                 else if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";


                 var apiKey = self.getSetting('apiKey');
                 var releaseStage = getReleaseStage();
                 var page = location.pathname.substring(1) + location.hash;
                 var queryParam = '';
                 var sampleData = {};
                 var networkData = mainObject;

                 var pageLoadEvent = function() {
                     if (config.pageData.allowNetworkCapture) {
                         networkData.resourceTimingMetrics = self.resourceTimingData();

                     }

                     sampleData = {
                         type: 'pageStatistics',
                         apiKey: apiKey,
                         releaseStage: releaseStage,
                         userAgent: navigator.userAgent,
                         pageTitle: document.title,
                         pageName: '/' + page,
                         url: window.location.href,
                         userData: self.settings.userData,
                         pageMetrics: self.pageMetricsData(),
                         networkData: networkData,
                         isAjax: false,
                         agentSource:self.agentSource

                     };

                     self.sendStatData(sampleData, self.statisticType, callback);
                 };

                 window.addEventListener("load", pageLoadEvent, false);
                 window.addEventListener("onbeforeunload", pageLoadEvent, false);
             }
         };


         /**
          * To send automatic statistics on ajax call.
          * This will happen on each ajax call in a page.
          */
         var telemetryAgentAjaxStatistics = function() {
             if (config.pageData.allowAjaxStatistics) {




                 var s_ajaxListener = new Object();
                 s_ajaxListener.tempOpen = XMLHttpRequest.prototype.open;
                 s_ajaxListener.tempSend = XMLHttpRequest.prototype.send;
                 s_ajaxListener.callback = function() {
                     telemetryAjaxdata = new Array();
                     telemetryAjaxdata[0] = this.url;
                     telemetryAjaxdata[1] = this.method;
                     telemetryAgentAjaxUrl = this.url;

                     var attachmentEndUrl = telemetryAgentAjaxUrl.split("?");
                     telemetryAgentEndUrl = attachmentEndUrl[0].substr(attachmentEndUrl[0].lastIndexOf('/') + 1);

                     if ((telemetryAgentEndUrl != 'activities.json') && telemetryAgentEndUrl != 'upload.json') {
                         self.ajaxStatisticData(telemetryAjaxdata);
                     }
                 }

                 XMLHttpRequest.prototype.open = function(a, b) {
                     if (!a) var a = '';
                     if (!b) var b = '';
                     s_ajaxListener.tempOpen.apply(this, arguments);
                     s_ajaxListener.method = a;
                     s_ajaxListener.url = b;
                     if (a.toLowerCase() == 'get') {
                         s_ajaxListener.data = b.split('?');
                         s_ajaxListener.data = s_ajaxListener.data[1];
                     }
                 }

                 XMLHttpRequest.prototype.send = function(a, b) {
                     if (!a) var a = '';
                     if (!b) var b = '';
                     s_ajaxListener.tempSend.apply(this, arguments);
                     if (s_ajaxListener.method.toLowerCase() == 'post') s_ajaxListener.data = a;
                     s_ajaxListener.callback();
                 }

             }
         };



         /*Sending ajax data*/
         self.ajaxStatisticData = function(telemetryAjaxdata) {

             if (telemetryAjaxdata) {
                 var nVer = navigator.appVersion;
                 var nAgt = navigator.userAgent;
                 var nameOffset, verOffset, ix, OSName;

                 if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
                 else if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
                 else if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
                 else if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";


                 var apiKey = self.getSetting('apiKey');
                 var releaseStage = getReleaseStage();
                 var page = location.pathname.substring(1) + location.hash;
                 var queryParam = '';
                 var sampleData = {};

                 mainObject.ajaxDataDetails = telemetryAjaxdata;
                 var networkData = mainObject;
                 if (config.pageData.allowNetworkCapture) {
                     networkData.resourceTimingMetrics = self.resourceTimingData();

                 }
                 sampleData = {
                     type: 'pageStatistics',
                     apiKey: apiKey,
                     releaseStage: releaseStage,
                     userAgent: navigator.userAgent,
                     pageTitle: document.title,
                     pageName: '/' + page,
                     url: window.location.href,
                     userData: self.settings.userData,
                     pageMetrics: self.pageMetricsData(),
                     networkData: networkData,
                     isAjax: true,
                     agentSource:self.agentSource



                 };
                 self.sendStatData(sampleData, self.statisticType);
             }
         };
         /**
          * To send automatic statistics about a page.
          * This will happen on page change or refresh.
          */
         var vistiedOn = function() {
             var apiKey = self.getSetting('apiKey');
             var releaseStage = getReleaseStage();
             var gaTrackingId = false;
             if (self.googleAnalytics) {
             	gaTrackingId = self.gaTrackingId;
             }
             sampleData = {
                 apiKey: apiKey,
                 releaseStage: releaseStage,
                 httpReferer: document.referrer,
                 userData: self.settings.userData,
                 userAgent: navigator.userAgent,
                 gaTrackingId: gaTrackingId
             };
             var username = '';
             try {
                 var jsonObj = $.parseJSON('[' + data + ']');
                 if (jsonObj[0]['userData']['name'] && data.userData.name != undefined) {
                     var username = jsonObj[0]['userData']['name'];
                 } else {
                     var username = 'Anonymous';
                 }
             } catch (e) {
                 var username = 'Anonymous';
             }
             var microServiceParams = self.microServiceParams;
             microServiceParams.activityDataStructured = sampleData;

             microServiceParams.activityName = "VisitorTracking";
             microServiceParams.createdAtGmt = new Date().valueOf();
             var now = new Date();
             var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
             var month = ('0' + (parseInt(now_utc.getMonth()) + 1)).slice(-2);
             var date = ('0' + (now_utc.getDate())).slice(-2);
             var hour = ('0' + (now_utc.getHours())).slice(-2);
             var minute = ('0' + (now_utc.getMinutes())).slice(-2);
             var seconds = ('0' + (now_utc.getSeconds())).slice(-2);
             var createdAT = now_utc.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
             microServiceParams.createdAt = createdAT;
             microServiceParams.scope = {};
             var microServiceUrl = self.microServiceUrl;
             jQuery.ajax({
                 async: true,
                 cache: false,
                 type: 'post',
                 url: microServiceUrl,
                 data: JSON.stringify(microServiceParams),
                 contentType: 'application/json',
                 beforeSend: function(request) {
                     request.setRequestHeader("OperatedBy", username);
                     request.setRequestHeader("ServiceId", config.settings.serviceId);
                 },
                 success: function(data) {

                     if (typeof(data.Data) != 'undefined') {
                         self.setCookie('telemetryAgentvisitedOn', data.Data.processedAt);
                     }
                 },
                 error: function(jqXHR, textStatus, errorThrown) {
                     return false;
                 }
             });
         };
         return {
             statisticData: statisticData,
             telemetryAgentAjaxStatistics: telemetryAgentAjaxStatistics,
             vistiedOn: vistiedOn,
             sendConfigData: sendConfigData,
             statCount: statCount,
             statValue: statValue,
             setNotifyLogin: setNotifyLogin,
             setNotifyLogout: setNotifyLogout,
             Event: Event

         };

     }

     return {
         getInstance: function(config) {
             if (!PageDatainstance) {
                 PageDatainstance = createInstance(config);
             }
             return PageDatainstance;
         }
     };
 })();