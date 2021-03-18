const express = require("express")

const bodyParser = require("body-parser")

const mongoose = require("mongoose")

const _ = require("lodash")

const app = express()

app.use(bodyParser.urlencoded({extended:true}))

let login = false

app.set('view engine','ejs')

app.use(express.static("public"))

mongoose.connect("mongodb+srv://admin-mudit:admin123@todolist-wz7nk.mongodb.net/listDB", {useNewUrlParser:true , useUnifiedTopology: true , useFindAndModify:false } )

const itemlistSchema = {
    name : String
}

const Item = mongoose.model(
    "item",
    itemlistSchema
)

const item1 = new Item({
    name : "do something"
})

const item2 = new Item({
    name : "do nothing"
})

const item3 = new Item({
    name : "do anything"
})

const defaultarray = [item1,item2,item3]

const listSchema = {
    name: String,
    items: [itemlistSchema]
}

const List = new mongoose.model("list",listSchema)


app.get("/",function(req,res){

    if(login === true){
        Item.find({},function(err,resultitem){

            if(resultitem.length === 0){
    
                Item.insertMany(defaultarray, function(err){
                    if(err){
                        console.log(err);
                    }else{
                        console.log("Success!");  
                    }
                })
                res.redirect("/")
            }else{
                res.render("index",{dayvar : "Today",thing : resultitem})
            }
        })

    }else{
        res.redirect("/login")
    }
})


app.post("/",function(req,res) {
 const itemName =  req.body.add
 const listName = req.body.list
 const newitem = new Item({
    name : itemName
 })

 if(listName === "Today"){
    newitem.save()
    res.redirect("/")
 }else{
     List.findOne({name:listName},function(err,foundlist){
         foundlist.items.push(newitem)
         foundlist.save();
         res.redirect("/" + listName)
    })
 }
})

app.post("/delete",function(req,res){
    const del = req.body.deleteItem
    const hiddenlist = req.body.hiddenlistname

    if(hiddenlist === "Today"){
        Item.findByIdAndDelete(del,function(err){
            if(!err){
                console.log("success");
                res.redirect("/");
            }
        })
    }else{
        List.findOneAndUpdate({name: hiddenlist}, {$pull:{items :{_id : del}}},function(err,foundlist){
            if(!err){
                res.redirect("/" + hiddenlist)
            }
        })
    }

})

/*
app.get("/CreateCustomList/:website",function(req,res){
    const webname = _.capitalize(req.params.website);

    List.findOne({name : webname},function(err,foundlist){
        if(!err){
            if(!foundlist){
                const list = new List({
                    name: webname,
                    items: defaultarray
                })
            
                list.save();

                res.redirect("/" + "CreateCustomList" + webname)

            }else{
                res.render("index",{dayvar : foundlist.name,thing : foundlist.items})
            }
        }
    })
})
*/

app.post("/work",function (req,res) {
    let wrk = req.body.add
    workItems.push(wrk)

    res.redirect("/work")
})


app.get("/about",function (req,res) {
    res.render("about")
})

app.get("/login",function(req,res){
    res.render("login")
    login = true
})

app.post("/login",function(req,res){
    res.redirect("/")
})


let port = process.env.PORT;
if(port == null || port == ""){
    port = 3000;
}


app.listen(port,function () {
    console.log("Server has started at 3000!")
})