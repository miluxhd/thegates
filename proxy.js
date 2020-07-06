let authData = {};

chrome.webRequest.onAuthRequired.addListener(sendAuth, {urls: ['*://*/*']}, ['blocking']);
chrome.storage.onChanged.addListener(storageOnChanged);

function storageOnChanged(changes, area) {
    Object.keys(changes).forEach(element => {
        if (changes[element].newValue !== changes[element].oldValue) {
            authData[element] = changes[element].newValue;
            if (element === "prx_mode")
                if (authData["prx_mode"] === "disabled")
                    setDisabled();
                else if (authData["prx_mode"] === "enabled")
                    setEnabled();
        }
    });
}

browser.runtime.onInstalled.addListener(details => {
    loadAuthData()
});


async function sendAuth(details, callbackFn) {
    console.log("onAuthRequired!", details, callbackFn);
    if (!Object.keys(authData)[0]) {
        await loadAuthData();
    }
    return {authCredentials: {username: authData["prx_username"], password: authData["prx_password"]}}
}

async function loadAuthData() {
    await new Promise(resolve => {
        chrome.storage.local.get(['prx_username', 'prx_password', 'prx_host', 'prx_port', 'prx_mode'], function (data) {
            authData['prx_username'] = data.prx_username;
            authData['prx_password'] = data.prx_password;
            authData['prx_host'] = data.prx_host;
            authData['prx_port'] = data.prx_port;
            authData['prx_mode'] = data.prx_mode;
            resolve();
        });
    });
}


async function proxyRequest(requestInfo) {
    if (!Object.keys(authData)[0]) {
        await loadAuthData();
    }
    console.log(authData);
    const ret = {
        type: 'http',
        host: authData['prx_host'],
        port: authData['prx_port']
    };
    return ret;
}

function setEnabled() {
    browser.proxy.onRequest.addListener(proxyRequest, {urls: ["https://www.google.com/*", "*://ifconfig.co/*" , "*://*.chrome.com/*"]});
}

function setDisabled() {
    browser.proxy.onRequest.hasListener(proxyRequest) && browser.proxy.onRequest.removeListener(proxyRequest);
    console.log('******* disabled mode');
    console.log(authData);
}