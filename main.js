function disableProxy() {
    chrome.storage.sync.set({'prx_enabled': false});
    var config = {
        mode: "system"
    };
    chrome.proxy.settings.set({
        value: config,
        scope: 'regular'
    }, function () {
    });
}

function saveProxy() {
    var config = null;

    function callback() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                result = xhr.responseText;
                var obj = JSON.parse(result);
                chrome.storage.sync.set({'prx_username': obj.username});
                chrome.storage.sync.set({'prx_password': obj.password});
                chrome.storage.sync.set({'prx_pac': obj.pacUrl});
                chrome.storage.sync.set({'prx_enabled': true});
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


function toggle() {
    var s = null;

    chrome.storage.sync.get(['prx_username', 'prx_password', 'prx_pac', 'prx_enabled'], function (data) {
        var x = document.getElementById("togglebtn");
        if (data.prx_enabled === true) {
            x.innerHTML = "Disabled";
            chrome.storage.sync.set({'prx_enabled': false});
            disableProxy();
        } else {
            saveProxy();
            setTimeout(function () {
                chrome.storage.sync.get(['prx_username', 'prx_password', 'prx_pac', 'prx_enabled'], function (data) {
                    x.innerHTML = "Enabled";
                    chrome.storage.sync.set({'prx_enabled': true});
                    data.prx_enabled = true;
                    setProxy(data);
                });
            }, 1000);

        }

    });

}

function saveInput() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    chrome.storage.sync.set({'username': username});
    chrome.storage.sync.set({'password': password});

};


document.addEventListener('DOMContentLoaded', function () {
    var togglebtn = document.getElementById("togglebtn");
    var loginbtn = document.getElementById("savebtn");
    chrome.storage.sync.get('prx_enabled', function (data) {
        if (data.prx_enabled == true)
            togglebtn.innerHTML = "Enabled";
        else
            togglebtn.innerHTML = "Disabled";
    });
    togglebtn.addEventListener('click', toggle);
    loginbtn.addEventListener('click', saveInput);
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
