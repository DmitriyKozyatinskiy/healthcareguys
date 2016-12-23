import 'bootstrap-loader';
import 'font-awesome-webpack';
import './../../node_modules/jstree/dist/themes/default/style.css';
import './../style.scss';
import $ from 'jquery';
import 'jstree';
import Auth from './Auth/Auth';
import DataProvider from './DataProvider/DataProvider';
import DataSubmitter from './DataSubmitter/DataSubmitter';
import DataSaver from './AutoSavers/DataSaver';
import LinksSaver from './AutoSavers/LinksSaver';
import ImageScroller from './ImageScroller/ImageScroller';
import General from './Tabs/General/General';
import Share from './Tabs/Share/Share';
import Purpose from './Tabs/Purpose/Purpose';
import Visuals from './Tabs/Visuals/Visuals';
import Links from './Tabs/Links/Links';
import Feedback from './Tabs/Feedback/Feedback';
import TelemetryListener from './TelemetryListener/TelemetryListener';

// const telemetryListener = new TelemetryListener();
const auth = new Auth();
const dataProvider = new DataProvider();
const dataSubmitter = new DataSubmitter();
const dataSaver = new DataSaver();

const $loginForm = $('#js-login-form');
const $contentForm = $('#js-content-form');
const $tabs = $('#js-tabs');
const $footer = $('#js-footer');
const $main = $('#js-main');

const generalTab = new General($contentForm);
const shareTab = new Share($contentForm);
const purposeTab = new Purpose($contentForm);
const visualsTab = new Visuals($contentForm);
const linksTab = new Links($contentForm);
const feedbackTab = new Feedback($contentForm);

const imageScroller = new ImageScroller();

checkCurrentUrl().then(() => {
  $(document)
    .on('click', '.js-tab-button', handleTabChange)
    .on('click', '.js-list-toggler', handleListToggle)
    .on('set-interface:popup', setInterface);
  setInterface();
}, () => window.close());


function setInterface() {
  const tokenPromise = Auth.getToken();
  const isSignedInPromise = auth.isSignedIn();
  const pageDataPromise = dataProvider.getPageData();
  const taxonomyListPromise = dataProvider.getTaxonomyList();


  Promise.all([ pageDataPromise, taxonomyListPromise ]).then(response => {
    let [ data, list ] = response;
    const temporaryDataPromise = dataSaver.getData(data.url);
    LinksSaver.setLinks(data.url);

    Promise.all([ tokenPromise, temporaryDataPromise ]).then(response => {
      const [ startToken, temporaryData ] = response;
      const $submitButton = $('.js-submit-button');

      data = dataProvider.extendData(data, list, temporaryData);
      $contentForm.empty();
      generalTab.show(data);
      shareTab.show(data);
      purposeTab.show(data);
      visualsTab.show(data);
      linksTab.show(data);
      feedbackTab.show(data);

      $loginForm.addClass('hidden').empty();
      $main.removeClass('is-login-form-shown');
      $tabs.removeClass('hidden').addClass('no-events');
      $footer.removeClass('hidden');
      $submitButton.prop('disabled', true);

      isSignedInPromise.then(username => {
        $tabs.removeClass('no-events');
        $submitButton.prop('disabled', false);
        $('.list-container p').remove();
        $('.js-name-label').html('as ' + username);
        setTooltips();
      }, () => auth.showSignInForm())
    }, () => auth.showSignInForm())
  });
}


function handleListToggle() {
  var $button = $(this);
  var $icon = $button.find('.js-list-icon');
  var $container = $button.closest('.js-expandable-container');
  $('.submission-notification').addClass('hidden');
  if ($container.hasClass('pull-down-expanded')) {
    $container.removeClass('pull-down-expanded').find('.list-container').addClass('list-cat-height');
    $icon.removeClass('glyphicon glyphicon-chevron-down').addClass('glyphicon glyphicon-chevron-up');
  } else {
    $container.addClass('pull-down-expanded').find('.list-container').removeClass('list-cat-height');
    $icon.removeClass('glyphicon glyphicon-chevron-up').addClass('glyphicon glyphicon-chevron-down');
  }
}


function handleTabChange(event) {
  const $tabButton = $(this);
  $('.js-tab-button').removeClass('active');
  $tabButton.addClass('active');
  event.preventDefault();

  const actionLabel = $tabButton.attr('data-title');
  $(document).trigger('tab-change:telemetry', [ actionLabel ]);
}


function setTooltips() {
  $('.js-tooltip').each(function() {
    const $item = $(this);
    const text = $item.attr('data-title');
    const placement = $item.attr('data-placement');
    $item.tooltip({
      title: text,
      trigger: 'hover',
      placement: placement
    })
  });
}


function checkCurrentUrl() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, { validateCurrentUrl: true }, isValid => {
        if (isValid) {
          resolve(tabs[0].id);
        } else {
          reject(tabs[0].id);
        }
      });
    });
  });
}
