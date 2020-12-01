const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const recommend = require('./recommend');
const suggest = require('./suggest');

app.use(require("body-parser").json());
app.use(cors());


class DB {
    constructor() {
        this.connection = mysql.createConnection({
            host: "",
            user: 'tuuna',
            password: '',
            database: 'dwell'
        });
    }

    getInfo(searchWord) {
        /*
        https://stackoverflow.com/questions/34930771/why-is-this-undefined-inside-class-method-when-using-promises
        */
        let that = this;
        return new Promise(function(resolve, reject) {
            let sql = `SELECT * FROM search WHERE searchWord='${searchWord}'`;
            that.connection.query(sql, function(err, rows, fields) {
                if (err) {
                    return reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    storeInfo(tab) {
        console.log(tab['url']);
        console.log(tab['searchWord']);
        let sql = "INSERT INTO search (searchWord, date, dwellTime, title, url) VALUES (?,?,?,?,?)";
        let params = [tab['searchWord'], tab['date'], tab['dwellTime'], tab['title'], tab['url']];
        this.connection.query(sql, params, function(error, rows, fields) {
            if (error) {
                console.log("storeInfo() : " + error);
            } else {
                console.log("[+]Success : Insert Data in Database!");
            }
        });
    }
};

const db = new DB();
db.connection.connect();


app.post("/store", function(req, res) {
    const tab = {
        'title': req.body['title'],
        'url': req.body['url'],
        'date': req.body['date'],
        'dwellTime': req.body['dwell'],
        'searchWord': decodeURIComponent(req.body['searchWord'])
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
        'value': true
    });
});

//search는 검색어
app.get("/getinfo/:search", function(req, res) {
    const eachUrl = {}
    let data = [];
    console.log("=========================================");

    db.getInfo(req.params.search)
        .then(function(rows) {
            rows.map(function(e) {
                eachUrl[e['url']] = { 'dwellTime': [] };
            });
            rows.map(function(e) {
                eachUrl[e['url']]['dwellTime'].push(e['dwellTime']);
                eachUrl[e['url']]['title'] = e['title'];
            });
            for (let key in eachUrl) {
                if (eachUrl.hasOwnProperty(key)) {
                    eachUrl[key]['dwellTime'] = recommend.filterGarbage(eachUrl[key]['dwellTime']);
                    //eachUrl[key]['dwellTime'] = recommend.filterOutliers(eachUrl[key]['dwellTime']);
                    /* data processing */

                }
            }
            console.log("요청된 검색어  : " + req.params.search);
            /*
                요청된 검색어를 기반으로 데이터베이스에서 값을 뺴내 온 후
                getRank()함수에 필요한 데이터에 맞게 가공한다.
            */
            data = recommend.processing(eachUrl);
            /*
                getRank()함수를 통해 rank_score를 매긴다. 
            */
            data = suggest.getRank(data);
            /*
                sorting() 함수를 통해 rank_score가 1인것만 뽑아낸다. 
            */
            data = recommend.sorting(data);
            console.log(data);
            /*
                client 에게 sorting된 데이터를 전달한다. 
            */
            return res.json({
                'search': req.params.search,
                'value': data
            })
        })
        .catch(function(error) {
            console.log(error);
            return res.json({
                'search': 'X',
                'value': []
            });
        })
});

function init() {
    app.listen(3000, function() {
        console.log("server listen 3000 port start");
    });
}

init();