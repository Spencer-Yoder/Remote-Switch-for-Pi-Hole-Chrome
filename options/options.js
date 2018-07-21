//Function that saves the key to storage
function setStorage() {
    chrome.storage.local.set({api_key: document.getElementById("api_key").value}, function () {
        document.getElementById("confirmation_status").innerHTML = "Saved Successful!";
        console.log(document.getElementById("api_key").value + " From Form");
    });
}

//Function that get the API key from the storage
function getStorage() {
    chrome.storage.local.get('api_key', function (data) {
        document.getElementById("api_key").defaultValue = data.api_key;
        console.log(data.api_key);
    });
}

document.getElementById("save_button").addEventListener("click", setStorage);   //Action event for when save is pressed
window.addEventListener("load", getStorage);    //Get the API key when the page loads
