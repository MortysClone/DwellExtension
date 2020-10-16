const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express(); 


//app.use(express.json());
//app.use(express.urlencoded({extended: true}))
app.use(require("body-parser").json())
app.use(cors());

/*
let tmp = {
                'tabId' : tab.id,
                'title' : tab.title,  //해당 탭의 title
                'url' : tab.url, //해당 탭의 url 
                'date' : new Date(),  //해당 탭을 연 날짜 
                'search_word' : getUrlVars(tab.url).q, //해당 탭을 만들어내게 한 검색 키워드 
                'dwell' : 0, //dwell time
                'now_dwell' : true //현재 dwell을 측정하고 있는가 아닌가
            }
*/
app.post("/store", function(req, res){
    console.log("store info");
    console.log(req.body);
    return res.json({
        'value' : true
    });
});

//search는 검색어
app.get("/getinfo/:search", function(req, res){
    console.log("get info about search : " + req.params.search);
    return res.json({
        'value' : ["www.naver.com", "www.youtube.com", "www.google.com"]
    });
});

app.listen(3000, function(){
    console.log("server listen 3000 port start");
});