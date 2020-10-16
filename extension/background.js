

let TabObjs = []; 

class Tab{
    constructor(tabId, title, url){
        this.tabId = tabId; 
        this.url = url; 
        this.date = new Date();
        this.dwell = 0;
        this.isDwell = false;
        this.interval = undefined;
        this.title = title;
        this.searchWord = getUrlVars(this.url).q;
    }

    recordTime(){
        this.dwell+=1; 
        console.log(this.title+ " : " + this.dwell);
    }

    startDwell(){
        //https://stackoverflow.com/questions/18283095/integer-returning-as-nan-when-added
        //위에꺼 보고 해결
        console.log("해당 객체에 대해 체류시간을 측정합니다");
        this.isDwell = true;
        this.interval = setInterval(this.recordTime.bind(this), 1000);
    }

    stopDwell(){
        clearInterval(this.interval);
        this.isDwell = false;
    }

    sendTabInfo(){
        console.log(this.searchWord);
        let data = JSON.stringify({
            'tabId' : this.tabId, 
            'url' : this.url, 
            'date' : this.date, 
            'searchWord' : this.searchWord,
            'dwell' : this.dwell
        });
        fetch("http://127.0.0.1:3000/store", {
            headers: {'Content-Type': 'application/json'},
            method : 'POST',
            body: data
        })
        .then(function(response){
            return response.json();
        })
        .catch(function(error){
            console.log(error);
        })
        .then(function(myJson){
            console.log(JSON.stringify(myJson));
        });
    }
}

function create_tab(tab){
    console.log("create");
}
    
//기존의 dwell을 하고 있다면 멈춘다. 그리고 현재 보고 있는 탭이 TabsObj에 들어있는 탭이라면 이 탭의 dwell을 활성화 시킨다.
function activate_tab(activeInfo){ 
    console.log("activate");
    
    TabObjs.some(function(e){
        if(e.isDwell === true){
            e.stopDwell();
            console.log("기존의 체류시간 측정을 멈춥니다.");
            return true;
        }
    });
    console.log("현재 활성화 시킨 탭이 추적탭에 포함되는지 확인합니다.");
    TabObjs.some(function(e){
        if(e.tabId === activeInfo.tabId){
            e.startDwell();
            console.log("포함되어 있습니다. 체류시간 측정을 시작합니다.");
            return true;
        }
    }) 
    
}

function getUrlVars(href)
{
    let vars = [], hash;
    let hashes = href.slice(href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}


function getUrls(searchWord){
    console.log("request");
    fetch(`http://127.0.0.1:3000/getinfo/${searchWord}`)
    .then(function(response){
        return response.json();
    })
    .catch(function(error){
        console.log(error);
    })
    .then(function(myJson){
        console.log(JSON.stringify(myJson));
    });
}
    //탭이 업데이트 될 때 이전탭이 검색탭이였는지 검사한다. 
    //refresh같은 경우에도 이렇게 뜨는 경우가 있어서 
    //tabId로 판별
    //검색탭에서 검색탭을 호출했을때도 체킹하기 
    //Update하면 탭을 작업큐에 넣어서 다른 탭이 Update되더라도 체킹할 수 있게 하자 .

function update_tab(tabId, changeInfo, tab){      
    if (tab.url !== undefined && changeInfo.status == "complete" && tab.status == "complete"){
        console.log("update");
        //TabObjs에 있는지 확인
        if(tab.url.includes('www.google.com/search?')){
                console.log("현재 탭은 검색탭입니다. 검색어를 추천합니다");
                getUrls(getUrlVars(tab.url).q); //해당 함수는 Promise로 비동기 방식으로 작동한다. 실행 순서 보장 X 
                return;
        } 
        let existElement = TabObjs.some(function(e){
            return (e.tabId === tab.id);
        });
        console.log("존재하나요? : "+existElement);
        console.log(TabObjs);
        //현재 탭이 검색탭이라면 검색어 추천도 여기서
        if((!existElement) &&(tab.openerTabId !== undefined) && (tab.title !== '새 탭')){
            //새로운 탭이 만들어지면 현재 탭이 어떤 탭으로 부터 만들어졌는지 가지고 온다.  async로 바꿀 수 있으면 바꾸자 
            chrome.tabs.get(tab.openerTabId, function(openerTab){
                if(openerTab.url.includes('www.google.com/search?')){
                    console.log("이전탭은 검색탭입니다.");
                    TabObjs.push(new Tab(tab.id, tab.title, tab.url)); 
                    //컨트롤 클릭으로 create -> update, 활성화 시키지 않고 탭을 여는 경우가 있어 chrome tabs query로 현재 탭이 활성화 상태인지 확인 후 드웰 체크
                    if(!tab.active){
                        console.log("새로 띄운 탭을 보고 있지 않습니다."); 
                    }else{
                        console.log("Update된 탭을 보고 계십니다."); //그럼 dwell time start! 
                        TabObjs.some(function(e){
                            if(e.tabId === tab.id){
                                e.startDwell();
                                return true;
                            }
                        })
                    }
                } else{
                    console.log("이전탭은 검색탭이 아닙니다.");
                }
            });
        }
    }
}

    
function remove_tab(tabId, removeInfo){
    console.log("remove");
    TabObjs = removeElement(tabId);
    
}

function removeElement(tabId){
    return TabObjs.filter(function(e){
        if(e.tabId === tabId){
            if(e.isDwell === true){
                e.stopDwell();
            }
            e.sendTabInfo();
            return false;
        }
        return true;
    });
}


function init(){
    //console.log(handler);
    chrome.tabs.onCreated.addListener(create_tab);
    chrome.tabs.onUpdated.addListener(update_tab);
    chrome.tabs.onActivated.addListener(activate_tab);
    chrome.tabs.onRemoved.addListener(remove_tab);
}

init(); 
/*
async function main() {
    for (x = 0; x < 5; x++) {
        console.log('start of my script');
        let tab = await chromeTabsCreateAsync({ url: "about:blank", active: false });
        console.log('Tab created: ' + tab.id);
        console.log('end of my script');
    }
}

main();
*/