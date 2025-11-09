const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  details: {
    type: Object, // Or you can define its schema if needed
    default: null,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
