var API_KEY = null; //Temporary variable for the API-Key 

//Function called after the enable/disable button is pressed.
function buttonClicked() {
    var httpResponse = new XMLHttpRequest();    //Make a new object to accept return from server
    var url = null;

    if (document.getElementById("button1").value == "Disable") {  //If the Pi-Hole is currently ENABLED
        var time = document.getElementById("time").value;   //get the time from the box
        time = time * 60;   //get it in minutes
        url = "http://pi.hole/admin/api.php?disable=" + String(time) + "&auth=" + API_KEY;  //build the url
    }

    else if (document.getElementById("button1").value == "Enable") {  //If the Pi-Hole is currently DISABLED
        url = "http://pi.hole/admin/api.php?enable&auth=" + API_KEY;    //build the url
    }

    httpResponse.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Action to be performed when the document is read;
            var data = JSON.parse(this.response);   //parse the return JSON
            changeIcon(data);
        }
    };
    httpResponse.open("GET", String(url), true);
    httpResponse.send();
}

//Function that gets the current status of the Pi-Hole
function getPiHoleStatus() {
    getStorage();   //get the API key from local storage

    var httpResponse = new XMLHttpRequest();    //make a new request object

    httpResponse.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Action to be performed when the document is read;
            var data = JSON.parse(this.response);   //parse the return JSON
            changeIcon(data);
        }
    };
    httpResponse.open("GET", "http://pi.hole/admin/api.php?", true);
    httpResponse.send();
}

function changeIcon(data) {

    if (data.status == "disabled") {  //If the Pi-Hole status is disabled
        document.getElementById("display_status").innerHTML = "Disabled";   //Set the popup text
        document.getElementById("display_status").className = "disabled";   //changed the text color
        document.getElementById("button1").value = "Enable";    //change the button for enable
        document.getElementById("time").disabled = true;    //disable the time input box
        chrome.browserAction.setBadgeText({ text: "Off" });  //set the badge to off
    }

    else if (data.status == 'enabled') {    //If the Pi-Hole is enabled
        document.getElementById("display_status").innerHTML = "Enabled";    //Set the popup text
        document.getElementById("display_status").className = "enabled";    //set the text color
        document.getElementById("button1").value = "Disable";   //change the button text
        document.getElementById("time").disabled = false;   //turn on the input box
        chrome.browserAction.setBadgeText({ text: "On" });   //set badge text to on
    }

    else {   //If there is an API key error
        document.getElementById("display_status").innerHTML = "API Error";    //Set the popup text
        document.getElementById("display_status").className = "disabled";    //set the text color
        document.getElementById("button1").value = "";   //change the button text
        document.getElementById("time").disabled = true;   //turn off the input box
        chrome.browserAction.setBadgeText({ text: "" });   //set badge text to empty
    }
}

//Function thats the API key from local storage
function getStorage() {
    chrome.storage.local.get('api_key', function (data) {
        API_KEY = data.api_key;
    });
}
document.getElementById("button1").addEventListener("click", buttonClicked);    //Action listener for button clicked
document.addEventListener("DOMContentLoaded", getPiHoleStatus); //When the page loads get the status