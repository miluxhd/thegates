let authData = {};

function sendAuth(details, callbackFn) {
    console.log("onAuthRequired!", details, callbackFn);
    if (!Object.keys(authData)[0]) {
        loadAuthData();
    }
    callbackFn({
        authCredentials: {username: authData["prx_username"], password: authData["prx_password"]}
    });
}

chrome.webRequest.onAuthRequired.addListener(sendAuth,
    {urls: ["<all_urls>"]},
    ['asyncBlocking']
);

chrome.storage.onChanged.addListener(storageOnChanged);

function storageOnChanged(changes, area) {
    Object.keys(changes).forEach(element => {
        // if (changes[element].newValue !== changes[element].oldValue) {
        authData[element] = changes[element].newValue;
        if (element === "prx_mode")
            if (authData["prx_mode"] === "disabled")
                setDisabled();
            else if (authData["prx_mode"] === "enabled") {
                setEnabled();
            }
        // }
    });
}

chrome.runtime.onInstalled.addListener(function callback() {
    loadAuthData();
})

function loadAuthData() {
    chrome.storage.local.get(['prx_username', 'prx_password', 'prx_host', 'prx_port', 'prx_mode', 'prx_pac'], function (data) {
        authData['prx_username'] = data.prx_username;
        authData['prx_password'] = data.prx_password;
            authData['prx_mode'] = data.prx_mode;
        authData['prx_pac'] = data.prx_pac;
    });
}

function setEnabled() {
    setMode(true);
    setProxy();
    console.log('******* enabled mode');
}

function setDisabled() {
    setMode(false);
    setProxy();
    console.log('******* disabled mode');
}

async function setProxy() {
    var config = null;

    if (!Object.keys(authData)[0]) {
        await loadAuthData();
    }

    if (authData['prx_mode'] === "enabled")
        config = {
            mode: "pac_script",
            pacScript: {
                url: authData['prx_pac']
            }
        };
    else
        config = {
            mode: "system"
        };

    chrome.proxy.settings.set({
        value: config,
        scope: 'regular'
    }, function () {
    });
}

function setMode(status) {
    if (status)
        authData['prx_mode'] = 'enabled';
    else
        authData['prx_mode'] = 'disabled';
}