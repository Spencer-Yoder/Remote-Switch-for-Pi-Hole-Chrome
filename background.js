checkStatus();  //Get the current status when the browser opens
window.setInterval(checkStatus, 30000); //Keep checking every 30 seconds

//Get the current status
function checkStatus() {
    var httpResponse = new XMLHttpRequest();    //make a new request

    httpResponse.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // Action to be performed when the document is read;
            var data = JSON.parse(this.response);

            if (data.status == "disabled") {  //If disabled set badge
                chrome.browserAction.setBadgeText({ text: "Off" });
            }

            else if (data.status == 'enabled') {    //else turn on badge
                chrome.browserAction.setBadgeText({ text: "On" });
            }
        }
        else {
            chrome.browserAction.setBadgeText({ text: "" });
        }
    };
    httpResponse.open("GET", "http://pi.hole/admin/api.php?", true);
    httpResponse.send();
}