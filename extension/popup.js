var port = chrome.extension.connect({
    name: "Sample Communication"
});
port.postMessage("Hi BackGround");

/*
msg : array  
ex) msg = ['url', 'url', 'url']
*/
port.onMessage.addListener(function(msg) {
    const ul = document.querySelector("#list");
    console.log(typeof(msg));
    msg.forEach(function(e){
        const li = document.createElement("li");
        const span = document.createElement("span");
        span.innerText = e;
        li.appendChild(span);
        ul.appendChild(li);
    });
});
