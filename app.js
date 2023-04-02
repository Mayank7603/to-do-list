const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
async function run() {
  await mongoose.connect("mongodb+srv://Mayank:4UsL.uQykjhsqtY@mydbs.uxo3zsu.mongodb.net/?retryWrites=true&w=majority").catch(error => handleError(error));
}
run();
const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*- 


const itemSchema ={       // we can also create a schema like this 
  Name: String
};

const Item = mongoose.model("item", itemSchema);

const item1 = new Item({
  Name: "Make food"
})
const item2 = new Item({
  Name:'do exercise'
});

const defaultArray = [item1, item2];


const items = [];



// -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*- 

const listschema = {
  Name: String,
  items: [itemSchema]
};

const List = mongoose.model("List", listschema);

// -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*-  -*- 



app.get("/", function (req, res) {
  
  Item.find({})
    .then(function (foundItems) {
      if (foundItems.length == 0) {
        Item.insertMany(defaultArray)
          .then(function () {
            console.log("inserted")
          })
          .catch(function (err) {
            console.log(err);
          });

        res.redirect("/");
      } else {
        res.render("list", { listTitle: "today", newListItems: foundItems });
      }
  })

});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

    const item = new Item({
      Name:itemName
    })
  
  
  if (listName === "today") {
      item.save();
      res.redirect("/");
  } else {
    List.findOne({Name :listName}).
      then(function (arr) {
        arr.items.push(item);
        arr.save();
        })
        res.redirect("/"+listName);
  }

});

app.post("/delete", function (req, res) {
  const deletingItem = req.body.checkbox;
  const deletingFromList = req.body.listname;

  if (deletingFromList == "today") {
      Item.findByIdAndDelete(deletingItem)
        .then(function () {
          console.log("Deleted item successfully")
        })
        .catch(function (err) {
          console.log(err);
        })
    res.redirect("/");
  }
  
  else
  { 
    List.findOneAndUpdate({ Name: deletingFromList }, { $pull: { items: { _id: deletingItem } } })
      .then(() => {
      console.log("item from list delted\n");
      })
      .catch((err) => {
      console.log(err);
      })
    res.redirect("/"+deletingFromList);
    
  }



});

//dynamic rounting using express 
app.get("/:newlist", function (req, res) {
  const newList = _.capitalize(req.params.newlist);

  List.findOne({ Name: newList })
    .then(function (newitem) {
      if (!newitem) {
        // list is not present 
        const list1 = new List({
          Name: newList,
          items: defaultArray
        });

        list1.save();
        res.redirect("/" + newList);
      } else {
        // list is present 
        res.render("list", { listTitle: newList, newListItems: newitem.items });
      }
    })
    .catch(function (err) {
      console.log(err);
    });


});

app.listen(3000, function() {
  console.log("Server started on port 3000");
}); 


//  4UsL.uQykjhsqtY