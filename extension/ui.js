const test = document.getElementById("test");
test.innerText = "GOOD";
console.log("hello world");
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (!sender) {
            return;
        }
        console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
        if (request.greeting === "hello"){
            //const test = document.querySelector("#test");
            //test.innerText = "GOOD";    
            sendResponse({farewell: "goodbye"});
        }
    return true;
});