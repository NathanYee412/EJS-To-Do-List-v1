const express = require("express");
const bodyParser = require("body-parser");


const app = express();

// set view engine to use ejs
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded());


app.get("/", (req, res) => {

    let options = { 
        weekday: 'long',
        day: 'numeric',
        month: "long"
    };

    let today = new Date();

    let day = today.toLocaleDateString("en-US", options);

    const listItem = String(req.body.listItem);

    console.log(listItem);


    
    res.render('list', {dayType: day});
});



app.listen(3000, () => {
    console.log("app running on localhost:3000");
});