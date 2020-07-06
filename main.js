function validate(username, password) {
    if (username === '' || password === '')
        return false;
    return true;
}

function login() {
    var config = null;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (!validate(username, password)) {
        console.log("invalid username or password");
        alert("invalid username or password")
        return;
    }

    function callback() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log("logging!!!!");
                var result = xhr.responseText;
                var obj = JSON.parse(result);
                chrome.storage.local.set({
                        'prx_username': obj.prx_username,
                        'prx_password': obj.prx_password,
                        'prx_port': obj.prx_port,
                        'prx_host': obj.prx_host,
                        'prx_pac': obj.prx_pac,
                        'login_password': password,
                        'login_username': username
                    }
                );
                alert(obj.prx_pac);

            } else {
                alert(xhr.status);
            }
        }
    };

    var xhr = new XMLHttpRequest();
    let url = new URL('https://panjreh.ir/login');
    url.searchParams.set('u', username);
    url.searchParams.set('p', password);
    xhr.open("GET", url, true);
    xhr.onreadystatechange = callback;
    xhr.send();
}


function toggle() {
    var s = null;

    chrome.storage.local.get(['prx_mode'], function (data) {
        var x = document.getElementById("togglebtn");
        if (data.prx_mode === "enabled") {
            x.innerHTML = "Disabled";
            chrome.storage.local.set({'prx_mode': 'disabled'});
        } else {
            x.innerHTML = "Enabled";
            chrome.storage.local.set({'prx_mode': 'enabled'});
        }
    });

}

document.addEventListener('DOMContentLoaded', function () {
    var togglebtn = document.getElementById("togglebtn");
    var loginbtn = document.getElementById("loginbtn");

    chrome.storage.local.get(['prx_mode', 'login_username', 'login_password'], function (data) {
        if (data.login_username && data.login_password) {
            document.getElementById("username").value = data.login_username;
            document.getElementById("password").value = data.login_password;
        }
        if (data.prx_mode === 'enabled')
            togglebtn.innerHTML = "Enabled";
        else
            togglebtn.innerHTML = "Disabled";
    });
    togglebtn.addEventListener('click', toggle);
    loginbtn.addEventListener('click', login);
});