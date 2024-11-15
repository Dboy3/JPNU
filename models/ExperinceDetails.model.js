import mongoose from 'mongoose';

const experienceDetailsSchema = new mongoose.Schema({
    userId: { String, required: true },
    companyName: { type: String, required: true },
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    industry: { type: String, required: true },
    mentorName: { type: String, required: true },
    mentorDesignation: { type: String, required: true },
    mentorPhoneNumber: { type: String, required: true },
    mentorEmail: { type: String, required: true },
    academicGuide: { type: String },
    techStack: [{ type: String }],  // Multivalued column for tech stack
    descriptionOfExperience: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('ExperienceDetails', experienceDetailsSchema);