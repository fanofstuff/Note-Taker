const express = require("express"); 
const path = require("path"); 
const fs = require("fs");

const app = express(); 
const PORT = process.env.PORT || 3000; 

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/assets")); 
app.use(express.json());


// var notes = [
//     {
//         noteID: "grocerylist", 
//         title: "Grocery List", 
//         text: "I need to get the following things from the grocery store: milk, potatoes, and bread"
//     }
// ]

app.get("/", function(req, res){
    res.sendFile(path.join(__dirname, "index.html"))
})

app.get("/notes", function(req, res){
    res.sendFile(path.join(__dirname, "notes.html"))
})

app.get("/api/notes", function(req, res){
    var data = JSON.parse(fs.readFileSync(__dirname + "/assets/db/db.json"))
    return res.json(data); 
}); 

app.get("/api/notes/:id", function(req, res) {
    var chosen = req.params.id;
  
    console.log(chosen);
  
    for (var i = 0; i < notes.length; i++) {
      if (chosen === notes[i].noteID) {
        return res.json(notes[i]);
      }
    }
  
    return res.json(false);
  });

app.post("/api/notes", function(req, res){
    var newNotes = req.body; 
    newNotes.id = newNotes.title.replace(/\s+/g, "").toLowerCase(); 
    // console.log(newNotes); 
    var noteData = JSON.parse(fs.readFileSync(__dirname + "/assets/db/db.json")); 
    noteData.push(newNotes); 
    fs.writeFileSync(__dirname + "/assets/db/db.json", JSON.stringify(noteData)); 
    return res.json(noteData);
})

// For the const updatedData line, I took guidance from this post: https://stackoverflow.com/a/55648233
app.delete("/api/notes/:id", function(req, res){
    var id = req.params.id; 
    var deleteData = JSON.parse(fs.readFileSync(__dirname + "/assets/db/db.json")); 
    const updatedData = deleteData.filter(item => item.id !== id); 
    fs.writeFileSync(__dirname + "/assets/db/db.json", JSON.stringify(updatedData)); 
    return res.json(updatedData);
})

app.listen(PORT, function(){
    console.log("App listening on PORT " + PORT); 
})


// Need to create a GET route for /notes and * on both front and backends
// We also need to have GET /api/notes, POST /api/notes, and then DELETE /api/notes:id
// We'll be using fs to write and read from db.json

