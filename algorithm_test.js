/*
2O20.11.23
DEVELOPER kyb
contact haveyoubean@gmail.com
*/


let data = [
    {
        "url" : "gutte.tistory.com",
        "avg_dwelltime" : 1000, 
        "title" : "김치의 역사",
        "rank_score" : 0, 
        "views" : 321
    },
    {
        "url" : "www.naver.comsp",
        "avg_dwelltime" : 1001, 
        "title" : "김치 추천",
        "rank_score" : 0, 
        "views" : 32
    },
    {
        "url" : "www.naver.comsp",
        "avg_dwelltime" : 1001, 
        "title" : "김치 추천",
        "rank_score" : 0, 
        "views" : 2
    },
    {
        "url" : "www.google.com",
        "avg_dwelltime" : 1000, 
        "title" : "김치 다큐멘터리",
        "rank_score" : 0, 
        "views" : 3
    },
    {
        "url" : "www.daum.com",
        "avg_dwelltime" : 1001, 
        "title" : "내가 담군 김치가 최고지",
        "rank_score" : 0, 
        "views" : 93
    },
    {
        "url" : "gutte.tistory.com/323",
        "avg_dwelltime" : 1000, 
        "title" : "김치의 전쟁",
        "rank_score" : 0, 
        "views" : 178
    },
    {
        "url" : "gutte.tistory.com/13232",
        "avg_dwelltime" : 1001, 
        "title" : "김치란 무엇인가",
        "rank_score" : 0, 
        "views" : 17
    },
]

/*
1. calculator all dwell time avg 
*/

function all_Dtavg(){
    sum=0;
    d_avg=0;
    for(i=0; i<data.length; i++){
         sum+=data[i].avg_dwelltime;
    }
    d_avg=sum/data.length;
    return d_avg;
    
}
console.log(all_Dtavg());


/*
+) calculator all views avg

function Views_avg(){
    v_sum=0;
    v_avg=0;
    for(i=0; i<data.length; i++){
        v_sum+=data[i].views;
    }
    v_avg=v_sum/data.length;
    return v_avg;
}
console.log(Views_avg());
*/




/*
2.  choose array >= dwell time avg && sort array (priority views)
*/

function pick_out(){
    
    var pick_array=[];
    for(i=0; i<data.length; i++){
        if(d_avg<=data[i].avg_dwelltime){
          pick_array[i]=data[i];
          pick_array[i].rank_score=1;
        }else{
            pick_array[i]=data[i];
            pick_array[i].rank_score=-1;
        }
    }

    // priority rank 1 -> views
    pick_array.sort(function(a,b){
        if (a.rank_score < b.rank_score) return 1;
        if (a.rank_score > b.rank_score) return -1;

        if (a.views < b.views) return 1;
        if (a.views > b.views) return -1;
      
    });

    data=pick_array;
    return data;
 
}
pick_out();
console.log(pick_out());





/*
3. choose top 3 url ranking =1
else ranking -1 (exeption none, isn't engouht)
*/
function ranking(){
    for(i=0; i<data.length; i++){
        if((data[i].rank_score==1)&&(i<3)){
            data[i].rank_score=1;
        }else{
            data[i].rank_score=-1;
        }
    }
    return data;
}
ranking();
console.log("================ranking system================")
console.log(ranking());





/*
4. translation
  */

exports.getRank = function(data){
    pick_out();
    ranking();
    return data; 
  }


 






















