import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ["Admin", "Academic Coordinator", "SPC", "Student"],
    required: true,
  },
  RollNo: { type: String },
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true, unique: true },
  appliedJobs: [
    {
      postId: { type: String },
    },
  ],
  cgpa: { type: Number },
  branch: { type: String },
  hold: { type: Boolean, default: false }, 
});

export default mongoose.model("User", userSchema);
