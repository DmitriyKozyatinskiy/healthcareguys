/**
 * Class configSettings
 *
 * Config file for user
 * Configuration settings of statistics, error and support widget
 * User can set below given properties of sdk in this class
 *
 * Version 4.1.18
 */
function configSettings() {

    this.productNameShort = "Watchtower";
    this.productName = "Netspective Watchtower";

    /*support widget attributes*/

    var supportWidget = {
            enable: true,
            widgetApi:true,
            supportHintText: "",
            supportHintTextOne: "",
            supportHintTextTwo: "",
            supportWidgetLabelIcon: "",
            supportWidgetIcon: "", //service/public/images/Icon.png
            supportTitle: this.productNameShort + ' Support',
            supportFormTitle: 'Submit Support Request in ' + this.productNameShort,
            supportType: "",
            supportLabelPosition: 'centerRight',
            supportCaptureWebPageEnable: false,
            supportCaptchaEnable: false,
            npsEnable: false,
            npsTitle: 'How likely is it that you would recommend our site to a friend or a colleague?',
            npsBoxDelay: 240, //Seconds
            npsSuccessMessage: 'Thank you for your help',
            npsWidgetCss: {
                backgroundColor: "#840C08"

            },
            supportTitleCSS: {
                backgroundColor: "#840C08",
                color: "#FFFFFF",
                fontSize: "17px"
            },
            supportTypes: ["Report A Problem", "Request a Feature", "Ask A Question", "Give Praise", "Share An Idea"]
        }
    /*page data attributes*/
    var pageData = {
        enable: true,
        customStatistics: true,
        allowNetworkCapture: false,
        allowEnvironmentCapture: false,
        allowAjaxStatistics: false
    }

    /*exception attributes*/
    var problems = {
            enable: false,
            allowNetworkCapture: false,
            customError: false,
            allowConsoleCapture: false,
            allowEnvironmentCapture: false,
            allowUserEvent: false,
            notifyReleaseStages: ['Development', 'Production', 'Staging'] //change it with setNotifyReleaseStages
        }
    /*visitor tracking*/
    var visitorTracking = {
            enable: true,
        }
    /*Google Analytics */
    var googleAnalytics = {
        enable: false,
        trackingId: 'UA-93818-10'
    }
    var path = {
        pluginUrl: "", //https://your-sitename/lib/telemetry_agent
    }
    var config = {
        'supportWidget': supportWidget,
        'problems': problems,
        'pageData': pageData,
        'visitorTracking': visitorTracking,
        'googleAnalytics': googleAnalytics,
        'path': path
    }

    return config;
}