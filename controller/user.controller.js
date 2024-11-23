import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Company from "../models/Company.model.js";
import { v4 as uuidv4 } from "uuid";
import AcademicDetails from "../models/Academics.model.js";
// Secret key for JWT
// const JWT_SECRET = 'ksjdkjojen';

// Controller to create a new user
// export const createUser = async (req, res) => {
//     try {
//         const { firstName, middleName, lastName, email, phoneNumber, role, password } = req.body;

//         // Check if required fields are provided
//         if (!firstName || !lastName || !email || !phoneNumber || !role || !password) {
//             return res.status(400).json({ error: "All required fields must be provided." });
//         }

//         // Check if role is valid
//         const validRoles = ['Admin', 'Academic Coordinator', 'Company Representative', 'Student'];
//         if (!validRoles.includes(role)) {
//             return res.status(400).json({ error: "Invalid role specified." });
//         }

//         // Check for unique email and phone number
//         const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
//         if (existingUser) {
//             return res.status(409).json({ error: "User with the same email or phone number already exists." });
//         }

//         if (role === 'Student') {
//             const academicRecord = await AcademicDetails.findOne({ email });
//             if (!academicRecord) {
//                 return res.status(400).json({ error: "No academic record found for the provided email." });
//             }
//         }
//         // Generate a unique user ID
//         const userId = uuidv4();

//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Create a new user
//         const newUser = new User({
//             firstName,
//             middleName,
//             lastName,
//             email,
//             phoneNumber,
//             role,
//             userId,
//             password: hashedPassword
//         });

//         // Save the user to the database
//         await newUser.save();

//         // Return success response
//         res.status(201).json({ message: "User created successfully.", userId });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "An error occurred while creating the user." });
//     }
// };

export const createUser = async (req, res) => {
  try {
    const {
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      role,
      password,
      rollNo,
      cgpa,
      branch,
    } = req.body;
    console.log("heeloo");
    console.log({ firstName, lastName, email, phoneNumber, role, password });
    // Check if required fields are provided
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !role ||
      !password
    ) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Check if role is valid
    const validRoles = ["Admin", "Academic Coordinator", "SPC", "Student"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified." });
    }

    // Check for unique email and phone number
    const existingUser = await User.findOne({
      $or: [{ email }, { phoneNumber }],
    });
    if (existingUser) {
      return res.status(409).json({
        error: "User with the same email or phone number already exists.",
      });
    }

    // Handle the case for "Student" role
    if (role === "Student" ) {
      if (!rollNo) {
        return res
          .status(400)
          .json({ error: "Roll No. is required for students and SPCs." });
      }
      if (!cgpa) {
        return res
          .status(400)
          .json({ error: "cgpa is required for students and SPCs." });
      }
      if (!branch) {
        return res
          .status(400)
          .json({ error: "branch is required for students and SPCs." });
      }

      // future implementation that academic details are entered by co-ordinator

      // const academicRecord = await AcademicDetails.findOne({ rollNo });
      // if (!academicRecord) {
      //     return res.status(400).json({ error: "No academic record found for the provided roll number." });
      // }
    }

    // Handle the case for "Company Representative" role

    // Generate a unique user ID
    const userId = uuidv4();

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      middleName,
      lastName,
      email,
      phoneNumber,
      role,
      userId,
      password: hashedPassword,
      rollNo: role === "Student" ? rollNo : undefined,
      cgpa: role === "Student"  ? cgpa : undefined,
      branch: role === "Student" ? branch : undefined,
    });

    // Save the user to the database
    await newUser.save();

    // Return success response
    res.status(201).json({ message: "User created successfully.", userId });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the user." });
  }
};

// Controller to handle user login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email);
    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password must be provided." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email password." });
    }

    // Check if the password matches
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const tokenPayload = {
      userId: user.userId,
      role: user.role,
    };

    // Include companyId if the role is "Company Representative"
    // if (user.role === 'Company Representative') {
    //     tokenPayload.companyId = user.companyId;
    // }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Set the token as a cookie
    res.cookie("token", token, { httpOnly: true });

    // Return success response
    console.log("Done");
    res.status(200).json({ message: "Login successful.", user: user });
  } catch (error) {
    console.error(error);
    console.log("Eroor");
    res.status(500).json({ error: "An error occurred while logging in." });
  }
};

// Controller to delete a user based on email
export const deleteUser = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: "Email must be provided." });
    }

    // Find and delete the user by email
    const user = await User.findOneAndDelete({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    // Return success response
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the user." });
  }
};
// module.exports = { createUser, loginUser };
