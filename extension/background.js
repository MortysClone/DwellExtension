const host = "";
const port = 3000;
let TabObjs = [];

class Tab {
    constructor(tabId, title, url, openerTabUrl) {
        this.tabId = tabId;
        this.url = decodeURI(url);
        this.date = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
        this.dwell = 0;
        this.isDwell = false;
        this.interval = undefined;
        this.title = title;
        this.searchWord = decodeURI(getUrlVars(openerTabUrl).q);
        this.openerTabUrl = openerTabUrl;
    }

    recordTime() {
        this.dwell += 1;
        console.log(this.title + " : " + this.dwell);
    }

    startDwell() {
        //https://stackoverflow.com/questions/18283095/integer-returning-as-nan-when-added
        console.log("해당 객체에 대해 체류시간을 측정합니다");
        this.isDwell = true;
        this.interval = setInterval(this.recordTime.bind(this), 1000);
    }

    stopDwell() {
        console.log("기존의 체류시간 측정을 멈춥니다.");
        clearInterval(this.interval);
        this.isDwell = false;
    }

    sendTabInfo() {
        console.log(this.title);
        console.log(this.searchWord);
        let data = JSON.stringify({
            'title': this.title,
            'url': this.url,
            'date': this.date,
            'searchWord': this.searchWord,
            'dwell': this.dwell
        });
        fetch(`http://${host}:${port}/store`, {
                headers: { 'Content-Type': 'application/json' },
                method: 'POST',
                body: data
            })
            .then(function(response) {
                return response.json();
            })
            .catch(function(error) {
                console.log(error);
            })
            .then(function(myJson) {
                console.log(JSON.stringify(myJson));
            });
    }
}

//기존의 dwell을 하고 있다면 멈춘다. 그리고 현재 보고 있는 탭이 TabsObj에 들어있는 탭이라면 이 탭의 dwell을 활성화 시킨다.
function activate_tab(activeInfo) {
    TabObjs.some(function(e) {
        if (e.isDwell === true) {
            e.stopDwell();
            return true;
        }
    });
    console.log("현재 활성화 시킨 탭이 추적탭에 포함되는지 확인합니다.");
    TabObjs.some(function(e) {
        if (e.tabId === activeInfo.tabId) {
            e.startDwell();
            console.log("포함되어 있습니다. 체류시간 측정을 시작합니다.");
            return true;
        }
    })

}

chrome.windows.onRemoved.addListener(function(windowId) {
    //alert("브라우저가 갑작스럽게 멈췄습니다. "); //갑작스러운 클라이언트 종료시 모든 정보 서버로 전송
    TabObjs.forEach(function(e) {
        if (e.isDwell === true) {
            e.stopDwell();
        }
        e.sendTabInfo();
    })
});

function getUrlVars(href) {
    let vars = [],
        hash;
    let hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

/*
탭이 업데이트 될 때 이전탭이 검색탭이였는지 검사한다. 
refresh같은 경우에도 이렇게 뜨는 경우가 있어서 
tabId로 판별
검색탭에서 검색탭을 호출했을때도 체킹하기 
Update하면 탭을 작업큐에 넣어서 다른 탭이 Update되더라도 체킹할 수 있게 하자
*/
function update_tab(tabId, changeInfo, tab) {
    if (tab.url !== undefined && changeInfo.status == "complete" && tab.status == "complete") {
        //TabObjs에 있는지 확인
        /*if(tab.url.includes('www.google.com/search?')){
                console.log("현재 탭은 검색탭입니다. 검색어를 추천합니다");
                getUrls(getUrlVars(tab.url).q); //해당 함수는 Promise로 비동기 방식으로 작동한다. 실행 순서 보장 X 
        } */
        let existElement = TabObjs.some(function(e) {
            return (e.tabId === tab.id);
        });
        if ((!existElement) && (tab.openerTabId !== undefined) && (tab.title !== '새 탭')) {
            //새로운 탭이 만들어지면 현재 탭이 어떤 탭으로 부터 만들어졌는지 가지고 온다.  async로 바꿀 수 있으면 바꾸자 
            chrome.tabs.get(tab.openerTabId, function(openerTab) {
                if (openerTab.url.includes('www.google.com/search?') && (tab.url.includes('www.google.com/search?') == false)) {
                    console.log("이전탭은 검색탭입니다.");
                    TabObjs.push(new Tab(tab.id, tab.title, tab.url, openerTab.url));
                    //컨트롤 클릭으로 create -> update, 활성화 시키지 않고 탭을 여는 경우가 있어 chrome tabs query로 현재 탭이 활성화 상태인지 확인 후 드웰 체크
                    if (!tab.active) {
                        console.log("새로 띄운 탭을 보고 있지 않습니다.");
                    } else {
                        console.log("Update된 탭을 보고 계십니다."); //그럼 dwell time start! 
                        TabObjs.some(function(e) {
                            if (e.tabId === tab.id) {
                                e.startDwell();
                                return true;
                            }
                        })
                    }
                } else {
                    console.log("이전탭은 검색탭이 아닙니다.");
                }
            });
        }
    }
}




function remove_tab(tabId, removeInfo) {
    TabObjs = removeElement(tabId);

}

function removeElement(tabId) {
    return TabObjs.filter(function(e) {
        if (e.tabId === tabId) {
            if (e.isDwell === true) {
                e.stopDwell();
            }
            e.sendTabInfo();
            return false;
        }
        return true;
    });
}


//catch 하기 
function getUrls(searchWord) {
    return fetch(`http://${host}:${port}/getinfo/${searchWord}`)
        .then(function(response) {
            return response.json();
        })
        .catch(function(error) {
            return { "value": ["FETCH FAILED"] };
        })
        .then(function(json) {
            return json;
        });
}

//팝업창 클릭시 백그라운드 쪽으로 신호를 주고 백그라운드는 신호를 받고 검색 url을 넘김
function sendPopup(port) {
    console.log("Connected .....");
    port.onMessage.addListener(function(msg) {
        console.log("message recieved" + msg);
        chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
            if (tabs[0].url.includes('www.google.com/search?')) {
                port.postMessage("Search Tab");
                getUrls(getUrlVars(tabs[0].url).q)
                    .then(function(result) {
                        console.log(result);
                        port.postMessage(result);
                    });
            } else {
                //]해당 탭을 TabObjs에서 검사하고 있다면 searchword가지고와서 보내기 
                let check = false;
                TabObjs.some(function(e) {
                    if (e.tabId === tabs[0].id) {
                        getUrls(getUrlVars(e.openerTabUrl).q)
                            .then(function(result) {
                                port.postMessage(result);
                            });
                        check = true;
                        return true;
                    }
                })
                if (check == false) {
                    port.postMessage({
                        'search': 'X',
                        'value': []
                    });
                }
                check = false;
            }
        });
    });
}

function exitChrome(windowId) {
    alert("chrome is exited");
}

function init() {
    //chrome이 종료되었을 때 
    //chrome.windows.onRemoved.addListener(exitChrome);
    chrome.extension.onConnect.addListener(sendPopup);
    chrome.tabs.onUpdated.addListener(update_tab);
    chrome.tabs.onActivated.addListener(activate_tab);
    chrome.tabs.onRemoved.addListener(remove_tab);
}

init();