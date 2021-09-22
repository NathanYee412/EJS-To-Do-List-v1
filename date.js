//jshint esversion:6

exports.getDate = function() {

    let options = { 
        weekday: 'long',
        day: 'numeric',
        month: "long"
    };
    
    let today = new Date();
    
    return today.toLocaleDateString("en-US", options);
    
}

exports.getDay = function() {

    let options = { 
        weekday: 'long',
    };
    
    let today = new Date();
    
    return today.toLocaleDateString("en-US", options);

}



// long hand version below 

// module.exports.getDate = getDate;

// function getDate(){

//     let options = { 
//         weekday: 'long',
//         day: 'numeric',
//         month: "long"
//     };
    
//     let today = new Date();
    
//     let day = today.toLocaleDateString("en-US", options);
    
//     return day;
// }

// module.exports.getDay = getDay;

// function getDay(){

//     let options = { 
//         weekday: 'long',
//     };
    
//     let today = new Date();
    
//     let day = today.toLocaleDateString("en-US", options);
    
//     return day;
// }


