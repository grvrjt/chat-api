var dbObject = require('./connection.js');
var db = dbObject.getDb;

var queries = {};


queries.updateReceivedMessge = function updateReceivedMessge(query, updateData, callback) {
    db().collection('users').updateOne(query, { $push: { receivedMessages: updateData } }, (err, result) => {
        callback(err, result);
    });
};

queries.updateSentMessge = function updateSentMessge(query, updateData, callback) {
    db().collection('users').updateOne(query, { $push: { sentMessages: updateData } }, (err, result) => {
        callback(err, result);
    });
};

queries.getAllData = function getAllData(data, callback) {
    db().collection('users').findOne(data, (err, result) => {
        callback(err, result);
    })
}

queries.deleteReceivedMessageDetail = function deleteReceivedMessageDetail(query, messageId, callback) {
    db().collection('users').updateOne(query, { $pull: { "receivedMessages" : { messageId: messageId } }  }, (err, result) => {
        callback(err, result);
    });
}

queries.deleteSentMessageDetail = function deleteSentMessageDetail(query, messageId, callback) {
    db().collection('users').updateOne(query, { $pull: { "sentMessages" : { messageId: messageId } }  }, (err, result) => {
        callback(err, result);
    });
}

module.exports = queries;

