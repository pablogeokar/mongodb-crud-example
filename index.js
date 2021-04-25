require("dotenv").config();
const path = require('path')
const express = require('express')
const app = express()


app.use(express.json())
app.use(express.urlencoded({ extended: false }));

const db = require('./db');

const collection = 'todo'

// GET HOME
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})

// GET DOCUMENTS
app.get('/getTodos', (req, res) => {
  db.getDB().collection(collection).find({}).toArray((err, documents) => {
    if (err) console.log(err)
    else res.json(documents
    )
  })
})

// PUT
app.put('/:id', (req, res) => {

  const todoID = req.params.id
  const userInput = req.body

  db.getDB()
    .collection(collection)
    .findOneAndUpdate(
      { _id: db.getPrimaryKey(todoID) },
      { $set: { todo: userInput.todo } },
      { returnOriginal: false },
      (err, result) => {
        if (err) console.log(err)
        else res.json({ ok: 1, value: result.value })
      })
})

// POST CREATE
app.post('/', (req, res) => {
  const userInput = req.body

  db.getDB()
    .collection(collection)
    .insertOne(userInput, (err, result) => {
      if (err) console.log(err)
      else
        res.json({ ok: 1, n: 1, document: result.ops[0] })
    })


})

// DELETE
app.delete('/:id', (req, res) => {
  const todoID = req.params.id

  db.getDB()
    .collection(collection)
    .findOneAndDelete(
      { _id: db.getPrimaryKey(todoID) },
      (err, result) => {
        if (err) console.log(err)
        else
          res.json({ ok: result.ok })
      }
    )
})

db.connect((err) => {
  if (err) {
    console.log('unable to connect to database')
    process.exit(1)
  } else {
    app.listen(3000, () => { console.log('connected to database, app listening on port 3000') })
  }
})