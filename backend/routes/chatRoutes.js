const express = require('express');
const router = express.Router();
const { sendMessage, getMessages,getInbox } = require('../controllers/chatController');

router.post('/send', sendMessage);
router.get('/messages', getMessages);
router.get('/inbox', getInbox);
router.get('/ping', (req, res) => {
  res.send("pong from chat route");
});
module.exports = router;
