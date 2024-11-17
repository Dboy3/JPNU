import mongoose from 'mongoose';

const generalDetailsSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Reference to the User model
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    rollNo: { type: String, required: true },
    course: { type: String, required: true },
    skills: { type: [String], required: false }, // Array of strings for skills
    languages: { type: [String], required: false },
    achievements: {type:[String],required: false}, // Array of strings for known languages
    contact: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // Regex to ensure the contact number is a 10-digit number
    },
    githublink:{type : String,required:false}   
    
}); // Automatically adds createdAt and updatedAt timestamps



const projectDetailsSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Reference to the User model
  title: { type: String, required: true },
  link: { type: String, required: false }, // Optional field for project URL
  teamSize: { type: Number, required: true, min: 1 }, // Minimum team size is 1
  mentor: { type: String, required: false }, // Optional field for mentor name
  techStack: { type: [String], required: true }, // Array of strings for technologies used
  description: { type: String, required: true, maxlength: 1000 }, // Max length of 1000 characters for the description
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

export const projectDetails =  mongoose.model('projectDetails', projectDetailsSchema);
export const GeneralDetails =  mongoose.model('GeneralDetails', generalDetailsSchema);

// export default mongoose.model('GeneralDetails', generalDetailsSchema);
