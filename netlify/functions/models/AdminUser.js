const mongoose = require("mongoose");

const AdminUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,   // PLAIN PASSWORD because bcrypt is removed
  role: String
});

module.exports = mongoose.model("AdminUser", AdminUserSchema);
