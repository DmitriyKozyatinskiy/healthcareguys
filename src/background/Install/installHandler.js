export default class InstallHandler {
  constructor() {
    this._manifest = chrome.runtime.getManifest();
    this._setEvents();
  }


  _setEvents() {
    chrome.runtime.onInstalled.addListener(() => {
      chrome.windows.getAll({ populate: true }, windows => {
        const windowAmount = windows.length;
        let i;
        let j;
        for(i = 0; i < windowAmount; i++) {
          const currentWindow = windows[i];
          const  tabsAmount = currentWindow.tabs.length;
          for(j = 0; j < tabsAmount; j++) {
            const currentTab = currentWindow.tabs[j];
            if(!currentTab.url.match(/(chrome):\/\//gi) ) {
              this._injectIntoTab(currentTab);
            }
          }
        }
      });
    });
    return this;
  }


  _injectIntoTab(tab) {
    const scripts = this._manifest.content_scripts[0].js;
    const scriptsAmount = scripts.length;
    let i;
    for(i = 0; i < scriptsAmount; i++ ) {
      chrome.tabs.executeScript(tab.id, {
        file: scripts[i]
      });
    }
  }
}
