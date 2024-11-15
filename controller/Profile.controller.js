import GeneralDetails from "../models/Profile.model.js";
import jwt from "jsonwebtoken";

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
    if (!userId) return; // If token is invalid or missing, stop further execution

    const details = req.body;

    // Check if required fields are provided
    if (
      !details.firstName ||
      !details.lastName ||
      !details.rollNo ||
      !details.course ||
      !details.gender ||
      !details.contact ||
      !details.introduction
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Check if user data already exists
    const existingData = await GeneralDetails.findOne({ userId });
    if (existingData) {
      return res
        .status(400)
        .json({ error: "User data already exists. Use the update endpoint." });
    }

    // Create a new entry
    const newData = new GeneralDetails({ ...details, userId });
    await newData.save();

    // Return success response
    res
      .status(201)
      .json({
        message: "General details inserted successfully.",
        data: newData,
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while inserting general details." });
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
