const LOW = 1; 
const MID = 5; 
const HIGH = 10; 

exports.recommendUrl = function(data){
    data.forEach(function(e){
        if(e['avg'] >= 3 && e['avg'] < 120){
            e['rank'] = e['views'] * LOW;
        }else if(e['avg'] >= 120 && e['avg'] < 900){
            e['rank'] = e['views'] * MID;
        } else if(e['avg'] >= 900){
            e['rank'] = e['views'] * HIGH;
        }
    });
}

exports.filterOutliers = function(someArray) {  
    // Copy the values, rather than operating on references to existing values
    let values = someArray.concat();

    // Then sort
    values.sort( function(a, b) {
            return a - b;
         });

    /* Then find a generous IQR. This is generous because if (values.length / 4) 
     * is not an int, then really you should average the two elements on either 
     * side to find q1.
     */     
    let q1 = values[Math.floor((values.length / 4))];
    // Likewise for q3. 
    let q3 = values[Math.ceil((values.length * (3 / 4)))];
    let iqr = q3 - q1;

    // Then find min and max values
    let maxValue = q3 + iqr*1.5;
    let minValue = q1 - iqr*1.5;

    // Then filter anything beyond or beneath these values.
    let filteredValues = values.filter(function(x) {
        return (x <= maxValue) && (x >= minValue);
    });

    // Then return
    return filteredValues;
}
/*
2초 이하의 값들을 제거 
*/
exports.filterGarbage = function(values){
    let filteredValues = values.filter(function(x){
        return (x >= 3);
    });
    return filteredValues;
}

exports.processing = function(values){
    const data = [];
    for(let key in values){
        if(values.hasOwnProperty(key)){
            //console.log(values[key]['DwellTime']);
            let avg = values[key]['dwellTime'].reduce(function add(sum, currValue){
                return sum+currValue;
            });
            let views = values[key]['dwellTime'].length
            data.push({
                "url" : key, 
                "views" : views,
                "rank_score" : 0,
                "avg_dwelltime" : Math.floor(avg/views),
                'title' : values[key]['title']
            });
        }
    }
    return data;
}

exports.sorting = function(values){
    let sortedValues = values.filter(function(e){
        return (e['rank_score'] == 1);
    });
    return sortedValues; 
}

/*
이상치를 제거해서 나온 평균값을 사용 
아래 data값은 사이트들을 평균값 내서 가지고 온거임
*/
