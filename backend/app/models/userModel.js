const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["Admin", "Employee"], // Nilai yang valid
        default: "Employee",
    },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
