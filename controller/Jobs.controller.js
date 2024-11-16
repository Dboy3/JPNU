import mongoose from "mongoose";
// import Models from '../models/Application.model.js'
import { JobPosting } from "../models/JobPosting.model.js";
import PlacedStudents from "../models/Placed.model.js";
import PlacedData from "../models/PlacedData.model.js";
import { Application } from "../models/JobPosting.model.js";
import { Notification } from "../models/notification.model.js";
import GeneralDetails from "../models/Profile.model.js";
import User from "../models/user.model.js";

import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

export const verifyAdminRole = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    if (req.user.role !== "Admin") {
      return res.status(403).json({
        message: "Access denied. You must be an admin to perform this action.",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to authenticate token." });
  }
};

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

export const getAdminJobPostings = async (req, res) => {
  try {
    // Fetch all job postings, excluding __v, and sort by createdAt in descending order
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

export const getJobPostings = async (req, res) => {
  try {
    const { userId } = req.body; // Assuming id is the userId

    // Find the user by id
    const user = await User.findOne({ userId }); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract postIds from appliedJobs array
    const appliedJobPostIds = user.appliedJobs.map((job) => job.postId); // assuming appliedJobs is an array of objects with _id and postId

    // Find all job postings
    const jobPostings = await JobPosting.find({}).select("-__v").exec();

    console.log("jobPostings", jobPostings);

    if (!jobPostings || jobPostings.length === 0) {
      return res.status(404).json({ message: "No job postings found" });
    }

    // Remove job postings that have postId in appliedJobs
    const filteredJobPostings = jobPostings.filter(
      (job) => !appliedJobPostIds.includes(job.postId)
    );

    res.status(200).json({ jobPostings: filteredJobPostings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving job postings", error });
  }
};

export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const jobPosting = await JobPosting.findById(id).select("-__v").exec();

    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    res.status(200).json({ job: jobPosting });
  } catch (error) {
    console.error(error);
    if (error.kind === "ObjectId") {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    res.status(500).json({ message: "Error retrieving job posting", error });
  }
};

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

export const updateJobPosting = async (req, res) => {
  try {
    const { postId } = req.params;
    const updateData = req.body;

    const jobPosting = await JobPosting.findOne({ postId });
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    await JobPosting.updateOne({ postId }, updateData);
    res.status(200).json({ message: "Job posting updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating job posting", error });
  }
};

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

export const getPlacedStudents = async (req, res) => {
  try {
    const placedStudents = await PlacedStudents.find({}).exec();

    if (!placedStudents || placedStudents.length === 0) {
      return res.status(404).json({ message: "No placed students found" });
    }

    const placedStudentsWithUserDetails = await Promise.all(
      placedStudents.map(async (student) => {
        const userId = student.userId;
        const userDetails = await User.findOne({ userId });

        return {
          ...student.toObject(),
          userDetails: userDetails ? userDetails.toObject() : null,
        };
      })
    );

    res.status(200).json(placedStudentsWithUserDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving records", error });
  }
};

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
    console.log("from backend API ", userId, postId);
    const user = await User.findOne({ userId });
    console.log(user); // Assuming you have a User model

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Push the postId into the user's appliesJobs array
    user.appliedJobs.push({ postId });
    await user.save();
    const newApplication = new Application({ userId, postId });
    await newApplication.save();
    const jobPost = await JobPosting.findOne({ postId });

    if (!jobPost) {
      return res.status(404).json({ message: "Job post not found" });
    }

    res.status(201).json({
      message: "Application added successfully",
      application: newApplication,
      job: jobPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding application", error });
  }
};

// API to fetch applications based on userId or postId
// export const getApplications = async (req, res) => {
//   try {
//     const { userId, postId } = req.body;

//     if (userId) {
//       // Find applications for this userId
//       const applications = await Application.find({ userId });

//       // Fetch JobPosting details for each postId in the applications
//       const jobDetails = await Promise.all(
//         applications.map(async (app) => {
//           const jobPosting = await JobPosting.findOne({ postId: app.postId });
//           return jobPosting;
//         })
//       );

//       // Retrieve additional details from GeneralDetails schema
//       const userDetails = await GeneralDetails.findOne({ userId });

//       res.json({ userDetails, jobDetails });
//     } else if (postId) {
//       // Fetch applications directly by postId
//       const applications = await Application.find({ postId });
//       res.json(applications);
//     } else {
//       res.status(400).json({
//         message: "Please provide userId or postId as query parameters",
//       });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error fetching applications", error });
//   }
// };

export const getApplications = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    if (userId) {
      const user = await User.findOne({ userId });

      const jobDetails = await Promise.all(
        user.appliedJobs.map(async (job) => {
          const jobPosting = await JobPosting.findOne({ postId: job.postId });
          console.log(jobPosting);
          return jobPosting;
        })
      );
      console.log(jobDetails);

      const userDetails = await GeneralDetails.findOne({ userId });

      res.json({ userDetails, jobDetails });
    } else if (postId) {
      const applications = await Application.find({ postId });

      const userIds = [...new Set(applications.map((app) => app.userId))];

      const userDetails = await Promise.all(
        userIds.map(async (id) => {
          const userDetail = await User.findOne({ userId: id });
          return userDetail;
        })
      );

      res.json({ postId, userDetails });
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

export const getAllPlacedData = async (req, res) => {
  try {
    const placedData = await PlacedData.find();
    res.json(placedData);
  } catch (error) {
    console.error("Error fetching all placed data:", error);
    res.status(500).json({ message: "Error fetching placed data", error });
  }
};
