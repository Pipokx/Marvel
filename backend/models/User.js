const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  token: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  favorites: [
    {
      type: { type: String, enum: ["character", "comic"], required: true },
      entityId: { type: String, required: true },
      name: String,
      thumbnail: Object
    }
  ]
});

const User = mongoose.model("User", userSchema);

module.exports = User;
