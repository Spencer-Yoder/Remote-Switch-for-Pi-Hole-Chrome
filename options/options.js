//Function that saves the key to storage
function setStorage() {
    chrome.storage.local.set({pi_uri_base: document.getElementById("pi_uri_base").value, api_key: document.getElementById("api_key").value, max_time: document.getElementById("max_time").value}, function () {
        document.getElementById("confirmation_status").innerHTML = "Saved Successful!";
    });
}

//Function that get the API key from the storage
function getStorage() {
    chrome.storage.local.get(null, function (data) {
		document.getElementById("pi_uri_base").defaultValue = data.pi_uri_base;
        document.getElementById("api_key").defaultValue = data.api_key;
        document.getElementById("max_time").defaultValue = data.max_time;
    });
}

document.getElementById("save_button").addEventListener("click", setStorage);   //Action event for when save is pressed
window.addEventListener("load", getStorage);    //Get the API key when the page loads
