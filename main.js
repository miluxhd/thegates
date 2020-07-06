function validate(username, password) {
    if (username == null || password == null)
        return false;
    return true;
}

function login() {
    var config = null;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!validate(username, password)) {
        console.log("invalid username or password");
        return;
    }
    function callback() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("logging!!!!");
                var result = xhr.responseText;
                var obj = JSON.parse(result);
                browser.storage.local.set({'prx_username': obj.prx_username});
                browser.storage.local.set({'prx_password': obj.prx_password});
                browser.storage.local.set({'prx_port': obj.prx_port});
                browser.storage.local.set({'prx_host': obj.prx_host});
            } else {
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

    chrome.storage.local.get(['prx_mode'], function (data) {
        var x = document.getElementById("togglebtn");
        if (data.prx_mode === "enabled") {
            x.innerHTML = "Disabled";
            browser.storage.local.set({'prx_mode': 'disabled'});
        } else {
            x.innerHTML = "Enabled";
            browser.storage.local.set({'prx_mode': 'enabled'});
        }
    });

}

document.addEventListener('DOMContentLoaded', function () {
    var togglebtn = document.getElementById("togglebtn");
    var loginbtn = document.getElementById("loginbtn");
    chrome.storage.local.get('prx_mode', function (data) {
        if (data.prx_mode == 'enabled')
            togglebtn.innerHTML = "Enabled";
        else
            togglebtn.innerHTML = "Disabled";
    });
    loginbtn.addEventListener('click', login);
    togglebtn.addEventListener('click', toggle);
});