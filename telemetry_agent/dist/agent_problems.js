/**
 * TelemetryAgent problems
 * Javascript Library
 * Version 4.1.23
 */
var TelemetryAgentProblems = (function() {
    var instance;

    var createInstance = function(config) {



        var self = this;
        self.configData = config.settings;
        self.register = config.register;
        self.options = config.problems;
        self.microServiceUrl = config.settings.microServiceUrl;
        self.microServiceParams = config.microServiceParams;
        self.googleAnalytics = config.googleAnalytics.enable;
        self.statisticType = config.statisticType;
        self.actvityType = config.actvityType;
        self.agentSource = self.configData.agentSource;
        self.exceptionType = self.configData.exceptionType;
        self.errorType = self.configData.errorType;
        self.logType = self.configData.logType;
        self.warningType = self.configData.warningType;
        self.eventType = self.configData.eventType;
        self.errorReportingLimit = self.configData.errorReportingLimit;
        self.shouldNotify = self.configData.shouldNotify;
        self.notifyReleaseStageStatus = self.configData.notifyReleaseStageStatus;

        self.customError = config.problems.customError;
        self.allowEnvironmentCapture = self.options.allowEnvironmentCapture !== undefined ? self.options.allowEnvironmentCapture : false;
        self.allowNetworkCapture = self.options.allowNetworkCapture !== undefined ? self.options.allowNetworkCapture : false;
        self.allowUserEvent = self.options.allowUserEvent !== undefined ? self.options.allowUserEvent : false;
        self.allowConsoleCapture = self.options.allowConsoleCapture !== undefined ? self.options.allowConsoleCapture : false;
        self.notifyReleaseStages = self.options.notifyReleaseStages !== undefined ? self.options.notifyReleaseStages : ['Development', 'Production', 'Staging'];

        self.customMetaData;
        if (typeof self.register.userDetails == 'undefined' || self.register.userDetails == '')
            self.register.userDetails = {};

        // Compile regular expressions upfront.
        var API_KEY_REGEX = /^[0-9a-f]{32}$/i;
        var FUNCTION_REGEX = /function\s*([\w\-$]+)?\s*\(/i;
        var mainObject;

        /**
         * Enter your settings here
         */
        self.settings = {
            "apiKey": self.register.apiKey, // Your Project API-KEY
            "releaseStage": self.register.releaseStage, //Release Stage 1-Development, 2-Production, 3-Staging
            "userData": self.register.userDetails
        }

        /**
         * Convert string's first letter to uppercase
         */
        var capitalise = function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        }

        /**Track console data. 
        Both netwok data and console data are integrated in this function**/
        exceptionFromConsole(); // Track console data.


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
                    // key: i,
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

        self.UserAction.attach();

        self.userActions = function() {
            return self.UserAction.getAllEvents()
        };

        self.clearUserActions = function() {
            return self.UserAction.clear();
        };

        /**
         * To track console like log, xhr request data from web console.
         */
        function exceptionFromConsole() {
            //main function
            var efc = this;
            var mainFunction = function() {
                var result = {
                    console: [],
                    network: [],
                    environment: [],
                    userEvents: []
                };
                var data = {
                    enabled: !0,
                    display: !0,
                    error: !0,
                    watch: ["log", "debug", "info", "warn", "error"]
                }
             
              
                if (self.allowConsoleCapture) {
                    var consoleResult = consoleWrapping(window.console, data);
                    result.console = consoleResult;
                }
                if (self.allowNetworkCapture) {
                    efc.networkWatcher = new networkWrap()
                    result.network = efc.networkWatcher.log.appender;
                }
                if (self.allowEnvironmentCapture) {
                    var environment = new environmentWrap(window);
                    result.environment = environment;
                }
                return result;
            };

            /**
             * Track all console data like log, debug, info, warn, error
             */
            var consoleWrapping = function(a, b) {
                this.appender = [];
                this.util = new extraActions(window),
                    this.log = new restFunction(this.util),
                    a = a || {};

                var c = a.log || function() {},
                    d = this,
                    e;
                for (e = 0; e < b.watch.length; e++)(function(e) {
                    var g = a[e] || c;
                    a[e] = function() {
                        try {
                            var a = Array.prototype.slice.call(arguments);
                            d.log.add("c", {
                                timestamp: d.util.isoNow(),
                                severity: e,
                                message: serialize(a)
                            });
                            g.apply(this, a)
                        } catch (h) {}
                    }
                })(b.watch[e]);
                return this.log.appender
            }

            //Network Url wrapping 
            var networkWrap = function() {
                this.util = new extraActions(window),
                    this.log = new restFunction(this.util),

                    this.initialize(window);
            };
            networkWrap.prototype = {
                initialize: function(a) {
                    this.watchNetworkObject(a.XMLHttpRequest);
                },
                watchNetworkObject: function(a) {
                    var f;
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
                            c.apply(this, arguments)

                            f.log.add("n", {
                                startedOn: f.util.isoNow(),
                                method: this._xhrTrack.method,
                                url: this._xhrTrack.url,
                                async: this._xhrTrack.async,
                                user: this._xhrTrack.user,
                                password: this._xhrTrack.password

                            });

                            return arguments
                        };
                    a.prototype.send = function() {
                        var currentIndex = f.log.appender.length - 1;
                        if (f.log.appender[currentIndex].url != undefined) {
                            var resourceEndUrl = f.log.appender[currentIndex].url.substr(f.log.appender[currentIndex].url.lastIndexOf('/') + 1);
                        } else {
                            var resourceEndUrl = '';
                        }
                        if (resourceEndUrl != 'activities.json') {
                            f.log.appender[currentIndex].parameters = arguments[0];
                        }
                        this.addEventListener("readystatechange", function() {

                            f.log.appender[currentIndex].response = this.response;
                            f.log.appender[currentIndex].onabort = this.onabort;
                            f.log.appender[currentIndex].onerror = this.onerror;
                            f.log.appender[currentIndex].onload = this.onload;
                            f.log.appender[currentIndex].onloadend = this.onloadend;
                            f.log.appender[currentIndex].onloadstart = this.onloadstart;
                            f.log.appender[currentIndex].onprogress = this.onprogress;
                            f.log.appender[currentIndex].onreadystatechange = this.onreadystatechange;
                            f.log.appender[currentIndex].ontimeout = this.ontimeout;
                            f.log.appender[currentIndex].readyState = this.readyState;
                            f.log.appender[currentIndex].responseText = this.responseText;
                            f.log.appender[currentIndex].responseType = this.responseType;
                            f.log.appender[currentIndex].responseURL = this.responseURL;
                            if( this.responseXML){
                                f.log.appender[currentIndex].responseXML = this.responseXML;
                            }
                            
                            f.log.appender[currentIndex].status = this.status;
                            f.log.appender[currentIndex].statusText = this.statusText;
                            f.log.appender[currentIndex].timeout = this.timeout;
                            f.log.appender[currentIndex].headers = this.getAllResponseHeaders();

                            // Check if the network error occurres
                            if ((this.readyState == 4 && this.status == 404) || (this.readyState == 4 && this.status == 500) || (this.readyState == 4 && this.status == 503)) {

                                var errorMessage = '';

                                switch (this.status) {
                                    case 404:
                                        errorMessage = "404 (Not Found)";
                                        break;
                                    case 500:
                                        errorMessage = "Server Error";
                                        break;
                                    case 500:
                                        errorMessage = "Unavailable";
                                        break;
                                    default:
                                        errorMessage = '';
                                        break;
                                }

                                var errorObj = new Error("Network Error");
                                var stacktrace = generateStackTrace(errorObj);
                                var fileName = "";
                                var lineNumber = "";
                                var data = prepareData(errorMessage, fileName, lineNumber, '', errorObj, '', self.exceptionType, errorMessage);
                                self.notify(data);
                            }
                        });
                        return d.apply(this, arguments);
                    };
                    return a;
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

            //serialize function
            var serialize = function(a) {
                return void 0 === a ? "undefined" : null === a ? "null" : "number" === typeof a && isNaN(a) ? "NaN" : "" === a ? "Empty String" : 0 === a ? "0" : !1 === a ? "false" : a && a.toString ? a.toString() : "unknown"
            }

            //rest functions
            var restFunction = function(utilData) {
                this.util = utilData;
                this.appender = [];
            };
            restFunction.prototype = {
                add: function(a, b) {
                    var c = this.util.uuid();
                    this.appender.push(b);
                    return c
                }
            };

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
                uuid: function() {}
            };

            mainObject = mainFunction();

            return mainObject;
        }

        /**
         * Automatic error reporting
         * Attach to `window.onerror` events and notify TelemetryAgent when they happen.
         */

        window.onerror = function(errorMessage, errorFile, lineNo, charNo, exception) {
            var data = prepareData(errorMessage, errorFile, lineNo, charNo, exception);
            var params = {};
            self.notify(data, params);
            self.postProblemGa('Exception', getErrorType(errorMessage), getErrorMessage(errorMessage), lineNo);
        };

        /**
         * Returns stack trace for given exception
         * If exception is undefined, it generates an exception.
         */

        function generateStackTrace() {
            var stacktrace;
            var MAX_FAKE_STACK_SIZE = 10;
            var ANONYMOUS_FUNCTION_PLACEHOLDER = "[anonymous]";

            // Try to generate a real stacktrace (most browsers, except IE9 and below).
            try {
                throw new Error("");
            } catch (exception) {
                stacktrace = stacktraceFromException(exception);
            }

            // Otherwise, build a fake stacktrace from the list of method names by
            // looping through the list of functions that called this one (and skip
            // whoever called us).
            if (!stacktrace) {
                var functionStack = [];
                try {
                    var curr = arguments.callee.caller.caller;
                    while (curr && functionStack.length < MAX_FAKE_STACK_SIZE) {
                        var fn = FUNCTION_REGEX.test(curr.toString()) ? RegExp.$1 || ANONYMOUS_FUNCTION_PLACEHOLDER : ANONYMOUS_FUNCTION_PLACEHOLDER;
                        functionStack.push(fn);
                        curr = curr.caller;
                    }
                } catch (e) {

                }

                stacktrace = functionStack;
                stacktrace = functionStack.join("\n");
            }
            return stacktrace;
        }
        // Get the stacktrace string from an exception

        function stacktraceFromException(exception) {
            return exception.stack || exception.backtrace || exception.stacktrace;
        }

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
     * To read cookie.
  
    /**
     * prepareData
     * Prepare Data for sending to server.
     */
        var prepareData = function(errorMessage, errorFile, lineNo, charNo, exception, httpMethod, notificationType, errorTitle, metaData) {

            self.UserAction.attach();

            httpMethod = typeof httpMethod == 'undefined' ? "GET" : httpMethod;
            notificationType = typeof notificationType == 'undefined' ? self.exceptionType : notificationType;

            var apiKey = self.getSetting('apiKey');
            var releaseStage = self.getReleaseStage();
            var context = getContext(errorFile, httpMethod);
            var agentSource = self.agentSource;

            // exceptions
            if (typeof errorTitle == 'undefined')
                var errorClass = getErrorType(errorMessage);
            else
                var errorClass = errorTitle;
            var message = getErrorMessage(errorMessage);
            var file = errorFile;
            var CreatedAt = getCurrentTime();
            var url = window.location.href;
            var userAgent = window.navigator.userAgent;

            var stacktrace = generateStackTrace(exception);
            var metaData = typeof metaData == 'undefined' ? self.customMetaData : metaData;
            if (mainObject.environment) {
                mainObject.environment.timeOnPage = (new Date).getTime() - mainObject.environment.timeOnPage;
            }
            var consoleData = mainObject;
            if (self.allowUserEvent) {
                var data = self.userActions();
                consoleData.userEvents = data;
            }

    
            var data = {
                "events": [{
                    "releaseStage": releaseStage,
                    "apiKey": apiKey,
                    "context": context,
                    "agentSource": agentSource,
                    "consoleData": consoleData,
                    "exceptions": [{
                        "notificationType": notificationType,
                        "errorClass": errorClass,
                        "message": message,
                        "lineNo": lineNo,
                        "file": file,
                        "createdAt": CreatedAt,
                        "stackTrace": stacktrace
                    }],
                    "metaData": {
                        "request": {
                            "url": url,
                            "httpMethod": httpMethod,
                            "ip": "",
                            "userAgent": userAgent
                        },
                        "cookies": document.cookie,
                        "customMetaData": metaData
                    }
                }],
           
                "version": self.configData.version,
                "lang": self.configData.lang,
                "userData": self.settings.userData
            };

            return JSON.stringify(data);
        }

        /**
         * Manual Exception Notification
         * Notify `exception`, typically that you've caught
         * with a `try/catch` statement or that you've generated yourself.
         */
        self.notifyException = function(exception, name) {
            var errorMessage = (name || exception.name) + ": " + (exception.message || exception.description);
            var browser = getBrowser(exception);
            if (browser == 'firefox') {
                var ExceptionFile = getDataFirefoxStack(exception);
            } else if (browser == 'chrome') {
                var ExceptionFile = getDataChromeStack(exception);
            } else {
                var ExceptionFile = {
                    errorFile: window.location.href,
                    lineNo: 1
                }
            }
            var charNo = '';
            var data = prepareData(errorMessage, ExceptionFile.errorFile, ExceptionFile.lineNo, charNo, exception, 'Exception');
            var params = {};
            self.notify(data, params);
        };

        /**
         * Notify custom error to TelemetryAgent
         *
         * @param String errorName    - the name of the error, a short (1 word) string
         * @param String errorMessage - the error message
         * @param Array  metaData     - optional metaData to send with this error
         */
        var telemetryAgentError = function(errorName, errorMessage, metaData) {
                if (self.customError) {

                    var errorObj = new Error("");

                    var stacktrace = generateStackTrace(errorObj);
                    var FilteDetails = stacktrace.split("@").pop().split("at").pop().split("/").pop().split(":");
                    var fileName = '';
                    var lineNumber = '';
                    if (FilteDetails != '') {
                        var filedetails = stacktrace.split("@").pop().split("at").pop();
                        fileName = filedetails.substring(0, filedetails.indexOf('/:'));
                        if (fileName == null || fileName == '') {
                            fileName = filedetails.substring(0, filedetails.indexOf(':', filedetails.indexOf(":") + 1));
                        }
                        lineNumber = FilteDetails[1];
                    }

                    var data = prepareData(errorMessage, fileName, lineNumber, '', errorObj, '', self.errorType, errorName, metaData);

                    // Send the notification to bugsnag
                    self.notify(data);
                    self.postProblemGa('Error', errorName, errorMessage, lineNumber);
                }

            }
            /**
             * Notify custom warning to TelemetryAgent
             *
             * @param String errorName    - the name of the error, a short (1 word) string
             * @param String errorMessage - the error message
             * @param String type         - error/warning
             * @param Array  metaData     - optional metaData to send with this error
             */
        var Warning = function(errorName, errorMessage, metaData) {
            if (self.customError) {
                var errorObj = new Error("");
                var stacktrace = generateStackTrace(errorObj);

                var FilteDetails = stacktrace.split("@").pop().split("at").pop().split("/").pop().split(":");
                var fileName = '';
                var lineNumber = '';
                if (FilteDetails != '') {
                    var filedetails = stacktrace.split("@").pop().split("at").pop();
                    fileName = filedetails.substring(0, filedetails.indexOf('/:'));
                    if (fileName == null || fileName == '') {
                        fileName = filedetails.substring(0, filedetails.indexOf(':', filedetails.indexOf(":") + 1));
                    }
                    lineNumber = FilteDetails[1];
                }

                var data = prepareData(errorMessage, fileName, lineNumber, '', errorObj, '', self.warningType, errorName, metaData);

                // Send the notification to bugsnag
                self.notify(data);
                self.postProblemGa('Warning', errorName, errorMessage, lineNumber);
            }
        }

        /**
         * Notify custom log to TelemetryAgent
         *
         * @param String logMessage    - the error message
         * @param Array  metaData      - optional metaData to send with this error
         */
        var Log = function(logMessage, metaData) {
            if (self.customError) {
                var errorObj = new Error("");
                var stacktrace = generateStackTrace(errorObj);
                var FilteDetails = stacktrace.split("@").pop().split("at").pop().split("/").pop().split(":");
                var fileName = '';
                var lineNumber = '';
                if (FilteDetails != '') {
                    var filedetails = stacktrace.split("@").pop().split("at").pop();
                    fileName = filedetails.substring(0, filedetails.indexOf('/:'));
                    if (fileName == null || fileName == '') {
                        fileName = filedetails.substring(0, filedetails.indexOf(':', filedetails.indexOf(":") + 1));
                    }
                    lineNumber = FilteDetails[1];
                }
                var data = prepareData(logMessage, fileName, lineNumber, '', errorObj, '', self.logType, "Log", metaData);

                // Send the notification to bugsnag
                self.notify(data);
                self.postProblemGa('Log', 'Log', logMessage, lineNumber);
            }
        }
        /**
         * Notify custom event to TelemetryAgent
         *
         * @param String eventMessage - the error message
         * @param Array  metaData     - optional metaData to send with this error
         */
        var Event = function(eventMessage, metaData) {
            if (self.customError) {
                var errorObj = new Error("");
                var stacktrace = generateStackTrace(errorObj);

                var FilteDetails = stacktrace.split("@").pop().split("at").pop().split("/").pop().split(":");
                var fileName = '';
                var lineNumber = '';
                if (FilteDetails != '') {
                    var filedetails = stacktrace.split("@").pop().split("at").pop();
                    fileName = filedetails.substring(0, filedetails.indexOf('/:'));
                 if(fileName == null || fileName == ''){
                      fileName = filedetails.substring(0, filedetails.indexOf(':', filedetails.indexOf(":") + 1));
                }
                    lineNumber = FilteDetails[1];
                }

                var data = prepareData(eventMessage, fileName, lineNumber, '', errorObj, '', self.eventType, "Event", metaData);
                // Send the notification to bugsnag
                self.notify(data);
            }
        }

        /**
         * Return array index for a given value
         * @params   array
         * @params   needle - search value
         */
        var contains = function(array, needle) {
            var i = -1,
                index = -1;

            for (i = 0; i < array.length; i++) {
                if (array[i] === needle) {
                    index = i;
                    break;
                }
            }
            return index;
        }

        /**
         * Return FileName and LineNumber for an excption
         * From stack trace for firefox browser.
         * @param exception  - excpetion object from try catch block.
         */
        var getDataFirefoxStack = function(exception) {
            var stackTrace = exception.stack;
            var firstLine = stackTrace.split('\n');
            var fileName = firstLine[0].split('@');
            var fileDetails = fileName[1].split(':');
            var ExceptionFile = {
                errorFile: fileDetails[0] + fileDetails[1],
                lineNo: fileDetails[2]
            }
            return ExceptionFile;
        }

        /**
         * Return FileName and LineNumber for an excption
         * From stack trace for Google Chrome browser.
         * @param exception  - excpetion object from try catch block.
         */
        var getDataChromeStack = function(exception) {
            var stackTrace = exception.stack;
            var firstLine = stackTrace.split('\n');
            var fileName = firstLine[1].split('(');
            var fileNameSplit = fileName[1].split(')');
            var fileDetails = fileNameSplit[0].split(':');
            var ExceptionFile = {
                errorFile: fileDetails[0] + fileDetails[1],
                lineNo: fileDetails[2]
            }
            return ExceptionFile;
        }

        /**
         * Return Settings by name
         */
        self.getSetting = function(name) {

            var setting = self.settings[name] !== undefined ? self.settings[name] : false;
            return setting;
        }
        /**
         * Send to Google analytics.
         */
        self.postProblemGa = function(category, action, label, value) {
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
         * Return Release Stage
         */
        self.getReleaseStage = function() {
            var name = 'releaseStage';
            var setting = self.settings[name] !== undefined ? self.settings[name] : "Development";
            return setting;
        }

        /**
         * Return Context with url and method
         */
        var getContext = function(url, method) {
            method = typeof method == 'undefined' ? 'window.onerror' : method;
            var res = url.replace(window.location.origin, "");
            var context = method + " " + res;
            return context;
        }

        /**
         * Return Exception type
         */
        var getErrorType = function(message) {
            var res = message.split(":");
            if (typeof res[1] == 'undefined') {
                return "window.onerror";
            } else {
                return (res[0]);
            }
        }

        /**
         * Return Erron Message.
         */
        var getErrorMessage = function(message) {
            var res = message.split(":");
            if (typeof res[1] == 'undefined') {
                return (res[0]);
            } else {
                return (res[1]);
            }
        }

        /**
         * Return Current Time
         */
        var getCurrentTime = function() {
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
         * Return Browser Name with exception object.
         */
        var getBrowser = function(e) {
            if (e['arguments'] && e.stack) {
                return 'chrome';
            } else if (e.stack && e.sourceURL) {
                return 'safari';
            } else if (e.stack && e.number) {
                return 'ie';
            } else if (e.stack && e.fileName) {
                return 'firefox';
            } else if (e.message && e['opera#sourceloc']) {
                if (!e.stacktrace) {
                    return 'opera9'; // use e.message
                }
                if (e.message.indexOf('\n') > -1 && e.message.split('\n').length > e.stacktrace.split('\n').length) {
                    return 'opera9'; // use e.message
                }
                return 'opera10a'; // use e.stacktrace
            } else if (e.message && e.stack && e.stacktrace) {
                if (e.stacktrace.indexOf("called from line") < 0) {
                    return 'opera10b'; // use e.stacktrace, format differs from 'opera10a'
                }
                // e.stacktrace && e.stack -> opera11
                return 'opera11'; // use e.stacktrace, format differs from 'opera10a', 'opera10b'
            } else if (e.stack && !e.fileName) {
                // Chrome 27 does not have e.arguments as earlier versions,
                // but still does not have e.fileName as Firefox
                return 'chrome';
            }
            return 'other';
        };
        /**
         * Set which release stages should be allowed to notify TelemetryAgent
         * eg array("production", "development")
         *
         * @param Array notificationReleaseStages array of release stages to notify for
         */
        var setNotifyReleaseStages = function(notificationReleaseStages) {
            for (var i = notificationReleaseStages.length - 1; i >= 0; i--) {
                notificationReleaseStages[i] = notificationReleaseStages[i];
            };
            self.notifyReleaseStages = notificationReleaseStages;
            self.notifyReleaseStageStatus = true;
        }

        /**
         * To check the notification release stage is set or not
         */
        self.checkNotifyReleaseStages = function() {
            if (self.notifyReleaseStageStatus) {
                var releaseStageName = self.settings.releaseStage;
                if (contains(self.notifyReleaseStages, releaseStageName) < 0) {
                    self.shouldNotify = false;
                }
            }
        }

        /**
         * Summary : Save Exception Activity
         * Notes : Save Exception thrown from project
         * @param body - Notify credentials
         */
        self.notify = function(body, params) {
            params = typeof params !== 'undefined' ? params : {};
            self.checkNotifyReleaseStages();
            var getNotificationType = JSON.parse(body);
            var notificationType = getNotificationType["events"][0]["exceptions"][0]["notificationType"];
            var bugCount = 0;
            var flag = 0;
            var pageURL = document.URL;
            var data = getNotificationType["events"][0]["exceptions"][0]["Message"] + ',' +
                getNotificationType["events"][0]["exceptions"][0]["LineNo"] + ',' +
                pageURL;

            if (typeof self.errorReportingLimit != 'undefined') {
                if (notificationType == self.exceptionType || notificationType == self.errorType || notificationType == self.logType || notificationType == self.warningType || notificationType == self.eventType) {} else {
                    flag = 1;
                }
            } else {
                flag = 1;
            }


            if (!self.shouldNotify) {
                return;
            }
            if (flag == 1 || (typeof(self.errorReportingLimit) != 'undefined' && bugCount <= self.errorReportingLimit)) {
                var headJson = {};
                var ajaxParams = {};
                ajaxParams.httpHeaders = headJson;
                ajaxParams.httpMethod = 'POST';
                ajaxParams.params = params;
                if (typeof body !== "undefined") {
                    ajaxParams.data = body;
                }

                self.sendServiceData(ajaxParams);
            }
        };

        /**
         * Summary : Perform Data Transfer Service
         * @param ajaxParams - ajax parameters
         */
        self.sendServiceData = function(ajaxParams) {
            var serverParams = {};

            if (ajaxParams.httpMethod) {
                serverParams.type = ajaxParams.httpMethod;
            }
            if (ajaxParams.data) {
                serverParams.data = ajaxParams.data;
            }
            if (ajaxParams.params.async) {
                serverParams.async = ajaxParams.params.async;
            } else {
                serverParams.async = self.configData.async;
            }
            if (ajaxParams.params.dataType) {
                serverParams.dataType = ajaxParams.params.dataType;
            } else {
                serverParams.dataType = self.configData.dataType;
            }
            if (ajaxParams.httpHeaders) {
                serverParams.headers = ajaxParams.httpHeaders;
            }
            if (ajaxParams.params.crossDomain) {
                serverParams.crossDomain = ajaxParams.params.crossDomain;
            } else {
                serverParams.crossDomain = self.configData.crossDomain;
            }
            if (ajaxParams.params.contentType) {
                serverParams.contentType = ajaxParams.params.contentType;
            } else {
                serverParams.contentType = self.configData.contentType;
            }
            if (ajaxParams.params.errorCallback) {
                serverParams.error = ajaxParams.params.errorCallback;
            }
            serverParams.success = ajaxParams.params.successCallback;

            //commented to make activitydata in json
            var data = serverParams.data;
            var jQueryIdentifier;


            var microServiceParams = self.microServiceParams;
            microServiceParams.activityDataStructured = data;
            microServiceParams.activityName = "Activity";
            microServiceParams.activityType = "Activity";
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
            var jsonObj = JSON.parse(ajaxParams.data);
            microServiceParams.activityTag = jsonObj['events'][0]['exceptions'][0]['errorClass'];
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

            jQueryIdentifier = window.jQuery;
            jQueryIdentifier.ajax({
                type: 'POST',
                dataType: serverParams.dataType,
                crossDomain: serverParams.crossDomain,
                async: true,
                cache: false,
                url: microServiceUrl,
                data: JSON.stringify(microServiceParams),
                contentType: 'application/json',
                beforeSend: function(request) {
                    request.setRequestHeader("OperatedBy", username);
                    request.setRequestHeader("ServiceId", config.settings.serviceId);
                },
                success: function(data) {},
                error: function(jqXHR, textStatus, errorThrown) {

                    return false;
                }
            });
        };

        /**
         * Set custom meta data
         * This function set the user given meta data.
         * @param   object  customMetaData
         */
        var setCustomMetaData = function(customMetaData) {
            if (typeof(customMetaData) == 'object' && customMetaData !== "null" && customMetaData !== "undefined") {
                self.customMetaData = customMetaData;
            }
        };


        /**
         * Set limit error sending count
         * This function set limit error sending count.
         * @param string pageUrl
         */
        self.setLimitBugCountData = function(pageURL) {
            var pageUrlString = encodeURI(pageURL);
            // pageUrlString = '"' + pageUrlString + '"';
            pageUrlString = pageUrlString;
            var checkBugCount = self.telemetryGetCookie(pageUrlString);
            if (checkBugCount != "") {
                checkBugCount = parseInt(checkBugCount) + 1;
                self.telemetrySetCookie(pageUrlString, checkBugCount);
            } else {
                self.telemetrySetCookie(pageUrlString, 1);
            }
            return self.telemetryGetCookie(pageUrlString);
        };
        self.telemetrySetCookie = function(cname, cvalue) {
            var expires = "";
            var date = new Date();
            var midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
            expires = "expires=" + midnight.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;

        };

        self.telemetryGetCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1);
                if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
            }
            return "";
        };
        return {
            Error: telemetryAgentError,
            Warning: Warning,
            Event: Event,
            Log: Log, 
            setCustomMetaData:setCustomMetaData,
            setNotifyReleaseStages:setNotifyReleaseStages
                     
    };    
        
    }

    return {
        getInstance: function(config) {
            if (!instance) {
                instance = createInstance(config);
            }
            return instance;
        }
    };
})();