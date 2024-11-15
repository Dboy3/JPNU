import mongoose from "mongoose";
// import Models from '../models/Application.model.js'
import { JobPosting } from "../models/JobPosting.model.js";
import PlacedStudents from "../models/Placed.model.js";
import { Application } from "../models/JobPosting.model.js";
import { Notification } from "../models/notification.model.js";
import GeneralDetails from "../models/Profile.model.js";
import User from "../models/user.model.js";
// Assuming you have the model separated
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Middleware to check if the user is an admin
export const verifyAdminRole = (req, res, next) => {
  try {
    const token = req.cookies.token; // Get JWT token from cookies
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Check if the user role is admin
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied. You must be an admin to perform this action.",
      });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate token." });
  }
};

// Controller to create a new job posting (Admin only)

export const createJobPosting = async (req, res) => {
  try {
    // Destructure and extract fields from request body
    const {
      companyName,
      roles,
      employmentType,
      ctc,
      stipend,
      eligibleCourses,
      requiredCgpa,
      location,
      otherDetails,
      registrationStartDate,
      registrationEndDate,
      urlLink,
    } = req.body;

    // Autogenerate a unique postId
    const postId = uuidv4();
    console.log(postId);

    // Create new Job Posting document with destructured values and autogenerated postId
    const newJobPosting = new JobPosting({
      postId,
      companyName,
      roles,
      employmentType,
      ctc,
      stipend,
      eligibleCourses,
      requiredCgpa,
      location,
      otherDetails,
      registrationStartDate,
      registrationEndDate,
      urlLink,
    });
    console.log(newJobPosting.postId);
    // Save the document to the database
    await newJobPosting.save();

    // Construct notification message
    const rolesList = roles.join(", ");
    const message = `New Job Posted [${rolesList}] at ${companyName}`;

    // Call the addNotification function
    const newNotification = new Notification({ message });
    await newNotification.save();

    res
      .status(201)
      .json({ message: "Job posting created successfully", newJobPosting });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating job posting", error });
  }
};

// Controller to get all job postings (No role restriction)
export const getJobPostings = async (req, res) => {
  try {
    // Fetch all job postings with complete data
    const jobPostings = await JobPosting.find({})
      .select("-__v") // Exclude the version field if not needed
      .exec();

    // Check if any job postings are found
    if (!jobPostings || jobPostings.length === 0) {
      return res.status(404).json({ message: "No job postings found" });
    }

    // Return the job postings
    res.status(200).json({ jobPostings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving job postings", error });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const jobPosting = await JobPosting.findById(id).select("-__v").exec(); // Exclude __v if not needed

    if (!jobPosting) {
      return res
        .status(404)
        .json({ message: "Job posting not found"});
    }

    res.status(200).json({ job : jobPosting });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    res.status(500).json({ message: "Error retrieving job posting", error });
  }
};

// Controller to delete a job posting (Admin only)
export const deleteJobPosting = async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if the job posting exists
    const jobPosting = await JobPosting.findOne({ postId });
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Delete the job posting
    await jobPosting.remove();
    res.status(200).json({ message: "Job posting deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting job posting", error });
  }
};

// Controller to update a job posting (Admin only)
export const updateJobPosting = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;

    // Check if the job posting exists
    const jobPosting = await JobPosting.findOne({ postId });
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Update job posting details
    await JobPosting.updateOne({ postId }, updateData);
    res.status(200).json({ message: "Job posting updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating job posting", error });
  }
};

// Controller to add a new placed student record
export const addPlacedStudent = async (req, res) => {
  try {
    const { userId, companyPlacedAt, CTC } = req.body;

    const newRecord = new PlacedStudents({ userId, companyPlacedAt, CTC });
    await newRecord.save();

    res.status(201).json({ message: "Record added successfully", newRecord });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding record", error });
  }
};

// Controller to get all placed students
export const getPlacedStudents = async (req, res) => {
  try {
    const placedStudents = await PlacedStudents.find({}).exec();

    if (!placedStudents || placedStudents.length === 0) {
      return res.status(404).json({ message: "No placed students found" });
    }

    const placedStudentsWithUserDetails = await Promise.all(
      placedStudents.map(async (student) => {
        // Fetch user details using the userID from Users database
        const userId = student.userId;
        const userDetails = await User.findOne({ userId }); // Customize fields as needed

        // Return the combined data
        return {
          ...student.toObject(), // Convert Mongoose document to plain JavaScript object
          userDetails: userDetails ? userDetails.toObject() : null,
        };
      })
    );

    // Step 3: Send the combined response
    res.status(200).json(placedStudentsWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving records", error });
  }
};

// Controller to delete a placed student record
export const deletePlacedStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await PlacedStudents.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    await record.remove();
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting record", error });
  }
};

// Controller to update a placed student record
export const updatePlacedStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const record = await PlacedStudents.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }

    await PlacedStudents.updateOne({ _id: id }, updateData);
    res.status(200).json({ message: "Record updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating record", error });
  }
};

export const getAllJobPostings = async (req, res) => {
  try {
    const jobPostings = await JobPosting.find();
    res.status(200).json({
      message: "All job postings retrieved successfully",
      jobPostings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving job postings", error });
  }
};

export const getUpcomingJobPostings = async (req, res) => {
  try {
    const today = new Date();
    const upcomingJobPostings = await JobPosting.find({
      endDate: { $gt: today },
    });
    res.status(200).json({
      message: "Upcoming job postings retrieved successfully",
      upcomingJobPostings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving upcoming job postings", error });
  }
};

export const getPastJobPostings = async (req, res) => {
  try {
    const today = new Date();
    const pastJobPostings = await JobPosting.find({ endDate: { $lt: today } });
    res.status(200).json({
      message: "Past job postings retrieved successfully",
      pastJobPostings,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving past job postings", error });
  }
};

export const addApplication = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Create a new application entry
    const newApplication = new Application({ userId, postId });
    await newApplication.save();

    res
      .status(201)
      .json({ message: "Application added successfully", newApplication });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding application", error });
  }
};

// API to fetch applications based on userId or postId
export const getApplications = async (req, res) => {
  try {
    const { userId, postId } = req.query;

    if (userId) {
      // Find applications for this userId
      const applications = await Application.find({ userId });

      // Fetch JobPosting details for each postId in the applications
      const jobDetails = await Promise.all(
        applications.map(async (app) => {
          const jobPosting = await JobPosting.findOne({ postId: app.postId });
          return jobPosting;
        })
      );

      // Retrieve additional details from GeneralDetails schema
      const userDetails = await GeneralDetails.findOne({ userId });

      res.json({ userDetails, jobDetails });
    } else if (postId) {
      // Fetch applications directly by postId
      const applications = await Application.find({ postId });
      res.json(applications);
    } else {
      res.status(400).json({
        message: "Please provide userId or postId as query parameters",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching applications", error });
  }
};
