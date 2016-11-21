/**
 * This is the top level.
 *
 * Class TelemetryAgent
 *
 *Registering settings to redirect into corresponding files
 *Configuration settings of statistics, error and support widget in this class
 */
import { configSettings } from './agent_config';
import { TelemetryAgentPageData } from './agent_pagedata';
import { TelemetryAgentProblems } from './agent_problems';
import { TelemetryAgentSupportWidget } from './agent_support';


export var TelemetryAgent = (function() {
    var instance;

    var createInstance = function(options) {
        this.apiKey = options.apiKey;
        this.releaseStage = options.releaseStage;
        this.userDetails = (typeof options.userData == 'function') ? options.userData() : options.userData;
        //abstract function
        var pageDataDecl = function() {
            console.log("Page data not enabled")
        };
        var eventDecl = function() {
            console.log("Check whether both custom statistics and pagedata is enabled")
        };
        var problemDecl = function() {
            console.log("Problems not enabled")
        };
        var feedbackDecl = function() {
            console.log("Feedback not enabled")
        };
        this.pageData = {
            statCount: pageDataDecl,
            statValue: pageDataDecl,
            Event: eventDecl,
            setNotifyLogin: pageDataDecl,
            setNotifyLogout: pageDataDecl
        };
        this.problems = {
            Error: problemDecl,
            Warning: problemDecl,
            Event: problemDecl,
            Log: problemDecl
        };
        this.supportWidget = {
        	widgetApiPost: feedbackDecl 
        }

        var config = configSettings();

        if (config.problems !== undefined && config.pageData !== undefined && config.supportWidget !== undefined) {

            config.settings = {
                version: "4.1.18",
                lang: "js",
                microServiceUrl: 'https://test-activity-tracking.netspective.com/api/accounts/7/activities.json',
                uploadServiceUrl: 'https://test-activity-attachment.netspective.com/api/accounts/7/attachment/file/upload.json',
                serviceId: 1,
                pluginUrl: config.path.pluginUrl !== undefined ? config.path.pluginUrl : 'https://wtapp.netspective.com/app/lib',
                contentType: "application/json",
                dataType: "json",
                async: true,
                processData: true,
                crossDomain: true,
                bulkData: false,
                crossDomain: true,
                notifyReleaseStageStatus: false, //initially false
                shouldNotify: true, // initially true
                localStorageSize: 4500, // MAX Local storage size. (5 MB per origin in Google Chrome, Mozilla Firefox, and Opera; 10 MB per storage area in Internet Explorer and Safari).
                agentSource: 2,
                exceptionType: 1,
                errorType: 2,
                logType: 3,
                warningType: 4,
                eventType: 5,
                loginRequestType: 1,
                logoutRequestType: 2,
                errorReportingLimit: 5,
                configSettingsActivityType: 'ConfigSettings',
                statisticType: 'Statistics',
                actvityType: 'Activity',
                problemsEnable: config.problems.enable !== undefined ? config.problems.enable : false,
                pageDataEnable: config.pageData.enable !== undefined ? config.pageData.enable : false,
                supportWidgetEnable: config.supportWidget.enable !== undefined ? config.supportWidget.enable : false,
                visitorTrackerEnable: config.visitorTracking.enable !== undefined ? config.visitorTracking.enable : false,
                googleAnalyticsEnable: config.googleAnalytics.enable !== undefined ? config.googleAnalytics.enable : false,
                npsWidgetEnable: config.supportWidget.npsEnable !== undefined ? config.supportWidget.npsEnable : false,
                ajaxStatisticsEnable: config.pageData.allowAjaxStatistics !== undefined ? config.pageData.allowAjaxStatistics : false
            }
            var now = new Date();
            var now_utc = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds());
            var month = ('0' + (parseInt(now_utc.getMonth()) + 1)).slice(-2);
            var date = ('0' + (now_utc.getDate())).slice(-2);
            var hour = ('0' + (now_utc.getHours())).slice(-2);
            var minute = ('0' + (now_utc.getMinutes())).slice(-2);
            var seconds = ('0' + (now_utc.getSeconds())).slice(-2);
            var createdAT = now_utc.getFullYear() + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + seconds;
            var createdATUTC = now_utc.getTime();
            var createdTZ = now.toString().replace(/^.*GMT.*\(/, "").replace(/\)$/, "");
            var rand = Math.random().toString(36).slice(2).substring(1);
            var timestamp = (new Date().getTime() / 1000).toFixed(0);
            config.microServiceParams = {
                activityName: "",
                activityLevel: "",
                activityDescription: "",
                activityType: "",
                activityTag: "",
                hierarchyPath: "",
                scope: "",
                activitySeedName: "",
                source: "",
                destination: "",
                activityDataStructured: "",
                activityData: "",
                createdAt: createdAT,
                createdAtTz: createdTZ,
                createdAtGmt: createdATUTC,
                activityStatus: "",
                createdBy: "",
                activitySourceUniqueId: rand + timestamp,
                version: "",
                syncNow: "",
                relatedActivityId: "",
                parentActivityId: "",
                sessionUniqueId: "",
                organizationId: 2,
                projectId: "",
                environmentId: ""
            }

            config.register = {
                apiKey: this.apiKey,
                releaseStage: this.releaseStage,
                userDetails: this.userDetails
            }

            if ((typeof TelemetryAgentPageData != 'undefined')) {
                if (config.settings.pageDataEnable || config.settings.visitorTrackerEnable || (document.cookie.indexOf("telemetryAgentConfigSettingsSend") == -1)) {
                    //create an instance of page data
                    pageData = TelemetryAgentPageData.getInstance(config);
                    if (config.settings.pageDataEnable) {
                        //send statistics data
                        pageData.statisticData(true, function() {
                            if (config.settings.ajaxStatisticsEnable) {
                                //send statistics call for each statistics call
                                pageData.telemetryAgentAjaxStatistics();
                            }
                        });
                    }
                    if (config.settings.visitorTrackerEnable) {
                        //send visitor tracking data
                        if (document.cookie.indexOf("telemetryAgentvisitedOn") == -1) {
                            pageData.vistiedOn(true);
                        }
                    }
                    if (document.cookie.indexOf("telemetryAgentConfigSettingsSend") == -1) {
                        var configSettingsValue = {
                                "problems": config.problems,
                                "pageData": config.pageData,
                                "supportWidget": config.supportWidget,
                                "visitorTracking": config.visitorTrackerEnable,
                            }
                            // send config settings data
                        pageData.sendConfigData(configSettingsValue, config.settings.configSettingsActivityType, function(status){
                        	if (status) {
                        		document.cookie = "telemetryAgentConfigSettingsSend=true; expires=0; path=/";
                        	};
                        });
                    }
                }

            }

            //To send automatic js errors
            if ((typeof TelemetryAgentProblems != 'undefined') && config.settings.problemsEnable) {
                //create an instance of problems
                problems = TelemetryAgentProblems.getInstance(config);

            }


            if ((typeof TelemetryAgentSupportWidget != 'undefined') && (config.settings.supportWidgetEnable || config.settings.npsWidgetEnable)) {
                //create an instance of Support Widget
                supportWidget = TelemetryAgentSupportWidget.getInstance(config);
                if (!config.supportWidget.widgetApi) {
                	supportWidget.init();
                }
            }
            // To send Google Analytics
            if (config.settings.googleAnalyticsEnable) {
                function TelemetryAgentGoogleAnalytics() {
                    var self = this;
                    self.trackingId = config.googleAnalytics.trackingId;
                    (function(i, s, o, g, r, a, m) {
                        i['GoogleAnalyticsObject'] = r;
                        i[r] = i[r] || function() {
                            (i[r].q = i[r].q || []).push(arguments)
                        }, i[r].l = 1 * new Date();
                        a = s.createElement(o),
                            m = s.getElementsByTagName(o)[0];
                        a.async = 1;
                        a.src = g;
                        m.parentNode.insertBefore(a, m)
                    })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
                    ga('create', self.trackingId, 'auto');
                    self.postPageview = function() {
                        ga('send', 'pageview');
                    }
                }
                var telemetryGa = new TelemetryAgentGoogleAnalytics();
                window.addEventListener("load", telemetryGa.postPageview, false);
            }

        }
        return {
            supportWidget: supportWidget,
            problems: problems,
            pageData: pageData
        };

    }

    return {
        getInstance: function(config) {
            if (!instance) {
                instance = createInstance.bind(this, config);
            }
            return instance;
        }
    };
})();