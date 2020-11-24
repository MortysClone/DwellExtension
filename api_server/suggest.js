/*
2O20.11.23
DEVELOPER kyb
contact haveyoubean@gmail.com
*/
/*
1. calculator all dwell time avg 
*/

function all_Dtavg(data){
    sum=0;
    d_avg=0;
    for(i=0; i<data.length; i++){
         sum+=data[i].avg_dwelltime;
    }
    d_avg=sum/data.length;
    return d_avg;
    
}
//console.log(all_Dtavg());
/*
2.  choose array >= dwell time avg && sort array (priority views)
*/

function pick_out(data){
    all_Dtavg(data);
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
//pick_out();
//console.log(pick_out());

/*
3. choose top 3 url ranking =1
else ranking -1 (exeption none, isn't engouht)
*/
function ranking(data){
    for(i=0; i<data.length; i++){
        if((data[i].rank_score==1)&&(i<3)){
            data[i].rank_score=1;
        }else{
            data[i].rank_score=-1;
        }
    }
    return data;
}
/*
ranking();
console.log("================ranking system================")
console.log(ranking());
*/
/*
4. translation
  */

exports.getRank = function(data){
    data = pick_out(data);
    ranking(data);
    return data; 
  }


 






















