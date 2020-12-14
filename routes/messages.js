var express = require('express');
var router = express.Router();
const message = require('../management/msgMenagement');


router.post('/sendMessage', function (req, res) {
  message.sendMessage(req, res);
});

router.get('/chatHistory', function (req, res) {
  message.getHostory(req, res);
});

router.get('/allUsersChatHistory', function (req, res) {
  message.getAllMessages(req, res);
});

router.delete('/deleteReceivedMessage',function(req,res){
  message.deleteReceivedMessage(req,res)
})

router.delete('/deleteSentMessage',function(req,res){
  message.deleteSentMessage(req,res)
})
module.exports = router;
