const express = require('express');
const cors = require('cors');
//const bodyParser = require('body-parser');
const app = express(); 

const host = "localhost";
const port = 3306;
//app.use(express.json());
//app.use(express.urlencoded({extended: true}))
app.use(require("body-parser").json());
app.use(cors());


app.post("/store", function(req, res){
    console.log("=========================================");
    console.log("탭에 대한 정보가 저장되었습니다.");
    console.log(`탭 Title : ${req.body['title']}`);
    console.log(`탭 URL : ${req.body['url']}`);
    console.log(`탭 날짜 : ${req.body['date']}`);
    console.log(`탭 체류시간 : ${req.body['dwell']}`);
    console.log(`검색어 : ${req.body['searchWord']}`);
    console.log("=========================================\n");
    return res.json({
        'value' : true
    });
});

//search는 검색어
app.get("/getinfo/:search", function(req, res){
    const urls = ["www.naver.com", "www.youtube.com", "www.google.com"];
    console.log("=========================================");
    console.log("요청된 검색어  : " + req.params.search);
    console.log("해당 검색어에 대한 추천 URL을 생성합니다.\n");
    console.log("[추천 URL List]");
    console.log(`[+] : ${urls[0]}`); 
    console.log(`[+] : ${urls[1]}`); 
    console.log(`[+] : ${urls[2]}`); 
    console.log("=========================================\n");
    return res.json({
        'value' : urls
    });
});

app.listen(3000, function(){
    console.log("server listen 3000 port start");
});