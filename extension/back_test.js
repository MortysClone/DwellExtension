
function update_tab(tabId, changeInfo, tab){      
    if (tab.url !== undefined && changeInfo.status == "complete" && tab.status == "complete"){
        chrome.tabs.get(tab.openerTabId, function(openerTab){
            if(openerTab.url.includes('www.google.com/search?') && (tab.url.includes("www.google.com/search?") == false)){
                console.log("이전탭은 검색탭 입니다.");
            }
        });
    }
}

function init(){
    //chrome이 종료되었을 때 
    //chrome.windows.onRemoved.addListener(exitChrome);
    //chrome.extension.onConnect.addListener(sendPopup);
    chrome.tabs.onUpdated.addListener(update_tab);
    //chrome.tabs.onActivated.addListener(activate_tab);
    //chrome.tabs.onRemoved.addListener(remove_tab);
}

init(); 
