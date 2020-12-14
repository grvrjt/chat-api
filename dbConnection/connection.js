const MongoClient = require('mongodb').MongoClient;

//Create a database named "mydb":

const url = 'mongodb://localhost:27017';
const connection = {};
var dbObject = {};
const dbName = 'chatAPIdb';

connection.connect = callback => {
  MongoClient.connect(
    url,
    {useNewUrlParser: true},
    {useUnifiedTopology: true},
    (err, database) => {
      if (err) {
        callback('Error while db connection');
      } else {
        dbObject = database.db(dbName);
        callback(null, 'Database connected');
      }
    }
  );
};

connection.getDb = () => {
  if (dbObject) {
    return dbObject;
  }
};

connection.close = () => {};

module.exports = connection;