/**
 * TelemetryAgent supportWidget
 * Javascript Library
 * Version 4.1.18
 */
export var TelemetryAgentSupportWidget = (function() {
    var instance;

    var createInstance = function(config) {

        var self = this;

        this.configData = config.settings;

        this.register = config.register;

        $options = config.supportWidget;
        this.$widgetOptions = $options || {};

        var files;
        self.microServiceUrl = config.settings.microServiceUrl;
        self.uploadServiceUrl = config.settings.uploadServiceUrl;
        self.microServiceParams = config.microServiceParams;
        this.supportWidgetEnable = ($options.enable === false) ? false : true;
        this.npsWidgetEnable = ($options.npsEnable === false) ? false : true;
        this.version = this.configData.version;
        this.PLUGIN_URL = this.configData.pluginUrl;
        this.SECURIMAGE_END_POINT = 'https://wt.opsfol.io/api/wtapp' + '/secure-image';
        //widget Params
        self.screenshotUpload = true;
        self.attachmentUpload = true;
        this.params = {
            mainId: "telemetryAgentFeedbackWidgetModal",
            mainClass: "telemetry-agent-feedback-widget-modal",
            mainClassContainer: "telemetry-agent-feedback-modal-container",
            feedbackOverlayClass: "telemetry-agent-feedback-backdrop",
            labeClass: "telemetryAgentFeedbackLabel",
            feedbackBody: "telemetry-agent-feedback-body",
            formId: "telemetryAgentInsertFeedbackForm",
            formClass: "telemetryAgentInsertFeedbackForm",
            formName: "telemetryAgentInsertFeedbackForm",
            submitButtonId: "telemetryAgentPostFeedback",
            captchaTextId: "telemetryAgentCaptchaCode",
            feedbackTypeTextName: "feedbackType",
            feedbackTypeId: "telemetryAgentFeedbackType",
            feedbackUserTextName: "feedbackUser",
            feedbackUserTextId: "telemetryAgentFeedbackUser",
            feedbackEmailTextName: "feedbackUserEmail",
            feedbackEmailTextId: "telemetryAgentFeedbackUserEmail",
            feedbackSubjectTextName: "feedbackSubject",
            feedbackSubjectId: "telemetryAgentFeedbackSubject",
            feedbackDescriptionTextName: "feedbackDesc",
            feedbackDescriptionId: "telemetryAgentFeedbackDesc",
            captchaImage: "captchaImage",
            changeCaptchaImageId: "telemetryAgentChangeCaptchaImage",
            changeCaptchaImageText: "<div class='refresh-icon'></div>",
            attachmentText: "Attachment",
            attachmentTextName: "feedbackAttachment",
            attachmentClassName: "telemetry-agent-feedback-attachment",
            attachmentTextId: "telemetryAgentFeedbackAttachmentId",
            attachmentMaxAllowedSize: 2097152,
            validAttachmentExtensions: ["txt", "jpg", "jpeg", "gif", "png", "ico", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "zip", "rar", "pdf"],
            invalidAttachmentExtensions: ["exe", "dll", "bin", "bat", "db", "ini"],
            captureImageTextId: "telemetryAgentCaptureImg",
            captchaImageId: "telemetryAgentCaptchaId",
            captureImageTextName: "Screenshot",
            screenCaptureResolutionLimit: 768,
            captchaTextId: "telemetryAgentCaptchaCode",
            captchaTextName: "captchaCode",
            captchaTextFieldId: "captchaText",
            captchaTextValue: "captchaTextValue",
            captchaErrorMessage: "Captcha is incorrect",
            userPlaceholder: "Enter Your Name",
            emailPlaceholder: "Enter Your Email ID",
            subjectPlaceholder: "Enter Subject",
            descriptionPlaceholder: "Enter Description",
            captchTextPlaceholder: "Enter Captcha",
            successMessage: "Message send successfully."
        };
        //Default Options
        this.$defaults = {
            supportCaptchaEnable: true, // captcha enable/disable boolean
            supportCaptureWebPageEnable: true, // webpage screen shot enable/disable boolean
            supportLabelPosition: 'centerLeft', // Label position
            supportTitle: 'Support & Feedback', // title string;
            supportHintText: '',
            supportHintTextOne: '',
            supportHintTextTwo: '',
            widgetApi: false,
            npsTitle: 'How likely is it that you would recommend our site to a friend or a colleague?',
            npsFormId: 'npsBoxHide',
            npsBoxDelay: 240, // Seconds
            npsBoxMarginRight: 674,
            npsBoxFade: 1000,
            npsSuccessMessage: 'Thank you for your help!',
            supportTitleCSS: {
                backgroundColor: "#840C08",
                color: "#FFFFFF",
                fontSize: "15"
            },
            npsWidgetCss: {
                backgroundColor: "#840C08"

            },
            supportTypes: [
                "Report A Problem",
                "Request a Feature",
                "Ask A Question",
                "Give Praise",
                "Share An Idea"
            ],
            supportFormTitle: "TelemetryAgent Support Form",
            supportWidgetIcon: '',
            supportWidgetLabelIcon: '',
            // z-index for the blocking overlay
            baseZ: 1000
        };
        this.userDefaultData = {
            name: '',
            email: ''
        };
        /**
         * To initialize TelemetryAgent support Widget
         * @params string  apiKey
         */
        this.apiKey = this.register.apiKey;
        this.releaseStage = this.register.releaseStage;
        self.userData = (typeof this.register.userDetails == 'function') ? this.register.userDetails() : this.register.userDetails;
        if (typeof self.register.userDetails == 'undefined' || self.register.userDetails == '')
            self.register.userDetails = {};
        self.isNps = false;

        /******** SET LABEL OPTIONS ********/
        this.createCaptcha = function() {
            var alpha = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z');
            var i;
            for (i = 0; i < 6; i++) {
                var a = alpha[Math.floor(Math.random() * alpha.length)];
                var b = alpha[Math.floor(Math.random() * alpha.length)];
                var c = alpha[Math.floor(Math.random() * alpha.length)];
                var d = alpha[Math.floor(Math.random() * alpha.length)];
                var e = alpha[Math.floor(Math.random() * alpha.length)];
                var f = alpha[Math.floor(Math.random() * alpha.length)];
                var g = alpha[Math.floor(Math.random() * alpha.length)];
            }
            var code = a + ' ' + b + ' ' + ' ' + c + ' ' + d + ' ' + e + ' ' + f + ' ' + g;
            jQuery('#' + self.params.captchaTextFieldId).val(code);
        }
        this.setLabelOptions = function() {


            var zIndex = self.$defaults.baseZ;
            this.titleCSS = self.options.supportTitleCSS || {};

            this.supportWidgetLabelIcon = self.options.supportWidgetLabelIcon || {};

            var $label = jQuery('<div  data-html2canvas-ignore="" href="javascript:void(0);"  class="' + self.params.labeClass + '" style="display:none;z-index:' + (zIndex + 10) + ';" target="_self"><div class="iconholder"></div><div class="fLeft">' + (self.options.supportTitle || '&nbsp;') + '</div></div>');

            // Adding CLASS 
            $label.addClass(self.options.supportLabelPosition);

            // Adding CSS 
            $label.css(this.titleCSS);

            $label.find('.iconholder').css('background', 'url(' + this.supportWidgetLabelIcon + ')  no-repeat scroll center center rgba(0, 0, 0, 0)');
            var lineHeight = this.titleCSS.fontSize.replace("px", "");
            $label.css('line-height', (parseInt(lineHeight) + 6) + 'px');

            jQuery('body').append($label);
        };
        self.optionArray = [];
        self.paramsArray = [];
        /******** Main function ********/
        this.main = function(config, label, submitButtonId) {

            jQuery(document).ready(function($) {


                telemetryLoadSupportWidget = function(options) {
                    self.options = options;
                    if (self.supportWidgetEnable) {



                        self.userSessionData = $.extend({}, self.userDefaultData, self.userData);
                        /******* LOAD WIDGET CSS *******/
                       

                    


                        /*** LOAD JQUERY.VALIDATE JS ***/
                        if ($.validator === undefined) {
                            var validateJs = document.createElement('script');
                            validateJs.setAttribute("type", "text/javascript");
                            validateJs.setAttribute("src",
                                self.PLUGIN_URL + "/includes/js/plugins/validation/jquery.validate.min.js");
                            document.getElementsByTagName('head')[0].appendChild(validateJs);
                        }



                        if (window.html2canvas === undefined) {
                            /*** LOAD HTML2CANVAS JS ***/
                            var html2canvasJs = document.createElement('script');
                            html2canvasJs.setAttribute("type", "text/javascript");
                            html2canvasJs.setAttribute("src",
                                self.PLUGIN_URL + "/includes/js/plugins/html2canvas/html2canvas.js");
                            document.getElementsByTagName('head')[0].appendChild(html2canvasJs);
                        }
                        //Setting options
                        self.setLabelOptions(self.options);

                        jQuery(document).click(function(e) {
                            if (!jQuery(e.target).is('#' + self.params.formId + ', #' + self.params.formId + ' *') && !jQuery(e.target).is('#' + self.params.npsFormId + ', #' + self.params.npsFormId + ' *')) {
                                jQuery('.telemetry-agent-feedback-backdrop,#telemetryAgentFeedbackWidgetModal').hide();
                                jQuery('body').removeClass('telemetry-agent-feedback-modal-open');
                            }
                        });
                        jQuery('.' + self.params.labeClass).unbind('click').bind('click', function(event) {
                            index = self.optionArray[$(this).attr("class").split(' ')[0]];
                            if (index) {
                                self.options = self.optionArray[$(this).attr("class").split(' ')[0]];
                            } else {
                                self.options = self.optionArray[self.params.labeClass];
                            }
                            event.stopPropagation();

                            jQuery('body' + self.params.mainId).remove();

                            jQuery('#' + self.params.mainId).remove();

                            jQuery('.' + self.params.feedbackOverlayClass).remove();

                            var userNew = '';
                            var loadCaptchaImage = '',
                                userBlock;

                            if (self.options.supportCaptchaEnable) {
                                loadCaptchaImage = '' +
                                    '<div class="col coloffset-25 col-75 ">' +
                                    '<input type="text" id="' + self.params.captchaTextFieldId + '" name="captchaText" readonly onfocus="this.blur()"/>' +
                                    '<div id="refreshButton" class="refresh-icon"></div>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="telemetry-agent-feedback-form-group">' +
                                    '<div class="col coloffset-25 col-75">' +
                                    '<input type="text" required placeholder="' + self.params.captchTextPlaceholder + '" class="form-control input-width-large" name="captchaTextValue" id="' + self.params.captchaTextValue + '">' +
                                    '</div>' +
                                    '</div>';
                                setTimeout(function() {
                                    self.createCaptcha();
                                }, 0);

                            }
                            if (self.userSessionData.name != '' && self.userSessionData.email != '' && self.userSessionData.name != null && self.userSessionData.email != null) {
                                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                                var isEmail = re.test(self.userSessionData.name);
                                userBlock = '' +
                                    '<div class="telemetry-agent-feedback-form-group">' +
                                    '<div class="col col-100 ">';
                                if (self.userSessionData.name) {
                                    if (isEmail)
                                        userBlock += 'Welcome, <span>' + self.userSessionData.name + '</span><input  type="hidden" name="' + self.params.feedbackUserTextName + '" id="' + self.params.feedbackUserTextId + '" value="' + self.userSessionData.name + '" />';
                                    else
                                        userBlock += 'Welcome, <span class="capitalize-text">' + self.userSessionData.name + '</span><input  type="hidden" name="' + self.params.feedbackUserTextName + '" id="' + self.params.feedbackUserTextId + '" value="' + self.userSessionData.name + '" />';
                                } else {
                                    if (self.userSessionData.email) {
                                        userBlock += 'Welcome, <span>' + self.userSessionData.email.replace(/^(.+)@(.+)$/g, '$1') + '</span><input  type="hidden" name="' + self.params.feedbackUserTextName + '" id="' + self.params.feedbackUserTextId + '" value="' + self.userSessionData.email.replace(/^(.+)@(.+)$/g, '$1') + '" />';
                                    }
                                }
                                if (self.userSessionData.email) {
                                    userBlock += '<input  type="hidden" name="' + self.params.feedbackEmailTextName + '" id="' + self.params.feedbackEmailTextId + '" value="' + self.userSessionData.email + '" />';
                                }
                                userBlock += '</div>' +
                                    '</div>';
                            } else {
                                userBlock = ''
                                userNew = '<div class="telemetry-agent-feedback-form-group">' +
                                    '<label class="col  control-label">Name: <font color="red">*</font></label>' +
                                    '<div class="col col-75">' +
                                    '<input type="text"  name="' + self.params.feedbackUserTextName + '" id="' + self.params.feedbackUserTextId + '" placeholder="' + self.params.userPlaceholder + '" class="form-control input-width-large required">' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="telemetry-agent-feedback-form-group">' +
                                    '<label class="col  control-label">Email: <font color="red">*</font></label>' +
                                    '<div class="col col-75">' +
                                    '<input type="text" required data-validation="email" name="' + self.params.feedbackEmailTextName + '" id="' + self.params.feedbackEmailTextId + '" placeholder="' + self.params.emailPlaceholder + '" class="form-control input-width-large  email required">' +
                                    '</div>' +
                                    '</div>';
                            }
                            hintBlock = '';
                            if (self.options.supportHintText != '') {
                                hintBlock += '<span style="">' + self.options.supportHintText + '</span>';
                            }
                            hintBlock1 = '';
                            if (self.options.supportHintTextOne != '') {
                                hintBlock1 += '<span style="">' + self.options.supportHintTextOne + '</span>';
                            }
                            hintBlock2 = '';
                            var Blockhint2 = '';
                            if (self.options.supportHintTextTwo != '') {

                                hintBlock2 += '<span style="">' + self.options.supportHintTextTwo + '</span>';

                                Blockhint2 +=
                                    '<div class="telemetry-agent-feedback-form-group grey">' +
                                    '<div class="col col-100">' +
                                    hintBlock2 +
                                    '</div>' +
                                    '</div>';



                            }
                            var telemetryAgentFeedbackType = '',
                                newOption = '';

                            if (self.options.supportTypes.length <= 0) {
                                self.options.supportTypes = self.$defaults.supportTypes;
                            }



                            var $html = '' +
                                '<div class="fade ' + self.params.mainClass + '" data-html2canvas-ignore="" id="' + self.params.mainId + '" >' +
                                '<div class="' + self.params.mainClassContainer + '">' +
                                '<form data-parsley-validate name="' + self.params.formName + '" id="' + self.params.formId + '" method="POST" class="feedback-form"   enctype="multipart/form-data">' +
                                '<div class="feedback-modal-content">' +
                                '<div class="fade-block"></div>' +
                                '<div class="loader-pleasewait"></div>' +
                                '<div class="feedback-modal-header">' +
                                '<button type="button" class="btn btn-default close-btn telemetry-agent-feedback-close "   data-dismiss="modal">&#10006;</button>' +
                                '<h4 class="feedback-modal-title">' + self.options.supportFormTitle + '</h4>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-modal-body ' + self.params.feedbackBody + '">   ' +
                                '<div class="feedback-form-user feedback-welcome-txt">' +
                                '<div class="">' +
                                userBlock +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group grey">' +
                                '<div class="col col-100">' +
                                hintBlock +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group red">' +
                                '<div class="col col-100">' +
                                hintBlock1 +
                                '</div>' +
                                '</div>' +
                                '<div class="feedback-form-user ">' +
                                '<div class="">' +
                                userNew +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group ">' +
                                '<label class="col  control-label">Support Type: <font color="red">*</font></label>' +
                                '<div class="col col-75">' +
                                '<select  required name="' + self.params.feedbackTypeTextName + '" id="' + self.params.feedbackTypeId + '" class="form-control input-width-large">' +
                                '<option value="" selected="">-Select Type-</option>' + telemetryAgentFeedbackType +
                                '</select>' +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group">' +
                                '<label class="col  control-label">Subject: <font color="red">*</font></label>' +
                                '<div class="col col-75">' +
                                '<input type="text" required name="' + self.params.feedbackSubjectTextName + '" id="' + self.params.feedbackSubjectId + '" placeholder="' + self.params.subjectPlaceholder + '" class="form-control input-width-large">' +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group">' +
                                '<label class="col  control-label">Description: <font color="red">*</font></label>' +
                                '<div class="col col-75">' +
                                '<textarea required rows="3" cols="5" name="' + self.params.feedbackDescriptionTextName + '" id="' + self.params.feedbackDescriptionId + '" placeholder="' + self.params.descriptionPlaceholder + '" class="form-control"></textarea>' +
                                '</div>' +
                                '</div>' +
                                '<div>' +
                                '<label class="col  control-label"></label>' +
                                '<div class="telemetry-agent-feedback-form-group">' +
                                '<font size="2">(<font color="red">*</font>) denotes required fields</font>' +
                                Blockhint2 +
                                '</div>' +
                                loadCaptchaImage +

                                '<div class="telemetry-agent-feedback-form-group">' +
                                '<div class="col coloffset-25 col-75"> ' +
                                '<div class="telemetry-agent-fileinput fLeft prelative"  target="_self">' +
                                '<input type="hidden" value="" >' +
                                '<div class=" btn btn-info btn-sm btn-file">' +
                                '<div class="telemetry-agent-fileinput-new" id="telemetry-agent-widget-feedback-pickfiles">' +
                                '<div class="clip-icon">' + self.params.attachmentText + '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-fileinput-exists">' +
                                '<div class="clip-icon"> Remove Attachment</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-attachment-filename"></div>' +
                                '<a style="float: none"  class="telemetry-agent-fileinput-exists close-icon" href="javascript:void(0);"></a>' +
                                '</div> ' +
                                '<input type="hidden"  class="' + self.params.attachmentClassName + '" name="' + self.params.attachmentTextName + '" id="' + self.params.attachmentTextId + '">' +
                                '</div>' +
                                '</div>' +
                                '<div class="telemetry-agent-feedback-form-group">' +
                                '<div class="col coloffset-25 col-75 ">' +
                                '<div class="feedback_thumb_image fLeft" data-href="javascript:void(0);" ></div> ' +
                                '</div>' +
                                '</div>' +
                                '</div>' +
                                '<div class="feedback-modal-footer">' +
                                '<button type="button" class="btn btn-default close-btn"   data-dismiss="modal">Close</button> ' +
                                '<button type="button" class="btn btn-primary" id="' + self.params.submitButtonId + '" >Submit</button> ' +
                                '</div>' +
                                '</div>' +
                                '</form>' +
                                '</div>' +
                                '</div> ' +
                                '<div class="' + self.params.feedbackOverlayClass + '" data-html2canvas-ignore=""></div>';
                            jQuery('body').append($html);

                            //To solve the quote option in support type
                            jQuery.each(self.options.supportTypes, function(i, item) {
                                jQuery('#' + self.params.feedbackTypeId)
                                    .append(jQuery('<option></option>', {
                                            value: item
                                        })
                                        .text(item));
                            });

                            
                          

                           
                            if (self.options.supportWidgetIcon) {
                                jQuery('#' + self.params.mainId).find('.feedback-modal-header').prepend(
                                    jQuery('<img />').attr({
                                        'src': self.options.supportWidgetIcon,
                                        'alt': '',
                                        'class': 'widgetIcon',
                                        'height': '30'
                                    }).css('height', '30px')
                                );

                            }
                            jQuery('.' + self.params.mainClass).show();

                            jQuery('.' + self.params.mainClass).addClass('in');

                            if (jQuery(document).height() >= jQuery('#' + self.params.mainClassContainer).height()) {
                                jQuery('body').addClass('telemetry-agent-feedback-modal-open');
                            }

                            setTimeout(function() {
                                if (jQuery("body").hasClass("telemetry-agent-feedback-modal-open") === false && jQuery(document).height() >= jQuery('#' + self.params.mainClassContainer).height()) {
                                    jQuery("body").css('overflow', 'hidden');
                                }
                                if (typeof(self.options.supportCaptureWebPageEnable) != 'undefined') {
                                    if (self.options.supportCaptureWebPageEnable) {
                                        self.captureWebPage();
                                    }
                                } else if (self.$defaults.supportCaptureWebPageEnable) {
                                    self.captureWebPage();
                                }
                            }, 0);

                        });

                        jQuery('body').delegate('a.telemetry-agent-fileinput-exists, .telemetry-agent-fileinput .btn-file .telemetry-agent-fileinput-exists', "click", function() {
                            jQuery('#' + self.params.attachmentTextId).context.value = '';
                            jQuery('.telemetry-agent-fileinput-new').show();
                            jQuery('.telemetry-agent-fileinput-exists').hide();
                            jQuery('.telemetry-agent-feedback-attachment-filename').html('');
                            jQuery('label[for=' + self.params.attachmentTextId + ']').remove();
                            jQuery('#telemetry-agent-feedback-error-block').remove();
                            jQuery("#" + self.params.attachmentTextId).val('');
                            self.files = '';
                           
                        });

                        jQuery('body').delegate('a.telemetry-agent-feedback-close, button.close-btn', "click", function() {
                            self.files = '';
                            
                            jQuery(this).closest('#' + self.params.mainId).remove();
                            jQuery('.' + self.params.feedbackOverlayClass).remove();
                            jQuery('body').removeClass('telemetry-agent-feedback-modal-open');
                            jQuery("body").css('overflow', '');
                        });

                        jQuery('body').delegate('.telemetry-agent-feedback-modal-body button.telemetry-agent-feedback-close', "click", function(event) {
                            jQuery(this).parent().remove();
                            event.stopPropagation();
                        });
                        jQuery('body').delegate('#refreshButton', "click", function() {
                            self.createCaptcha();
                        });

                        jQuery('body').delegate('#' + self.params.submitButtonId, "click", function() {
                            self.telemetryAgentPostFeedback();
                        });
                    }
                    if (self.options.npsEnable) {
                        /******* LOAD WIDGET CSS *******/

                       
                        var score = '';
                        for (var i = 0; i <= 10; i++) {
                            score = score + '<div class="npsButton" id="' + i + '"><p>' + i + '</p></div>';
                        };
                        var npsLeastLikely = 'Least Likely';
                        var npsNeutral = 'Neutral';
                        var npsMostLikely = 'Most Likely';
                        var npsCancel = 'No, MAY BE NEXT TIME';
                        var npsError = 'Please select a score.';
                        var npsHtml = '<form id="' + self.params.npsFormId + '" method="POST" enctype="multipart/form-data">' +
                            '<div class="npsBox">' +
                            '<div class="npsBoxContent npsBoxStyle">' +
                            '<h4 class="npsTitle">' + self.options.npsTitle + '</h4>' +
                            '</div>' +
                            '<p class="npsSuccess">' + self.options.npsSuccessMessage + '</p>' +
                            '<div class="npsNumber">' +
                            '<div class="npsNumberBox"><center>' + score +
                            '</center></div>' +
                            '</div>' +
                            '<p class="npsLike">' +
                            '<span class="npsLeast">' + npsLeastLikely + '</span>' +
                            '<span class="npsNeutral">' + npsNeutral + '</span>' +
                            '<span class="npsMost">' + npsMostLikely + '</span>' +
                            '</p>' +
                            '<p class="npsError">' + npsError + '</p>' +
                            '<div class="npsSubmitClass">' +
                            '<input class="npsButtonSubmit npsSubmit" type="submit" value="Submit" ng-click="">' +
                            '<span class="npsCancel">' + npsCancel + '</span>' +
                            '</div>' +
                            '<div class="npsButton npsPopClose npsClosing" id="closed"><p>x</p></div>' +
                            '</div>' +
                            '</form>';
                        if (self.getCookie('telemetryAgentNPS') !== 'yes') {
                            jQuery('body').append(npsHtml);
                            if (self.options.npsWidgetCss) {
                                jQuery('.npsBoxContent').css(self.options.npsWidgetCss);
                            } else {
                                jQuery('.npsBoxContent').css(self.$defaults.npsWidgetCss);
                            }
                            jQuery('.npsError').hide();
                            jQuery('.npsSuccess').hide();
                            jQuery('.npsSubmit').click(function(event) {
                                event.preventDefault();
                                if (id != undefined) {
                                    jQuery('.npsNumberBox').hide();
                                    jQuery('.npsQuestion').hide();
                                    jQuery('.npsQuestionBr').hide();
                                    jQuery('.npsClosing').hide();
                                    jQuery('.npsLike').hide();
                                    jQuery('.npsSubmitClass').hide();
                                    jQuery('.npsSuccess').show();
                                    if (event.currentTarget.id != 'closed') {
                                        jQuery('.npsSuccess').show();
                                    } else {
                                        jQuery('.npsBox').hide();
                                    }
                                    setTimeout(function() {
                                        $('.npsBox').hide()
                                    }, self.options.npsBoxFade);
                                    self.telemetryAgentPostNps(id, self.options.npsTitle);
                                } else {
                                    jQuery('.npsError').show();
                                }

                            });
                            var jqVer = jQuery.fn.jquery;
                            var id;
                            var classHighlight = 'npsHighlight';
                            if (jqVer > 1.7) {
                                jQuery('.npsButton').on('click', function() {
                                    if ($(this).attr('id') !== 'closed') {
                                        jQuery('.npsError').hide();
                                        id = $(this).attr('id');
                                        $(".npsHighlight").removeClass("npsHighlight");
                                        $(this).addClass(classHighlight);
                                    } else {
                                        id = -1;
                                        self.telemetryAgentPostNps(id, self.options.npsTitle);
                                        $(".npsBox").hide();
                                    }
                                });
                            } else {
                                jQuery("body").delegate(".npsButton", "click", function() {
                                    if ($(this).attr('id') !== 'closed') {
                                        jQuery('.npsError').hide();
                                        id = $(this).attr('id');
                                        $(".npsHighlight").removeClass("npsHighlight");
                                        $(this).addClass(classHighlight);
                                    } else {
                                        id = -1;
                                        self.telemetryAgentPostNps(id, self.options.npsTitle);
                                        $(".npsBox").hide();
                                    }
                                });
                            }
                            $(".npsCancel").click(function() {
                                id = -1;
                                self.telemetryAgentPostNps(id, self.options.npsTitle);
                                $(".npsBox").hide();
                            });
                            var $npsTimeDelay = self.options.npsBoxDelay * 1000;
                            var $leftSlide = jQuery('.npsBox').delay($npsTimeDelay);
                            $leftSlide.animate({
                                right: parseInt($leftSlide.css('marginRight'), self.options.npsBoxMarginRight) == 0 ?
                                    -$leftSlide.outerWidth() : 0
                            });
                        }

                    };

                }
                if (config) {
                    options = jQuery.extend({}, self.$defaults, config);
                } else {
                    options = jQuery.extend({}, self.$defaults, self.$widgetOptions);
                }
                submitButtonId = (submitButtonId !== undefined) ? submitButtonId : 'telemetryAgentPostFeedback';
                label = (label !== undefined) ? label : 'telemetryAgentFeedbackLabel';


                self.optionArray[label] = options;
                if (jQuery.inArray(label, self.paramsArray) == -1) {
                    self.paramsArray.push(label);
                }
                self.params.labeClass = label;
                self.params.submitButtonId = submitButtonId;

                telemetryLoadSupportWidget(options, label);

            });
        };

        /******** Our intialization function ********/
        var init = function(config, label, submitButtonId) {
            if (self.supportWidgetEnable || self.npsWidgetEnable) {
                // Localize jQuery variable
                var jQuery;

                if (window.jQuery === undefined) {
                    var script_tag = document.createElement('script');
                    script_tag.setAttribute("type", "text/javascript");
                    script_tag.setAttribute("src",
                        self.PLUGIN_URL + "/includes/js/jquery/jquery-1.7.2.min.js");
                    if (script_tag.readyState) {
                        script_tag.onreadystatechange = function() { // For old versions of IE
                            if (this.readyState == 'complete' || this.readyState == 'loaded') {
                                self.loadScriptHandler();
                            }
                        };
                    } else { // Other browsers
                        script_tag.onload = self.loadScriptHandler;
                    }
                    // Try to find the head, otherwise default to the documentElement
                    (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
                } else {
                    // The jQuery version on the window is the one we want to use
                    jQuery = window.jQuery;
                    self.main(config, label, submitButtonId);
                }
            }
        };
        /******** Called once jQuery has loaded ******/
        this.loadScriptHandler = function() {
            // Restore $ and window.jQuery to their previous values and store the
            // new jQuery in our local jQuery variable
            jQuery = window.jQuery.noConflict(true);
            // Call our main function
            self.main();
        };



        /******** FETCH DATA ********/
        this.validateAttachment = function(files) {

            var convertSize = (self.params.attachmentMaxAllowedSize / 1048576).toFixed(0);

            var message = "",
                result;
            var fileName = files.name
            var fileExtension = fileName.split('.')[fileName.split('.').length - 1].toLowerCase();

            if (jQuery.inArray(fileExtension, self.params.validAttachmentExtensions) == -1) {
                message = "This file type is not supported";
            } else {
                if (files.size > self.params.attachmentMaxAllowedSize) {
                    message = "Please make sure your file size is less than " + convertSize + " MB";
                }
            }
            result = (files.size <= self.params.attachmentMaxAllowedSize && jQuery.inArray(fileExtension, self.params.validAttachmentExtensions) != -1);
            if (result === false) {
                jQuery('#' + self.params.attachmentTextId).parent().append('<div class="fLeft clr telemetry-agent-feedback-error-block"><label class="error">' + message + '</label></div>');
                setTimeout(function() {
                    jQuery('#' + self.params.attachmentTextId).context.value = '';
                    jQuery('.telemetry-agent-fileinput-new').show();
                    jQuery('.telemetry-agent-fileinput-exists').hide();
                    jQuery('.telemetry-agent-feedback-attachment-filename').html('');
                    jQuery('label[for=' + self.params.attachmentTextId + ']').remove();
                    jQuery("#" + self.params.attachmentTextId).val('');
                    self.files = '';
                   
                }, 0);
                setTimeout(function() {
                    jQuery('.telemetry-agent-feedback-error-block').remove();
                }, 3000);
            } else {

                jQuery('.telemetry-agent-feedback-error-block').remove();
            }
            return result;
        };

        /******** FETCH DATA ********/
        this.fetchData = function(path, methodType, type, async, callback) {
            return jQuery.ajax({
                url: path,
                async: async,
                beforeSend: function(xhrObj) {},
                type: methodType,
                dataType: type,
                success: function(data) {
                    callback(data);
                },
                error: function(e) {}
            });
        };
        if (!('sendAsBinary' in XMLHttpRequest.prototype)) {
            XMLHttpRequest.prototype.sendAsBinary = function(string) {
                var bytes = Array.prototype.map.call(string, function(c) {
                    return c.charCodeAt(0) & 0xff;
                });
                this.send(new Uint8Array(bytes).buffer);
            };
        }
        this.postCanvasToURL = function(url, name, fn, data, type, username) {
                if (!username)
                    var username = 'Anonymous';

                var xhr = new XMLHttpRequest();
                xhr.open('POST', url, true);
                var boundary = 'ohaiimaboundary';
                xhr.setRequestHeader(
                    'Content-Type', 'multipart/form-data; boundary=' + boundary);
                xhr.setRequestHeader("OperatedBy", username);
                xhr.setRequestHeader("ServiceId", config.settings.serviceId);
                xhr.setRequestHeader("OrganizationId", config.microServiceParams.organizationId);
                xhr.sendAsBinary([
                    '--' + boundary,
                    'Content-Disposition: form-data; name="' + name + '"; filename="' + fn + '"',
                    'Content-Type: ' + type,
                    '',
                    atob(data),
                    '--' + boundary + '--'
                ].join('\r\n'));
                xhr.onreadystatechange = function() {

                    if (xhr.readyState == 4 && xhr.status == 200) {

                        if (JSON.parse(xhr.responseText).results != undefined) {
                            if (JSON.parse(xhr.responseText).results[0] == null || JSON.parse(xhr.responseText).results[0] == '') {
                                jQuery('.' + self.params.feedbackBody).append('<div class="telemetry-agent-feedback-error alert alert-dismissable alert-danger"><button type="button" class="telemetry-agent-feedback-close"  aria-hidden="true">&times;</button><span>' + 'Screenshot is not uploaded' + '</span></div>');
                            }
                        }
                    }
                }
            }
            /******** FETCH POST DATA ********/
        this.fetchPostData = function(path, methodType, type, async, postData, callback) {
            var username = 'Anonymous';
            try {
                var jsonObj = JSON.parse(postData);

                if (jsonObj['userDetails']['name'] && jsonObj['userDetails']['name'] != undefined) {
                    username = jsonObj['userDetails']['name'];
                }
            } catch (e) {
                username = 'Anonymous';
            }


            if (jsonObj['Screenshot'] != undefined)
                jsonObj['Screenshot'] = true;

            screenshotName = JSON.parse(postData).screenshotName;
            screenshot = JSON.parse(postData).Screenshot;
            var uploadServiceUrl = self.uploadServiceUrl + '?repositoryId=cmis&scopeId=chemistry&path=support/docs/feedback&attachmentIds=[' + screenshotName + ']';

            if (screenshot) {
                screenshot = screenshot.replace('data:image/png;base64,', '');
                self.postCanvasToURL(uploadServiceUrl, 'file', screenshotName, screenshot, 'img/png', jsonObj['userDetails']['name']);
            }

            var microServiceParams = self.microServiceParams;

            var feedbackDatas = JSON.stringify(jsonObj);
            microServiceParams.activityDataStructured = feedbackDatas;


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
            microServiceParams.activityName = "Feedback";
            microServiceParams.activityType = "Feedback";
            if (self.isNps) {
                microServiceParams.activityName = "NetPromoterScore";
                microServiceParams.activityType = "NetPromoterScore";
            };
            microServiceParams.activityTag = "";
            microServiceParams.scope = {};
            var microServiceUrl = self.microServiceUrl;
            if (navigator.userAgent.match(/msie/i) && window.XDomainRequest) {
                var xdr = new XDomainRequest();

                xdr.open("post", path);

                xdr.onload = function() {
                    return callback(JSON.parse(xdr.responseText));
                }

                setTimeout(function() {
                    xdr.send(postData);
                }, 0);
            } else {
                return jQuery.ajax({
                    url: microServiceUrl,
                    async: true,
                    cache: false,
                    beforeSend: function(xhrObj) {
                        xhrObj.setRequestHeader("OperatedBy", username);
                        xhrObj.setRequestHeader("ServiceId", config.settings.serviceId);
                    },
                    data: JSON.stringify(microServiceParams),
                    type: methodType,
                    contentType: 'application/json',
                    success: function(data) {
                        callback(data);
                    },
                    error: function(e) {}
                });
            }
        };

         /******** POST DATA WITHOUT UI********/
        var widgetApiPost = function(postData, callback) {
            var confi = jQuery.extend({}, self.$defaults, self.$widgetOptions);
        	if (confi.widgetApi) {
                  postData.feedbackContext = location.href;
        	  self.fetchPostData(self.END_POINT, 'POST', 'json', true, JSON.stringify(postData), callback);
        	};
        };

        /******** Capture WEB PAGE ********/
        this.captureWebPage = function() {
            if (jQuery(window).width() >= self.params.screenCaptureResolutionLimit) {
                if (jQuery('.captureImage').length > 0) {
                    jQuery('.feedback_thumb_image').html('');
                }
                jQuery('.' + self.params.feedbackOverlayClass).attr('data-html2canvas-ignore', '');
                var btn = jQuery('#' + self.params.submitButtonId);
                btn.attr('disabled', 'true');
                jQuery('.feedback_thumb_image').html('Capturing Image Please Wait..');
                html2canvas(document.body, {
                    useCORS: false,
                    onrendered: function(canvas) {
                        var dataUrl = canvas.toDataURL("image/png");
                        jQuery('#' + self.params.captureImageTextId).val(dataUrl);
                        jQuery('.feedback_thumb_image').html('<div class="prelative"><button type="button" class="removeImage telemetry-agent-feedback-close cirlce-close-icon"  aria-hidden="true" ></button><img src="' + dataUrl + '" class="captureImage"/><input type="hidden" value="' + dataUrl + '" name="' + self.params.captureImageTextName + '"/></div>');
                        btn.removeAttr('disabled');
                        jQuery('.removeImage').unbind('click').bind('click', function(e) {
                            e.preventDefault();
                            jQuery('#' + self.params.captureImageTextId).val('');
                        });
                    }
                });
            }
        };

        /******** POST FEEDBACK ********/
        this.telemetryAgentPostFeedback = function() {
            /*
             *Function to convert serialized array to json object
             */
            jQuery.fn.serializeObject = function() {
                var o = {};
                var a = this.serializeArray();
                jQuery.each(a, function() {
                    if (o[this.name] !== undefined) {
                        if (!o[this.name].push) {
                            o[this.name] = [o[this.name]];
                        }
                        o[this.name].push(this.value || '');
                    } else {
                        o[this.name] = this.value || '';
                    }
                });
                return o;
            };
            jQuery.validator.addMethod("captchaCheck", function(value, element) {
                var captcha1 = jQuery('#' + self.params.captchaTextFieldId).val();
                captcha1 = captcha1.split(' ').join('');
                var captcha2 = jQuery('#' + self.params.captchaTextValue).val();
                captcha2 = captcha2.split(' ').join('');
                if (captcha1.toUpperCase() == captcha2.toUpperCase()) {
                    return true;
                } else {
                    return false;
                }
            });
            if (self.options.supportCaptchaEnable) {
                jQuery('#' + self.params.formName).validate({
                    rules: {
                        captchaText: "required",
                        captchaTextValue: {
                            captchaCheck: true
                        }
                    },
                    messages: {
                        captchaTextValue: {
                            captchaCheck: self.params.captchaErrorMessage
                        }
                    }
                });
            }
            var isValid = jQuery('#' + self.params.formName).valid();
            if (isValid) {
                jQuery("#" + self.params.submitButtonId).attr("disabled", "disabled");
                jQuery('.loader-pleasewait').removeClass("loader-pleasewait").addClass("loader-pleasewait-show");
                jQuery('.fade-block').removeClass("fade-block").addClass("fade-block-show");
                setTimeout(function() {
                    var data = jQuery('#' + self.params.formName).serializeObject();
                    var rand = Math.random().toString(36).slice(2).substring(1);
                    data.apiKey = self.apiKey;
                    data.releaseStage = self.releaseStage;
                    data.feedbackContext = location.href;
                    if (self.userData) {
                        data.userDetails = self.userData;
                    } else {
                        data.userDetails = 'Anonymous';
                    }

                    var timestamp = (new Date().getTime() / 1000).toFixed(0);
                    data.supportTimeStamp = timestamp;
                    if (self.files) {
                        var fileNameAttachment = self.files.name;
                        var file_array = fileNameAttachment.split('.');
                        var attachmentFileName = file_array[file_array.length - 1];
                        data.attachmentName = timestamp + rand + 'attachment.' + attachmentFileName;
                    }
                    if (data.Screenshot) {
                        data.screenshotName = timestamp + rand + 'screenshot.png';
                    }
                    data.userAgent = navigator.userAgent;
                    var telemetryagentFeedbackheaderData = {
                        'REQUEST_METHOD': 'POST',
                        'CONTENT_TYPE': 'application/json',
                        'REQUEST_URI': self.END_POINT,
                        'HTTP_USER_AGENT': navigator.userAgent,
                        'HTTP_REFERER': document.referrer
                    }
                    data.feedbackData = JSON.stringify(telemetryagentFeedbackheaderData);
                    var dataString = JSON.stringify(data);

                    jQuery('.telemetry-agent-feedback-error').remove();

                    var name = 'Anonymous';
                    var username = 'Anonymous';
                    try {
                        var jsonObj = JSON.parse(dataString);

                        if (jsonObj['userDetails']['name'] && jsonObj['userDetails']['name'] != undefined) {
                            var username = jsonObj['userDetails']['name'];
                        }
                    } catch (e) {
                        username = 'Anonymous';
                    }
                    
                    self.fetchPostData(self.END_POINT, 'POST', 'json', true, dataString, function(result) {


                        if (result.Data != undefined) {
                            if (result.Data.activityId == '') {
                                jQuery('.' + self.params.feedbackBody).append('<div class="telemetry-agent-feedback-error alert alert-dismissable alert-danger"><button type="button" class="telemetry-agent-feedback-close"  aria-hidden="true">&times;</button><span>' + 'Service not found' + '</span></div>');

                                setTimeout(function() {

                                    jQuery('button.close-btn').click();

                                }, 3000);


                            } else {
                                jQuery('.' + self.params.feedbackBody).append('<div class="telemetry-agent-feedback-error alert alert-dismissable alert-success"><button type="button" class="telemetry-agent-feedback-close"  aria-hidden="true">&times;</button><span>' + self.params.successMessage + '</span></div>');
                                jQuery('#' + self.params.captureImageTextId).val('');
                                jQuery('.loader-pleasewait-show').removeClass("loader-pleasewait-show").addClass("loader-pleasewait");
                                jQuery('.fade-block-show').removeClass("fade-block-show").addClass("fade-block");


                                setTimeout(function() {

                                    self.resetForm();

                                }, 3000);
                            }

                        } else {
                            jQuery('.' + self.params.feedbackBody).append('<div class="telemetry-agent-feedback-error alert alert-dismissable alert-danger"><button type="button" class="telemetry-agent-feedback-close"  aria-hidden="true">&times;</button><span>' + 'Service not found' + '</span></div>');
                            setTimeout(function() {

                                jQuery('button.close-btn').click();

                            }, 3000);

                        }
                    });
                });
                setTimeout(function() {

                    jQuery('button.close-btn').click();

                }, 10000);
                jQuery('.loader-pleasewait,.fade-block').hide();
                jQuery('.telemetry-agent-feedback-error').delay(5000).hide('fade', function() {
                    jQuery(this).remove();
                });
                return false;
            }
        };

        /******** POST NPS ********/
        this.telemetryAgentPostNps = function(npsScore, npsQn) {
            var data = {};
            data.score = npsScore;
            data.apiKey = self.apiKey;
            data.releaseStage = self.releaseStage;
            data.npsContext = location.href;
            data.npsQuestion = npsQn;
            data.userData = self.register.userDetails;
            var dataString = JSON.stringify(data);
            self.isNps = true;
            self.fetchPostData('', 'POST', 'json', true, dataString, function(result) {
                if (!result.status) {
                    self.createCookie('telemetryAgentNPS', 'yes');
                } else {
                    return false;
                }
            });
        };

        /************RESET FORM ************/
        this.resetForm = function() {
            if (jQuery('#' + self.params.formName)[0] != undefined) {
                jQuery('#' + self.params.formName)[0].reset();
                jQuery('#' + self.params.mainId).fadeOut("slow", function() {
                    jQuery('#' + self.params.mainId).remove();
                    jQuery('.' + self.params.feedbackOverlayClass).remove();
                    jQuery('body').removeClass('telemetry-agent-feedback-modal-open');
                    jQuery("body").css('overflow', '');
                    // Animation complete.
                });
            };

        };
        /************Create cookie ************/
        this.createCookie = function(name, value, days) {
            var expires;
            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            } else {
                expires = '';
            }
            document.cookie = name + '=' + value + expires + '; path=/';

        };
        /************Get cookie ************/
        this.getCookie = function(c_name) {
            if (document.cookie.length > 0) {
                c_start = document.cookie.indexOf(c_name + '=');
                if (c_start != -1) {
                    c_start = c_start + c_name.length + 1;
                    c_end = document.cookie.indexOf(';', c_start);
                    if (c_end == -1) {
                        c_end = document.cookie.length;
                    }
                    return unescape(document.cookie.substring(c_start, c_end));
                }
            }
            return '';

        };
        return {
            init: init,
            widgetApiPost : widgetApiPost

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