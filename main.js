function disableProxy() {
    chrome.storage.sync.set({'prx_enabled': false});
}

function setProxy() {
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

    chrome.storage.sync.get('proxy_status', function (data) {
        var x = document.getElementById("togglebtn");
        if (data.proxy_status === "Enabled") {
            x.innerHTML = "Disabled";
            chrome.storage.sync.set({'proxy_status': "Disabled"});
            disableProxy();
        } else {
            setProxy();
            x.innerHTML = "Enabled";
            chrome.storage.sync.set({'proxy_status': "Enabled"});
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
    chrome.storage.sync.get('proxy_status', function (data) {
        if (data.proxy_status != null)
            togglebtn.innerHTML = data.proxy_status;
        else
            togglebtn.innerHTML = "Disabled";
    });
    togglebtn.addEventListener('click', toggle);
    loginbtn.addEventListener('click', saveInput);
});


