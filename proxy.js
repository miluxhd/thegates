chrome.windows.onCreated.addListener(function () {
    chrome.storage.sync.get(['prx_username', 'prx_password', 'prx_pac', 'prx_enabled'], function (data) {
        setProxy(data);
    });
});

function setProxy(data) {
    var config = null;

    if (data.prx_pac == null) {
        alert("no proxy")
        return;
    }

    var config = {
        mode: "system"
    };

    alert(data.prx_enabled);

    if (data.prx_enabled)
        config = {
            mode: "pac_script",
            pacScript: {
                url: data.prx_pac
            }
        };

    chrome.proxy.settings.set({
        value: config,
        scope: 'regular'
    }, function () {
    });
}
