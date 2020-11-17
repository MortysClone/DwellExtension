function init() {
    document.addEventListener('DOMContentLoaded', function() {
        var links = document.getElementsByTagName("a");
        for (var i = 0; i < links.length; i++) {
            (function() {
                var ln = links[i];
                var location = ln.href;
                ln.onclick = function() {
                    chrome.tabs.create({ active: true, url: location });
                };
            })();
        }
    });

    var port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
        const ul = document.querySelector("#list");
        console.log(typeof(msg));
        msg.forEach(function(e) {
            const li = document.createElement("li");
            const span = document.createElement("span");
            span.innerText = e;
            li.appendChild(span);
            ul.appendChild(li);
        });
    });
}

init();