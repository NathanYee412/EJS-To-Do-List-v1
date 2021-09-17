const express = require("express");
const bodyParser = require("body-parser");


const app = express();

// set view engine to use ejs
app.set("view engine", "ejs");



app.get("/", (req, res) => {

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    let today = new Date();
    let currentDay = today.getDay();
    let day = "";

    if(currentDay === 6 || currentDay === 0) {
        day = "Weekend";

    } else {
        day = "Weekday";
    }

    res.render('list', {dayType: days[currentDay]});
});



app.listen(3000, () => {
    console.log("app running on localhost:3000");
});