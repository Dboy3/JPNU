
import jwt from "jsonwebtoken";
import {GeneralDetails,projectDetails} from "../models/Profile.model.js";

// Helper function to extract userId from the JWT token in the cookie
const extractUserIdFromToken = (req, res) => {
  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) {
    res.status(401).json({ error: "Unauthorized: No token provided" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    return decoded.userId; // Extract userId from token
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
    return null;
  }
};

// Controller to insert general details
export const createGeneralDetails = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    console.log(userId);
    if (!userId) return; // If token is invalid or missing, stop further execution

    const {
      firstName,
      middleName,
      lastName,
      rollNo,
      course,
      languages,
      achievements,
      skills,
      contactNumber,
      email,
      githubLink
    } = req.body;

    console.log(req.body);

    // Check if all required fields are provided
    if (!firstName || !lastName || !rollNo || !course || !contactNumber) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Validate contact number
    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return res.status(400).json({ message: 'Contact number must be a valid 10-digit number.' });
    }

    // Check if an entry with the same userId already exists
    const existingEntry = await GeneralDetails.findOne({ userId });

    if (existingEntry) {
      // If entry exists, update it
      existingEntry.firstName = firstName;
      existingEntry.lastName = lastName;
      existingEntry.middleName = middleName || existingEntry.middleName;
      existingEntry.rollNo = rollNo;
      existingEntry.course = course;
      existingEntry.skills = skills.length ? skills : existingEntry.skills;
      existingEntry.languages = languages || existingEntry.languages;
      existingEntry.achievements = achievements.length ? achievements : existingEntry.achievements;
      existingEntry.contact = contactNumber;
      existingEntry.githubLink = githubLink || existingEntry.githubLink;
      existingEntry.email = email || existingEntry.email;

      await existingEntry.save();
      return res.status(200).json({ message: 'General details updated successfully.', data: existingEntry });
    } else {
      // If no entry exists, create a new one
      const newEntry = new GeneralDetails({
        userId,
        firstName,
        lastName,
        middleName,
        rollNo,
        course,
        skills: skills.length ? skills : undefined,
        languages: languages || undefined,
        achievements: achievements.length ? achievements : undefined,
        contact,
        githubLink,
        email,
      });

      await newEntry.save();
      return res.status(201).json({ message: 'General details added successfully.', data: newEntry });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding/updating general details.', error });
  }
};

// Controller to update general details
export const updateGeneralDetails = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    if (!userId) return; // If token is invalid or missing, stop further execution

    const details = req.body;

    // Update user data if it exists
    const updatedData = await GeneralDetails.findOneAndUpdate(
      { userId },
      details,
      { new: true }
    );
    if (!updatedData) {
      return res.status(404).json({ error: "User data not found." });
    }

    // Return success response
    res
      .status(200)
      .json({
        message: "General details updated successfully.",
        data: updatedData,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating general details." });
  }
};

// Controller to retrieve general details
export const getGeneralDetails = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    if (!userId) return; // If token is invalid or missing, stop further execution

    // Retrieve user data based on userId
    const userData = await GeneralDetails.findOne({ userId });
    if (!userData) {
      return res.status(200).json({ data: {} }); // Return empty data if not found
    }

    // Return success response
    res.status(200).json({ data: userData });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving general details." });
  }
};

export const addProject = async (req, res) =>{
  try {
    // Destructure and validate required fields from the request body
    const {
      userId,
      title,
      link,
      teamSize,
      techStack,
      description,
    } = req.body;

    // Check if all required fields are provided
    if (!userId || !title || !teamSize || !description) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Check if team size is valid
    if (teamSize < 1) {
      return res.status(400).json({ message: 'Team size must be at least 1.' });
    }

    // Check if an entry with the same userId and title already exists
    const existingEntry = await ProjectDetails.findOne({ userId, title });

    if (existingEntry) {
      // If entry exists, update it
      existingEntry.link = link || existingEntry.link;
      existingEntry.teamSize = teamSize;
      existingEntry.techStack = techStack || existingEntry.techStack;
      existingEntry.description = description;

      await existingEntry.save();
      return res.status(200).json({ message: 'Project details updated successfully.', data: existingEntry });
    } else {
      // If no entry exists, create a new one
      const newEntry = new projectDetails({
        userId,
        title,
        link,
        teamSize,
        techStack,
        description,
      });

      await newEntry.save();
      return res.status(201).json({ message: 'Project details added successfully.', data: newEntry });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while adding/updating project details.', error });
  }
};