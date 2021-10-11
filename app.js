const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { compile } = require("ejs");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
app.set("view engine", "ejs"); // set view engine to use ejs


//------------------------------------------------------------------------------------------------
// Mongoose setup
//------------------------------------------------------------------------------------------------


// connect to the mongoose db
mongoose.connect("mongodb://localhost:27017/todolistDB");

// create database items schema 
const itemsSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Please enter an item name"]
    }
});

// creating a mongoose model 
const itemModel = mongoose.model(
    "item",
    itemsSchema
);

// creating default documents
const defaultItem1 = new itemModel({
    itemName: "Welcome to your todo list"
});

const defaultItem2 = new itemModel({
    itemName: "Hit the + button to add a new item"
});

const defaultItem3 = new itemModel({
    itemName: "<--- hit the check box to delete an item"
});

// default item array
const defaults = [defaultItem1, defaultItem2, defaultItem3];


// printing items to console that are in mongoose
itemModel.find({}, (err, items)=>{
    if(err) {
        console.log(err);
    } else {
        console.log(items);
        items.forEach((item) =>{
            console.log(item.itemName);
        });
    }
});

//------------------------------------------------------------------------------------------------
// End of Mongoose setup
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Routes setup
//------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {

    itemModel.find({}, (err, foundItems) => {
        if(err){
            console.log(err);
        } else{

            // checking if found items is zero then inserting the defaults if it is
            if(foundItems.length === 0) {
                itemModel.insertMany(defaults, (err) => {
                    if(err){
                        console.log(err);
                    } else{
                        console.log("successfully inserted the default documents");
                    }
                });

                // redirect after default items are inserted
                res.redirect("/");
            } else {
                res.render('list', {listTitle: "Today", newListItems: foundItems});
            }            
        }
    });

});


// add item to DB
app.post("/", (req, res) => {

    const itemName = req.body.newItem

    const item = new itemModel({
        itemName: itemName
    });

    item.save();
    
    res.redirect("/");    

});

// delete an item based on item _id
app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    itemModel.findByIdAndRemove(checkedItemId, (err) => {
        if(err){
            console.log(err);
        }else{
            console.log("Removed item with id: " + checkedItemId);
            res.redirect("/");
        }
    });
});


app.get("/work", (req, res) => {
    res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.post("/work", (req, res) => {
    let item = req.body.workItem; 
    workItems.push(item);
    res.redirect("/work");
});

//------------------------------------------------------------------------------------------------
// End routes 
//------------------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log("app running on localhost:3000");
});