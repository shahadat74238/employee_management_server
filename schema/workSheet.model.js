const mongoose = require("mongoose");

const WorksSchema = new mongoose.Schema(
  {
    name:{
      type: 'String',
      required: true,
    },
   task: {
      type: "String",
      required: true,
    },
    hoursWorked: {
      type: "String",
      required: true,
    },
    date: {
      type: "string",
      required: true,
    },
    userEmail: {
      type: "string",
      required: true,
      lowercase: true,
    }
  }
);

exports.Works = mongoose.model("works", WorksSchema);
