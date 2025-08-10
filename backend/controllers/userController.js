const User = require("../models/User");

exports.createOrUpdateUser = async (req, res) => {
  const { firebaseUid, name, email } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    user.name = name;
    await user.save();
  } else {
    user = new User({ firebaseUid, name, email });
    await user.save();
  }

  res.json(user);
};
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.searchUserByEmail = async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email });
  res.json(user || null);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
