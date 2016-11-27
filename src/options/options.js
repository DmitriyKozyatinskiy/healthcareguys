import $ from 'jquery';
import './options.scss';

const manifest = chrome.runtime.getManifest();
$('#js-current-version').html(manifest.version);