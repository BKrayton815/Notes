const express = require('express');
const fs = require('fs');
const uuid = require('uuid');
let notesData = require('../db/db.json');
const router = express.Router();
const bodyParser = require('body-parser');

//get api routes to get notes from db.json, add to dv.json, return new note to client
//delete notes
//query param of id of note to delete give uuid to delete read file fb.json write file cb.json

module.exports = function (app) {
    app.get('/api/notes', function (req, res) {
        let notesData = fs.readFileSync("db/db.json", "utf8");
        let jsonData = JSON.parse(notesData);
        console.log(jsonData);
        res.json(jsonData);

    });

    app.post('/api/notes', function (req, res) {

        let newNote = {
            id: uuid.v4(),
            title: req.body.title,
            text: req.body.text
        }
        // use fs to read
        notesData = fs.readFileSync("db/db.json", "utf8")
        // convert to back to obj (parse)
        obj = JSON.parse(notesData);
        // push new data to obj
        obj.push(newNote);
        // convert back to file 
        notesData = JSON.stringify(obj);
        // use fs to write
        fs.writeFileSync("db/db.json", notesData)
        // if these were large files... such as images or mp4s then probably should use async version of fs
        return res.json(notesData);
    });

    app.delete('/api/notes/:id', function (req, res) {
        const id = req.params.id;
        const notes = req.body;
        //read the json file
        notesData = fs.readFileSync("db/db.json", "utf8")
        //parse the data
        notesData = JSON.parse(notesData);
        //delete the note that matches the id user selects to delete
        notesData = notesData.filter(function (notes) {
            return notes.id != req.params.id;
        })
        //stringify notesData to re-write file without the deleted note
        notesData = JSON.stringify(notesData);
        fs.writeFileSync("db/db.json", notesData);
        notesData = JSON.parse(notesData);
        res.send(notesData);

    });
}