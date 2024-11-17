import mongoose from "mongoose";

// Define the schema for placed students

// Define the schema for placed students
const PlacedStudentsSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    year: {
      type: Number,
      default: new Date().getFullYear(),
    },
    postId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PlacedStudents", PlacedStudentsSchema);
