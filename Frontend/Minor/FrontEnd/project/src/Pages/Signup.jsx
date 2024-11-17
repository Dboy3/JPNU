import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "",
    rollNo: "",
    cgpa: "",
    branch: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phoneNumber ||
      !formData.role ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      setIsErrorModalOpen(true);
      return;
    }

    // Student-specific validation
    if (formData.role === "Student") {
      if (!formData.cgpa || !formData.rollNo || !formData.branch) {
        setError(
          "CGPA, Roll Number, and Branch must be provided for Students."
        );
        setIsErrorModalOpen(true);
        return;
      }
      if (formData.cgpa < 0 || formData.cgpa > 10) {
        setError("CGPA must be between 0 and 10.");
        setIsErrorModalOpen(true);
        return;
      }

      if (!formData.email.endsWith("@nirmauni.ac.in")) {
        setError("Student email must end with @nirmauni.ac.in");
        setIsErrorModalOpen(true);
        return;
      }

      // Check if the roll number matches the prefix of the email
      const emailPrefix = formData.email.split("@")[0];
      if (emailPrefix !== formData.rollNo) {
        setError("Roll number and email prefix must match.");
        setIsErrorModalOpen(true);
        return;
      }
      if (formData.phoneNumber.length !== 10) {
        setError("Phone number must be exactly 10 digits.");
        setIsErrorModalOpen(true);
        return;
      }
    }

    // Password validation
    if (formData.password.length < 8 || formData.password.length > 15) {
      setError("Password must be between 8 and 15 characters.");
      setIsErrorModalOpen(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsErrorModalOpen(true);
      return;
    }

    setError("");
    setLoading(true);

    console.log(formData);

    try {
      const response = await fetch("http://localhost:8000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        navigate("/login");
      } else {
        setError(data.message || "An error occurred during sign-up.");
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      setError("Error connecting to the server.");
      setIsErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const closeErrorModal = () => {
    setIsErrorModalOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="hidden md:flex md:w-1/3 bg-gradient-to-r from-primary-dark to-primary-darker items-center justify-center text-white text-4xl font-extrabold p-6 lg:p-10">
        <div className="text-center">
          <h1>MyJobPortal</h1>
          <p className="mt-4 text-lg">Join us and make an impact</p>
        </div>
      </div>
      <div className="w-full md:w-2/3 flex items-center justify-center p-6 lg:p-10">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 mt-5 h-full max-h-screen overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Middle Name */}
            <div>
              <label
                htmlFor="middleName"
                className="block text-sm font-medium text-gray-700"
              >
                Middle Name
              </label>
              <input
                id="middleName"
                name="middleName"
                type="text"
                value={formData.middleName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Last Name */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              >
                <option value="">Select a role</option>
                <option value="SPC">SPC</option>
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
                <option value="Academic Coordinator">
                  Academic Coordinator
                </option>
              </select>
            </div>

            {/* Roll Number (For Students) */}
            {formData.role === "Student" && (
              <>
                <div>
                  <label
                    htmlFor="rollNo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Roll Number
                  </label>
                  <input
                    id="rollNo"
                    name="rollNo"
                    type="text"
                    value={formData.rollNo}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                  />
                </div>

                {/* CGPA */}
                <div>
                  <label
                    htmlFor="cgpa"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CGPA
                  </label>
                  <input
                    id="cgpa"
                    name="cgpa"
                    type="number"
                    step="0.01" // Allows two decimal places
                    min="0" // Minimum value is 0
                    max="10" // Maximum value is 10
                    value={formData.cgpa}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label
                    htmlFor="branch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <select
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
                  >
                    <option value="">Select a branch</option>
                    <option value="ee">Electrical Engineering (EE)</option>
                    <option value="ec">
                      Electronics and Communication (EC)
                    </option>
                    <option value="cse">
                      Computer Science and Engineering (CSE)
                    </option>
                    <option value="it">Information Technology (IT)</option>
                  </select>
                </div>
              </>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-3"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-primary text-white rounded-md text-lg font-semibold shadow-md hover:bg-primary-dark"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>
          </form>

          {/* Go to Login Button */}
          <div className="mt-4">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-gray-200 text-gray-800 rounded-md text-lg font-semibold shadow-md hover:bg-gray-300"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      {isErrorModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h3 className="text-xl font-semibold text-red-500 mb-4">Error</h3>
            <p>{error}</p>
            <button
              onClick={closeErrorModal}
              className="mt-4 w-full bg-primary text-white py-2 rounded-md"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupPage;
