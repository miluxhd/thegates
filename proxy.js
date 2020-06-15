chrome.windows.onCreated.addListener(function () {
    chrome.storage.sync.get(['prx_username', 'prx_password', 'prx_pac', 'prx_enabled'], function (data) {
        var config = null;

        if (data.prx_pac == null) {
            alert("no proxy")
            return;
        }

        var config = {
            mode: "system"
        };

        if (data.prx_enabled)
            config = {
                mode: "pac_script",
                pacScript: {
                    url: data.prx_pac
                }
            };


        chrome.webRequest.onAuthRequired.addListener(
            function (details, callbackFn) {
                console.log("onAuthRequired!", details, callbackFn);
                callbackFn({
                    authCredentials: {username: data.prx_username, password: data.prx_password}
                });
            },
            {urls: ["<all_urls>"]},
            ['asyncBlocking']
        );


        chrome.proxy.settings.set({
            value: config,
            scope: 'regular'
        }, function () {
        });
    });
});