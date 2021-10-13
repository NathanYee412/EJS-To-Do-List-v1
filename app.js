const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require('lodash');

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
    itemName: String
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

// custom route schema and model
const listSchema = {
    name: String,
    items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



// printing items to console that are in mongoose
// itemModel.find({}, (err, items)=>{
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(items);
//         items.forEach((item) =>{
//             console.log(item.itemName);
//         });
//     }
// });

//------------------------------------------------------------------------------------------------
// End of Mongoose setup
//------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------
// Routes setup
//------------------------------------------------------------------------------------------------

app.get("/", (req, res) => {

    itemModel.find({}, (err, foundItems) => {

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
        
    });

});


// add item to DB
app.post("/", (req, res) => {

    const itemName = req.body.newItem
    const listName = req.body.list;

    const item = new itemModel({
        itemName: itemName
    });

    if(listName === "Today") {
        item.save();
        res.redirect("/");  
    } else {
        List.findOne({name: listName}, (err, foundList) =>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }
 

});

// using custom route parameters to create new lists 
app.get("/:customListName", (req, res) =>{
    const customListName = _.capitalize(req.params.customListName);

    List.findOne({name: customListName}, (err, foundList) =>{
        if(!err) {
            if(!foundList) {
                // create new list
                const list = new List({
                    name: customListName,
                    items: defaults
                });
                list.save();
                res.redirect("/" + customListName);
            } else {
                // show an existing list
                res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
            }
        }
    });

    const list = new List({
        name: customListName,
        items: defaults
    });

    list.save();


});

// delete an item based on item _id
app.post("/delete", (req, res) => {
    const listName = req.body.listName;
    const checkedItemId = req.body.checkbox;

    if(listName === "Today") {
        itemModel.findByIdAndRemove(checkedItemId, (err) => {
            if(!err){
                console.log("Successfully deleted checked item");
                res.redirect("/");
            } 
        });
    } else {
        List.findOneAndUpdate(
            {name: listName},
            {$pull: {items: {_id: checkedItemId}}},
            (err, foundList) =>{
                if(!err) {
                    res.redirect("/" + listName);
                }

        });
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

//------------------------------------------------------------------------------------------------
// End routes 
//------------------------------------------------------------------------------------------------

app.listen(3000, () => {
    console.log("app running on localhost:3000");
});