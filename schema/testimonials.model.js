const mongoose = require("mongoose");

const TestimonialsSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: true,
    },
    image: {
      type: "String",
      required: true,
    },
    testimonials: {
      type: "string",
      required: true,
    },
  }
);

exports.Testimonials = mongoose.model("testimonials", TestimonialsSchema);
