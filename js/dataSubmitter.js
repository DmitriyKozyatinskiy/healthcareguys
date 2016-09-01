;
(function() {
    'use strict';

    var MAX_CATEGORIES_NUMBER = 5;
    var noTitleErrorMessage = 'Title should not be empty';
    var categoriesErrorMessage = 'You must select from 1 to 5 categories';

    function getContentData() {
        var categories = [];
        $('.js-category-input:checked').each(function() {
            var categoryId = $(this).val();
            categories.push(categoryId);
        });

        var tags = [];
        $('.js-tag-input:checked').each(function() {
            var tagId = $(this).val();
            tags.push(tagId);
        });

        return {
            'url': $('#js-url-input').val(),
            'title': $('#js-title-input').val(),
            'description': $('#js-description-input').val(),
            'image-url': $('#js-image').attr('src'),
            'category': categories,
            'tweet-content': $('#js-tweet-content').val(),
            'share-content': $('#js-share-content').val(),
            'hashtag': tags,
            'purpose': $('#js-purpose-list-container').jstree('get_bottom_checked'),
            'personas': $('#js-persona-list-container').jstree('get_bottom_checked'),
            'thumb-image': $('#js-visuals-thumbnail-uploader').attr('data-src') || '',
            'set-thumb-image': $('#js-thumbnail-select').val() || '',
            'web-image': $('#js-visuals-web-uploader').attr('data-src') || '',
            'set-web-image': $('#js-web-select').val() || '',
            'share-image': $('#js-visuals-share-uploader').attr('data-src') || '',
            'set-share-image': $('#js-share-select').val() || '',
            'tweet-image': $('#js-visuals-tweet-uploader').attr('data-src') || '',
            'set-tweet-image': $('#js-tweet-select').val() || '',
            'post-type': 'wpri_submit'
        };
    }

    function submitData(data, token) {
        var dfd = $.Deferred();

        $.ajax({
            url: 'https://news-devl.healthcareguys.com/wp-json/api/wp/v2/post',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                data: data,
                token: token
            }),
            xhrFields: {
                withCredentials: true
            }
        }).done(function(response) {
            response = JSON.parse(response);

            if (response.status === 'success') {
                dfd.resolve(response);
                //dfd.resolve(response.message);
            } else {
                dfd.reject(response);
            }
        }).fail(function() {
            dfd.reject('Unknown error');
        });

        return dfd.promise();
    }

    function handleDataSubmissionProcess() {
        var errorMessage = {message:''};
        var data = getContentData();
        console.log('DATA: ', data);

        if (!data.title && (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER)) {
            errorMessage.message = noTitleErrorMessage + '; ' + categoriesErrorMessage;
        } else if (!data.title) {
            errorMessage.message = noTitleErrorMessage;
        } else if (!data.category.length || data.category.length > MAX_CATEGORIES_NUMBER) {
            errorMessage.message = categoriesErrorMessage;
        }

        if (errorMessage.message) {
            showSubmissionStatus('error', errorMessage);
            return;
        }

        Loader.show();
        Auth.getToken().done(function(token) {
            submitData(data, token).done(function(response) {                
                showSubmissionStatus('success', response );
            }).fail(function(response) {
                showSubmissionStatus('error', response);
            }).always(function() {
                Loader.hide();
            });
        });
    }

    function showSubmissionStatus(status, response) {   
        var message = response.message;       
        if (status == 'success') {           
            $('.js-submission-success').removeClass('hidden');
            if (message) {
               $('#js-clean-link').val(response.results.cleanURL);                
               $('#js-short-link').val(response.results.shortBadgedURL);
               $('#js-badged-link').val(response.results.badgedURL);               
               $('#js-canonical-link').val(response.results.shortCanonicalURL);  
            }
            $('.js-submission-error').addClass('hidden');
        } else {
            $('.js-submission-error').removeClass('hidden');
            $('.js-submission-error-message').html(message);
            $('.js-submission-success').addClass('hidden');
        }
    }

    function getFeedbackData() {
        return {
            "feedbackUser": $.trim($('#js-fed-name').val()),
            "feedbackUserEmail": $.trim($('#js-fed-email').val()),
            "feedbackType": $.trim($('#js-fed-support-type').val()),
            "feedbackSubject": $.trim($('#js-fed-subject').val()),
            "feedbackDesc": $.trim($('#js-fed-description').val()),
            "feedbackAttachment": "",
            "apiKey": "25447ae7-a97c-325e-bc52-e75814b61b07",
            "releaseStage": "NPS",
            "userDetails": {
                "name": $.trim($('#js-fed-name').val()),
                "email": $.trim($('#js-fed-email').val()),
                "account": "PrescribeWell",
                "appVersion": "1.2+0001",
                "role": "admin"
            },
            "supportTimeStamp": "",
            "userAgent": "",
            "feedbackData": {
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": "application/json",
                "HTTP_USER_AGENT": "",
                "HTTP_REFERER": ""
            }

        };
    }
    function handleFeedbackSubmissionProcess(telemetryAgent) {
       var errorMessage = '';    
        var data = getFeedbackData();
        //chrome.extension.getBackgroundPage().console.log(telemetryAgent); 
       // chrome.extension.getBackgroundPage().console.log(JSON.stringify(data));
        telemetryAgent.supportWidget.widgetApiPost(data,function(){
            $('.alert-success').removeClass('hidden');
            Loader.hide(); 

        });    
    }
    function validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    $(document).on('submit', '#js-content-form', function(event) {
        event.preventDefault();
        handleDataSubmissionProcess();
    });
    
    $(document).on('click', '#js-feedback', function(event) {       
        Loader.show();   
        if(validateEmail($('#js-fed-email').val())){
            $("#fed-message").addClass("hidden");
            var errorMessage = '';
            var userDetails = {
                "name": $.trim($('#js-fed-name').val()),
                "email": $.trim($('#js-fed-email').val()),
                "account": "PrescribeWell",
                "appVersion": '1.2+0001',
                "role": "admin",
            };
            var d = "NPS";
            var telemetryAgent = TelemetryAgent.getInstance({
                apiKey: '25447ae7-a97c-325e-bc52-e75814b61b07',
                releaseStage: d,
                userData: userDetails
            });
            handleFeedbackSubmissionProcess(telemetryAgent);
        } else {
            $("#fed-message").removeClass("hidden");
             Loader.hide(); 
        }         
        event.preventDefault();
    });   
}());


