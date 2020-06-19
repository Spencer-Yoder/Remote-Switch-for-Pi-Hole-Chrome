var API_KEY = null; //Temporary variable for the API-Key 
var MAX_TIME = null;

//Function called after the enable/disable button is pressed.
function buttonClicked() {
    var httpResponse = new XMLHttpRequest();    //Make a new object to accept return from server
    var url = null;

    if (!document.getElementById("sliderBox").checked) {
        var time = document.getElementById("time").value;   //get the time from the box
        console.log(MAX_TIME + "!!!");

        if(Number(time) <= Number(MAX_TIME)){
            console.log(time + " " + MAX_TIME);
            time = time * 60;
            console.log("a"+ time);
        }
        else{
            time = MAX_TIME * 60;
            console.log("b");
        }

        console.log(time + "***");

        //time = time * 60;   //get it in minutes
        url = "http://pi.hole/admin/api.php?disable=" + String(time) + "&auth=" + API_KEY;  //build the url
    }

    else if (document.getElementById("sliderBox").checked) {
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
        document.getElementById("sliderBox").checked = false;
        document.getElementById("time").disabled = true;    //disable the time input box
        chrome.browserAction.setBadgeText({ text: "Off" });  //set the badge to off
    }

    else if (data.status == 'enabled') {    //If the Pi-Hole is enabled
        document.getElementById("display_status").innerHTML = "Enabled";    //Set the popup text
        document.getElementById("display_status").className = "enabled";    //set the text color
        document.getElementById("time").disabled = false;   //turn on the input box
        document.getElementById("sliderBox").checked = true;
        chrome.browserAction.setBadgeText({ text: "On" });   //set badge text to on
    }

    else {   //If there is an API key error
        document.getElementById("display_status").innerHTML = "API Error";    //Set the popup text
        document.getElementById("display_status").className = "disabled";    //set the text color
        document.getElementById("time").disabled = true;   //turn off the input box
        chrome.browserAction.setBadgeText({ text: "" });   //set badge text to empty
    }
}

//Function thats the API key from local storage
function getStorage() {
    chrome.storage.local.get('api_key', function (data) {
        API_KEY = data.api_key;
    });

    chrome.storage.local.get('max_time', function (data) {
        MAX_TIME = data.max_time;
        console.log(MAX_TIME);
    });
}

function whitelist() {
    var httpResponse = new XMLHttpRequest();    //Make a new object to accept return from server
    var list = "white";
    var domain = document.getElementById("domain").value;   //Get the domain from the box
    if(domain === "") return; //Don't do anything if domain is empty

    if(document.getElementById("wild").checked) list = "white_wild"; //Set wildcard mode

    var url = "http://pi.hole/admin/api.php?list=" + list + "&add="+ encodeURI(domain) + "&auth=" + API_KEY;  //build the url

    httpResponse.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if(this.response.startsWith("Success")){

                //Get current tab
                chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                    //Reload tab if tab url contains the whitelisted url
                    if (tabs[0].url.includes(document.getElementById("domain").value)) {
                        chrome.tabs.reload(tabs[0].id);
                    }
                    document.getElementById("domain").value = ""; //Clear the text field
                });
            }
        }
    };
    httpResponse.open("GET", String(url), true);
    httpResponse.send();
}


document.addEventListener("DOMContentLoaded", getPiHoleStatus); //When the page loads get the status
document.getElementById("sliderBox").addEventListener('change', buttonClicked);    //When the pi-hole toggle is clicked
document.getElementById("whitelist").addEventListener('click', whitelist);    //When the whitelist button is clicked

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    document.getElementById("domain").value = (new URL(tabs[0].url)).hostname; //Set domain text field value to current hostname
});