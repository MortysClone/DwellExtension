const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express(); 

app.use(require("body-parser").json());
app.use(cors());


class DB{
    constructor(){
        this.connection = mysql.createConnection({
            host : "localhost",
            user : '',
            password : '',
            database : 'dwell'
        });
    }

    getInfo(searchWord){
        let sql = `SELECT * FROM search WHERE searchWord=${searchWord}`;
        this.connection.query(sql, function(error, rows, fileds){
            if(error){
                console.log("getInfo() error : "+error);
            } else{
                console.log("[+]Success : Get Data in Database!");
            }
        })
    }

    storeInfo(tab){
        let sql = "INSERT INTO search (searchWord, date, dwellTime, title, url) VALUES (?,?,?,?,?)";
        let params = [tab['searchWord'], tab['date'], tab['dwellTime'], tab['title'], tab['url']];
        this.connection.query(sql, params, function(error, rows, fields){
            if(error){
                console.log("storeInfo() : "+error);
            }else{
                console.log("[+]Success : Insert Data in Database!");
            }
        });
    }
};

const db = new DB(); 
db.connection.connect();


app.post("/store", function(req, res){
    const tab = {
        'title' : req.body['title'],
        'url' : req.body['url'],
        'date' : req.body['date'],
        'dwellTime' : req.body['dwell'],
        'searchWord' : req.body['searchWord']
    };
    console.log("=========================================");
    console.log("탭에 대한 정보가 저장되었습니다.");
    console.log(`탭 Title : ${tab['title']}`);
    console.log(`탭 URL : ${tab['url']}`);
    console.log(`탭 날짜 : ${tab['date']}`);
    console.log(`탭 체류시간 : ${tab['dwellTime']}`);
    console.log(`검색어 : ${tab['searchWord']}`);
    console.log("=========================================\n");
    db.storeInfo(tab);
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




function init(){
    app.listen(3000, function(){
        console.log("server listen 3000 port start");
    });
}

init();