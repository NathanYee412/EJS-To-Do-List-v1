const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
// set view engine to use ejs
app.set("view engine", "ejs");


var items = [];


app.get("/", (req, res) => {

    let options = { 
        weekday: 'long',
        day: 'numeric',
        month: "long"
    };

    let today = new Date();

    let day = today.toLocaleDateString("en-US", options);

    
    
    res.render('list', {dayType: day, newListItems: items});
});


app.post("/", (req, res) => {

    items.push(req.body.newItem);

    res.redirect("/");

});


app.listen(3000, () => {
    console.log("app running on localhost:3000");
});