class person{
    constructor(name){
        this.name = name;
    }
}


a = []; 
a.push(new person("tuuna"));
a.push(new person("kissesy"));
//console.log(a);
/*
b = a.some(function(e){
    return (e.name === 'tuuna');
});
*/
//deep copy 하는법 알기 
a.some(function(e){
    console.log(e);
    if(e.name === 'tuuna'){
        return true;
    }
});
 
//console.log(a);