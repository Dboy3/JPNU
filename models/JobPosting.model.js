import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
    postId: {
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        required: true,
    },
    employmentType: {
        fullTime: {
            type: Boolean,
            required: true,
        },
        internship: {
            type: Boolean,
            required: true,
        }
    },
    ctc: {
        type: Number
    },
    stipend: {
        type: Number
    },
    eligibleCourses: {
        type: [String],
        required: true,
    },
    requiredCgpa: {
        type: Number,
        required: true,
    },
    location: {
        type: [String],
        required: true,
    },
    otherDetails: {
        type: String,
    },
    registrationStartDate: {
        type: Date,
        required: true,
    },
    registrationEndDate: {
        type: Date,
        required: true,
    },
    urlLink: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const applicationSchema = new mongoose.Schema({
    userId: {
        type: String, // UUID as a string
        required: true
    },
    postId: {
        type: String, // UUID as a string
        required: true
    },
    appliedDate: {
        type: Date,
        default: Date.now
    }
});
export const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
export const Application = mongoose.model('Application', applicationSchema);