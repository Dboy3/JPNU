import mongoose from "mongoose";

const placedDataSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
      validate: {
        validator: (value) =>
          value >= 1900 && value <= new Date().getFullYear(),
        message: "Year must be between 1900 and the current year.",
      },
    },
    ctc: {
      type: Number,
      required: true,
      min: [0, "CTC must be a positive number."],
    },
    companyName: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Company name must be at least 2 characters long."],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

export default mongoose.model("PlacedData", placedDataSchema);
