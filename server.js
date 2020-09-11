const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const {PORT = 3000} = process.env

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
  });
  
app.get("/api/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "/db/db.json"));
});
  
app.get("/api/notes/:id", function(req, res) {
  let saved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  res.json(saved[Number(req.params.id)]);
});
  
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
  
app.post("/api/notes", function(req, res) {
  let saved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let newNote = req.body;
  let uniqueID = (saved.length).toString();
  newNote.id = uniqueID;
  saved.push(newNote);
  
  fs.writeFileSync("./db/db.json", JSON.stringify(saved));
  console.log("Note saved to db.json. Content: ", newNote);
  res.json(saved);
})
  
app.delete("/api/notes/:id", function(req, res) {
  let saved = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = req.params.id;
  let newID = 0;
  console.log(`Deleting note with ID ${noteID}`);
  saved = saved.filter(currentNote => {
      return currentNote.id != noteID;
  })
    
  for (currentNote of saved) {
      currentNote.id = newID.toString();
      newID++;
  }
  
  fs.writeFileSync("./db/db.json", JSON.stringify(saved));
  res.json(saved);
})
  
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});