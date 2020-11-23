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

    let port = chrome.extension.connect({
        name: "Sample Communication"
    });
    port.postMessage("Hi BackGround");
    //if msg is string, show as it is
    port.onMessage.addListener(function(msg) {
        /* const id = document.querySelector("#middle-content");
        id.innerText = msg[0]['url']; */
        const ul = document.querySelector("#list");
        if(msg.length == 0){
            const p = document.createElement("p");
            p.innerText = "No Search Tab";
            p.setAttribute('id', "middle-content");
            ul.appendChild(p);
            return;
        }
        
        /*
        e is json - dwellTime, views, url 
        */
        msg.forEach(function(e) {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.setAttribute('href', e['url']);
            a.setAttribute('class', "tip");
            const span = document.createElement("span");
            span.innerHTML = "dwell time : " + e['dwellTime'] + "<br>" + "views : " + e['views'];
            a.innerText = e['url'];
            a.appendChild(span);
            li.appendChild(a);
            ul.appendChild(li);
        });
    });
}

init();