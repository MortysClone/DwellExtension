const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express(); 
const recommend = require('./recommend');

app.use(require("body-parser").json());
app.use(cors());


class DB{
    constructor(){
        this.connection = mysql.createConnection({
            host : "localhost",
            user : 'tuuna',
            password : '',
            database : 'dwell'
        });
    }

    getInfo(searchWord){
        /*
        https://stackoverflow.com/questions/34930771/why-is-this-undefined-inside-class-method-when-using-promises
        */
        let that = this;
        return new Promise(function(resolve, reject){
            let sql = `SELECT * FROM search WHERE searchWord='${searchWord}'`;
            that.connection.query(sql, function(err, rows, fields){
                if(err){
                    return reject(err);
                }else{
                    resolve(rows);
                }
            });
        }); 
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
    const eachUrl = {} 
    let data = [];
    console.log("=========================================");
    console.log("요청된 검색어  : " + req.params.search);
    db.getInfo(req.params.search)
    .then(function(rows){
        rows.map(function(e){
            eachUrl[e['url']] = {'dwellTime' : []}; 
        });
        rows.map(function(e){
            eachUrl[e['url']]['dwellTime'].push(e['dwellTime']);
        });
        for(let key in eachUrl){
            if(eachUrl.hasOwnProperty(key)){
                eachUrl[key]['dwellTime'] = recommend.filterGarbage(eachUrl[key]['dwellTime']);
                //eachUrl[key]['dwellTime'] = recommend.filterOutliers(eachUrl[key]['dwellTime']);
                /* data processing */
                data = recommend.processing(eachUrl);
            }
        }
        /*
        suggestion url usin data
        */        
        let urls = [
            {
                'url' : "www.google.com", 
                "dwellTime" : 32, 
                "views" : 123
            },
            {
                'url' : "www.naver.com", 
                "dwellTime" : 323, 
                "views" : 72
            },
            {
                'url' : "www.daum.com", 
                "dwellTime" : 1222, 
                "views" : 12
            }
        ]
        /*
        console.log("해당 검색어에 대한 추천 URL을 생성합니다.\n");
        console.log("[추천 URL List]");
        console.log(`[+] : ${urls[0]}`); 
        console.log(`[+] : ${urls[1]}`); 
        console.log(`[+] : ${urls[2]}`); 
        console.log("=========================================\n"); */
        return res.json({
            'value' : urls
        })
    })
    .catch(function(error){
        console.log(error);
        return res.json({
            'value' : []
        });
    })
});

function init(){
    app.listen(3000, function(){
        console.log("server listen 3000 port start");
    });
}

init();