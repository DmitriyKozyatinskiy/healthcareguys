import $ from 'jquery';
import { TelemetryAgent } from './../../telemetry_agent/dist/agent';
// require("expose-loader?TelemetryAgent!./../../telemetry_agent/dist/agent.js");
// require("expose-loader?configSettings!./../../telemetry_agent/dist/agent_config.js");
// require("expose-loader?TelemetryAgentPageData!./../../telemetry_agent/dist/agent_pagedata.js");
// require("expose-loader?TelemetryAgentProblems!./../../telemetry_agent/dist/agent_problems.js");
// require("expose-loader?TelemetryAgentSupportWidget!./../../telemetry_agent/dist/agent_support.js");
// require("imports?this=>window!./../../telemetry_agent/dist/agent.js");

// require("./../../telemetry_agent/dist/agent.js");
// require("./../../telemetry_agent/dist/agent_config.js");
// require("./../../telemetry_agent/dist/agent_pagedata.js");
// require("./../../telemetry_agent/dist/agent_problems.js");
// require("./../../telemetry_agent/dist/agent_support.js");

export default class TelemetryListener {
  constructor() {
    this._telemetryAgent = '';
    this._setEvents();
  }


  _setEvents() {
    $(document)
    .on('submit-data:telemetry', (event, data) => {
      this._telemetryAgent.pageData.Event('Post Submission', 'Post', 'Post Submission', 1, { customData: data });
    }).on('submit-feedback:telemetry', (event, data, callback) => {
      this._telemetryAgent.supportWidget.widgetApiPost(data, callback);
    }).on('tab-change:telemetry', (event, actionLabel) => {
      this._telemetryAgent.pageData.Event('TabClick', 'click', actionLabel, 1, { customData: actionLabel + ' Click' });
    }).on('sign-in:telemetry', () => {
      this._telemetryAgent.pageData.setNotifyLogin(requestData => {
        requestData['statName'] = 'Login';
        return requestData;
      }, '');
    }).on('sign-out:telemetry', () => {
      this._telemetryAgent.pageData.setNotifyLogout(requestData => {
        requestData['statName'] = 'Logout';
        return requestData;
      }, '');
    }).on('update:telemetry', (event, data) => {
      console.log('data: ', data);
      console.log('AGENT: ', TelemetryAgent);
      this._telemetryAgent = TelemetryAgent.getInstance(data);
    });
    return this;
  }
}
