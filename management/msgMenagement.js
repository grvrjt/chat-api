const generateUniqueId = require('generate-unique-id');
const dbQuery = require('../dbConnection/queries');
const ObjectId = require('mongodb').ObjectID;
const msgService = {};



function saveReceivedMessage(data) {
    const query = {};
    const messageDetail = {};

    query._id = ObjectId(data.receiverId);
    messageDetail.message = data.message;
    messageDetail.senderId = data.senderId;
    messageDetail.date = Date();
    messageDetail.messageId = generateUniqueId({
        length: 32,
        useLetters: false
    });
    return new Promise((resolve, reject) => {
        dbQuery.updateReceivedMessge(query, messageDetail, (err, result) => {
            if (!err && !!result) {
                resolve(messageDetail);
            } else {
                reject('Error updating the received messages updation  !!');
            }
        });
    });
}

function saveSentMessage(data, messageDetail) {
    const query = {};
    const updateData = {};

    query._id = ObjectId(data.senderId);
    updateData.message = data.message;
    updateData.receiverId = data.receiverId;
    updateData.date = messageDetail.date;
    updateData.messageId = messageDetail.messageId;
    return new Promise((resolve, reject) => {
        dbQuery.updateSentMessge(query, updateData, (err, result) => {
            if (!err && !!result) {
                resolve();
            } else {
                reject('Error updating the sent messages updation !!');
            }
        });
    });
}

msgService.sendMessage = async function sendMessage(req, res) {
    const data = {};
    data.receiverId = req.query.receiverId;
    data.senderId = req.query.senderId;
    data.message = req.body.message;
    try {
        const messageDetail = await saveReceivedMessage(data);
        await saveSentMessage(data, messageDetail);
        return res.json({
            success: true,
            result: "Message Sent !!"
        })

    } catch (err) {
        return res.json({
            success: false,
            message: err
        })
    }
};

function getMessages(data) {
    const receiver = {};
    receiver._id = ObjectId(data.userId);
    return new Promise((resolve, reject) => {
        dbQuery.getAllData(receiver, (err, history) => {
            if (!err && !!history) {
                resolve(history);
            } else {
                reject();
            }
        });
    });
}

msgService.getHostory = async function getHostory(req, res) {
    const data = {};
    data.senderId = req.query.senderId;
    data.userId = req.query.userId;
    try {
        const chatHistory = await getMessages(data);
        const receivedMessages = chatHistory.receivedMessages.filter(message => message.senderId === data.senderId);
        const sentMessages = chatHistory.sentMessages.filter(message => message.receiverId === data.senderId);

        return res.json({
            success: true,
            receivedMessages: receivedMessages,
            sentMessages: sentMessages
        });
    } catch (err) {
        return res.json({
            success: false,
            error: err
        })
    }
}


function allMessagesOfTheUser(userId) {
    const query = {};
    query._id = ObjectId(userId);
    return new Promise((resolve, reject) => {
        dbQuery.getAllData(query, (err, messages) => {
            if (!err && !!messages) {
                resolve(messages);
            } else {
                reject(err);
            }
        })
    })
}

msgService.getAllMessages = async function getAllMessages(req, res) {
    const userId = req.query.userId;
    try {
        const allMessages = await allMessagesOfTheUser(userId);
        return res.json({
            success: true,
            messages: allMessages
        });
    } catch (err) {
        return res.json({
            success: false,
            error: err
        });
    }
}

function receivedMessageDeletion(data) {
    const query = {};
    query._id = ObjectId(data.userId);
    const messageId = data.messageId;
    
    return new Promise((resolve, reject) => {
        dbQuery.deleteReceivedMessageDetail(query, messageId, (err, result) => {
            if (!err && !!result) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}

msgService.deleteReceivedMessage = async function deleteReceivedMessage(req, res) {
    const data = {};
    data.userId = req.query.userId;
    data.messageId = req.query.messageId;
    try {
        await receivedMessageDeletion(data);
        return res.json({
            success:true,
            Message:"Message deleted successfully !!!"
        });
    } catch (err) {
        return res.json({
            success: false,
            error: err
        });
    }
}



function sentMessageDeletion(data) {
    const query = {};
    query._id = ObjectId(data.userId);
    const messageId = data.messageId;
    
    return new Promise((resolve, reject) => {
        dbQuery.deleteSentMessageDetail(query, messageId, (err, result) => {
            if (!err && !!result) {
                resolve();
            } else {
                reject(err);
            }
        });
    });
}



msgService.deleteSentMessage = async function deleteSentMessage(req, res) {
    const data = {};
    data.userId = req.query.userId;
    data.messageId = req.query.messageId;
    try {
        await sentMessageDeletion(data);
        return res.json({
            success:true,
            Message:"Message deleted successfully !!!"
        });
    } catch (err) {
        return res.json({
            success: false,
            error: err
        });
    }
}


module.exports = msgService;