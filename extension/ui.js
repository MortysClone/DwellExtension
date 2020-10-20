chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log(sender.tab ?
                  "from a content script:" + sender.tab.url :
                  "from the extension");
      if (request.greeting === "hello"){
        const test = document.querySelector("#test");
        test.innerText = "GOOD";
            sendResponse({farewell: "goodbye"});
      }
});