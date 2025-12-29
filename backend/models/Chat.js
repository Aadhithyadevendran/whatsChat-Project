const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  participants: [String], 
  messages: [
    {
      sender: String,
      text: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
}, { timestamps : true });

module.exports = mongoose.model('Chat', chatSchema);
