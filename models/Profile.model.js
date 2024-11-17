import mongoose from "mongoose";

const generalDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Reference to the User model
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  email: { type: String, required: true },
  rollNo: { type: String, required: true },
  course: { type: String, required: true },
  skills: { type: [String], required: false }, // Array of strings for skills
  languages: { type: [String], required: false },
  achievements: { type: [String], required: false }, // Array of strings for known languages
  contactNumber: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, // Regex to ensure the contact number is a 10-digit number
  },
  githubLink: { type: String, required: false },
});

const projectDetailsSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Reference to the User model
    projects: [
      {
        title: { type: String, required: true },
        link: { type: String, required: false }, // Optional field for project URL
        description: {
          type: String,
          required: true,
          // Max length of 1000 characters for the description
        },
      },
    ],
  },
  { timestamps: true }
);

export const projectDetails = mongoose.model(
  "projectDetails",
  projectDetailsSchema
);
export const GeneralDetails = mongoose.model(
  "GeneralDetails",
  generalDetailsSchema
);

// export const UserProject = mongoose.model("UserProject", projectSchema);
