import jwt from "jsonwebtoken";
import { GeneralDetails, projectDetails } from "../models/Profile.model.js";

// Helper function to extract userId from the JWT token in the cookie
const extractUserIdFromToken = (req, res) => {
  const token = req.cookies.token; // Retrieve token from cookies
  if (!token) {
    // res.status(401).json({ error: "Unauthorized: No token provided" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
    return decoded.userId; // Extract userId from token
  } catch (err) {
    // res.status(403).json({ error: "Invalid or expired token" });
    return null;
  }
};
// const extractUserIdFromToken = (req, res) => {
//   const token = req.cookies.token; // Retrieve token from cookies
//   if (!token) {
//     // res.status(401).json({ error: "Unauthorized: No token provided" });
//     return null;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     return decoded.userId; // Extract userId from token
//   } catch (err) {
//     // res.status(403).json({ error: "Invalid or expired token" });
//     return null;
//   }
// };

// Controller to insert general details
export const createGeneralDetails = async (req, res) => {
  try {
    // Destructure and validate required fields from request body
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const {
      firstName,
      lastName,
      rollNo,
      course,
      contactNumber,
      middleName,
      skills,
      languages,
      achievements,
      githubLink,
      email,
    } = req.body;

    console.log(req.body, "check");
    // Check if all required fields are provided
    if (
      !userId ||
      !firstName ||
      !lastName ||
      !rollNo ||
      !course ||
      !contactNumber ||
      !email
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    // Validate contact number
    if (!/^[0-9]{10}$/.test(contactNumber)) {
      return res
        .status(400)
        .json({ message: "Contact number must be a valid 10-digit number." });
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
      existingEntry.skills = skills || existingEntry.skills;
      existingEntry.languages = languages || existingEntry.languages;
      existingEntry.achievements = achievements || existingEntry.achievements;
      existingEntry.contactNumber = contactNumber;
      existingEntry.githubLink = githubLink || existingEntry.githubLink;
      existingEntry.email = email || existingEntry.email;

      await existingEntry.save();
      return res.status(200).json({
        message: "General details updated successfully.",
        data: existingEntry,
      });
    } else {
      // If no entry exists, create a new one
      const newEntry = new GeneralDetails({
        userId,
        firstName,
        lastName,
        middleName,
        rollNo,
        course,
        skills,
        languages,
        achievements,
        contactNumber,
        email,
        githubLink,
      });

      await newEntry.save();
      return res.status(201).json({
        message: "General details added successfully.",
        data: newEntry,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding/updating general details.",
      error,
    });
  }
};
// Controller to update general details
export const updateGeneralDetails = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    console.log(userId);
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
    res.status(200).json({
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
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
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

export const addProject = async (req, res) => {
  try {
    // Extract JWT token from cookies
    const userId = extractUserIdFromToken(req, res); // Extract userId from tok
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const { projects } = req.body;
    console.log(projects);

    // change -note
    // if (!Array.isArray(projects) || projects.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Projects array is required and cannot be empty." });
    // }

    if (!Array.isArray(projects) || projects.length === 0) {
      await projectDetails.deleteOne({ userId });
      return res.status(201).json({ message: "" });
    }

    const projectTitles = new Set(); // To keep track of titles and avoid duplicates
    for (const project of projects) {
      const { title, link, description } = project;

      // Validate required fields
      if (!title || !description) {
        return res.status(400).json({
          message: "Each project must have title, techStack, and description.",
        });
      }

      // Check for duplicate titles
      if (projectTitles.has(title)) {
        return res.status(400).json({
          message: `Duplicate project title found: '${title}'. Each project must have a unique title.`,
        });
      }
      projectTitles.add(title); // Add title to the set
    }

    // Check if an entry for the userId already exists
    const existingEntry = await projectDetails.findOne({ userId });

    if (existingEntry) {
      // If entry exists, overwrite the projects array
      existingEntry.projects = projects;
      await existingEntry.save();
      return res.status(200).json({
        message: "Projects array updated successfully.",
        data: existingEntry,
      });
    } else {
      // If no entry exists, create a new one
      const newEntry = new projectDetails({ userId, projects });
      await newEntry.save();
      return res.status(201).json({
        message: "Projects added successfully.",
        data: newEntry,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while adding/updating projects.",
      error: error.message,
    });
  }
};

export const getProjectDetails = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res); // Extract userId from token
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Retrieve user data based on userId
    const userData = await projectDetails.findOne({ userId });
    if (!userData) {
      return res.status(200).json({ data: {} }); // Return empty data if not found
    }

    // Return success response
    res.status(200).json({ data: userData.projects });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving project details." });
  }
};

export const isprofileComplete = async (req, res) => {
  try {
    const userId = extractUserIdFromToken(req, res);
    console.log(userId);
    if (userId == null) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    // Check in both schemas
    const generalDetailsEntry = await GeneralDetails.findOne({ userId });
    const projectDetailsEntry = await projectDetails.findOne({ userId });

    if (generalDetailsEntry && projectDetailsEntry) {
      return res
        .status(200)
        .json({ status: "OK", message: "Profile Complete" });
    } else {
      return res
        .status(404)
        .json({ status: "NOT OK", message: "Profile is not Complete" });
    }
  } catch (error) {
    console.error("Error checking userId:", error);
    res.status(500).json({ status: "ERROR", message: "Internal server error" });
  }
};
// --------------------------------------------------------------------------------------------

export const getProjectDetailsId = async (req, res) => {
  try {
    const { userId } = req.body; // Extract userId from token
    console.log(userId);
    // Retrieve user data based on userId
    const userData = await projectDetails.findOne({ userId });
    if (!userData) {
      console.log(userData);
      return res.status(400).json({ message: "User not found" }); // Return empty data if not found
    }
    console.log(userData);
    // Return success response
    res.status(200).json({ data: userData.projects });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving project details." });
  }
};
