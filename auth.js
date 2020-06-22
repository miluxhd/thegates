chrome.storage.sync.get(['prx_username', 'prx_password', 'prx_pac', 'prx_enabled'], function (data) {

    if (data.prx_username == null || data.prx_password == null) {
        function callback() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    result = xhr.responseText;
                    var obj = JSON.parse(result);
                    chrome.webRequest.onAuthRequired.addListener(
                        function (details, callbackFn) {
                            console.log("onAuthRequired!", details, callbackFn);
                            callbackFn({
                                authCredentials: {username: obj.username, password: obj.password}
                            });
                        },
                        {urls: ["<all_urls>"]},
                        ['asyncBlocking']
                    );

                }
                else {
                    alert(xhr.status);
                }
            }
        };

        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://thegates/credentials.json", true);
        xhr.onreadystatechange = callback;
        xhr.send();

    }

    else {
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
    }
});

       
