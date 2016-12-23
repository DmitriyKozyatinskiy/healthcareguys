import $ from 'jquery';
import './options.scss';
import changeLog from './changelog.html';

const $currentVersionNumber = $('#js-current-version');
const $changeLogContainer = $('#js-changelog-container');

const manifest = chrome.runtime.getManifest();
$currentVersionNumber.html(manifest.version);


function showChangeLog(event) {
  event.preventDefault();
  $changeLogContainer.html(changeLog).removeClass('hidden');
}

$(document).on('click', '#js-changelog-button', event => showChangeLog(event));