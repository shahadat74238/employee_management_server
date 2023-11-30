const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    month: {
      type: "String",
      required: true,
    },
    year: {
      type: "String",
      required: true,
    },
    salary: {
      type: "Number",
      required: true,
    },
    transaction_id: {
      type: "String",
      required: true,
    },
    employee_email:{
      type: "String",
      required: true,
    }
  },
  {
    versionKey: false,
  }
);

exports.Payment = mongoose.model("payment", PaymentSchema);
