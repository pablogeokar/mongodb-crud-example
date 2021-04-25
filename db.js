const MongoClient = require('mongodb').MongoClient
const ObjectID = require('mongodb').ObjectID

const dbname = process.env.MONGODB_DBNAME || 'example-crud'
const url = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const mongoOptions = { useUnifiedTopology: true }

const state = {
  db: null
}

const connect = (cb) => {
  state.db ? cb() : MongoClient.connect(url, mongoOptions, (err, client) => {
    if (err) {
      cb(err)
    } else {
      state.db = client.db(dbname);
      cb();
    }
  })
}

const getPrimaryKey = (_id) => {
  return ObjectID(_id)
}

const getDB = () => {
  return state.db;
}

module.exports = { getDB, connect, getPrimaryKey }
