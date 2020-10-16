const fetch = require('node-fetch');

let tmp = {
    'tabId' : 1024,
    'title' : "김치란 무엇인가",  //해당 탭의 title
    'url' : "www.naver.com", //해당 탭의 url 
    'date' : new Date(),  //해당 탭을 연 날짜 
    'search_word' : "김치", //해당 탭을 만들어내게 한 검색 키워드 
    'dwell' : 0, //dwell time
    'now_dwell' : true //현재 dwell을 측정하고 있는가 아닌가
}

function getInfo(){
    fetch("http://127.0.0.1:3000/getinfo/asds")
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

function storeInfo(){
    data = JSON.stringify(tmp);
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

//getinfo();
storeInfo();