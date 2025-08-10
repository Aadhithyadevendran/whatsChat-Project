const Chat = require('../models/Chat');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { sender, receiver, text } = req.body;

  try {
    const senderUser = await User.findOne({ email: sender });
    const receiverUser = await User.findOne({ email: receiver });

    if (!senderUser || !receiverUser) {
      return res.status(400).json({ error: 'One or both users do not exist.' });
    }

    const participants = [sender, receiver].sort();
    let chat = await Chat.findOne({ participants });

    if (!chat) {
      chat = new Chat({ participants, messages: [] });
    }

    if (chat.messages.length >= 10) {
      chat.messages.shift();
    }

    chat.messages.push({ sender, text });
    await chat.save();

    return res.json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while sending message' });
  }
};

exports.getMessages = async (req, res) => {
  const { user1, user2 } = req.query;

  try {
    const participants = [user1, user2].sort();
    const chat = await Chat.findOne({ participants });

    if (!chat) {
      return res.json({ messages: [] });
    }

    return res.json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching messages' });
  }
};exports.getInbox = async (req, res) => {
  const { email } = req.query;

  try {
    const chats = await Chat.find({ participants: email });

    const inbox = await Promise.all(chats.map(async (chat) => {
      const otherUserEmail = chat.participants.find(p => p !== email);
      const lastMsg = chat.messages[chat.messages.length - 1];

      // Fetch name of the other user
      const otherUser = await User.findOne({ email: otherUserEmail });

      return {
        with: otherUserEmail,
        name: otherUser?.name || otherUserEmail,
        lastMessage: lastMsg?.text || '',
        timestamp: lastMsg?.timestamp,
        sender: lastMsg?.sender,
      };
    }));

    // Optional: Sort by latest timestamp
    inbox.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(inbox);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error fetching inbox' });
  }
};
