const express = require("express");
const bodyParser = require("body-parser");


const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
// set view engine to use ejs
app.set("view engine", "ejs");


let items = [];
let workItems = []; 

app.get("/", (req, res) => {

    let options = { 
        weekday: 'long',
        day: 'numeric',
        month: "long"
    };

    let today = new Date();

    let day = today.toLocaleDateString("en-US", options);

    
    res.render('list', {listTitle: day, newListItems: items});
});


app.post("/", (req, res) => {

    if(req.body.list === "Work") {
        let item = req.body.newItem; 
        workItems.push(item);
        res.redirect("/work");

        console.log(workItems);
    } else {
        items.push(req.body.newItem);
        res.redirect("/");
    }


    

});


app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", (req, res) => {
    let item = req.body.workItem; 
    workItems.push(item);
    res.redirect("/work");
});


app.listen(3000, () => {
    console.log("app running on localhost:3000");
});