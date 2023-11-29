const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      lowercase: true,
    },
    role: {
      type: "String",
      required: true,
    },
    salary: {
      type: Number,
      required: true,
    },
    designation: {
      type: "String",
      required: true,
    },
    isPending: {
      type: Boolean,
      required: true,
    },
    image: {
      type: "String",
      required: true,
    },
    bank_account: {
      type: "string",
      required: true,
    },
  }
);

exports.User = mongoose.model("users", UserSchema);
