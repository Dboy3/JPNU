import React, { useState } from "react";
import { selectUser } from "../../../../Pages/auth";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function GeneralDetailsForm() {
  const user = useSelector(selectUser);
  console.log(user);

  const [formData, setFormData] = useState({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    rollNo: user.rollNo,
    course: user.branch,
    languages: [],
    achievements: [],
    skills: [],
    contactNumber: user.phoneNumber,
    email: "",
    githubLink: "",
    cgpa:user.cgpa,
  });

  console.log({formData} , "INIT");
  console.log(user.cgpa , "XXx");

  const [errors, setErrors] = useState({
    email: "",
    githubLink: "",
    contactNumber: "",
    languages: "",
  });

  useEffect(() => {
    // Fetch general details from the API
    const fetchGeneralDetails = async () => {
      try {
        const response = await fetch(
          "http://localhost:8000/api/profile/getdetails",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await response.json();

        if (data && data.data) {
          // If data is returned from the backend, populate formData with it
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
            githublink,
            cgpa,
            email,
          } = data.data;

          console.log(data.data);
          setFormData({
            firstName: firstName || "",
            middleName: middleName || "",
            lastName: lastName || "",
            rollNo: rollNo || "",
            course: course || "",
            languages: languages || [],
            achievements: achievements || [],
            skills: skills || [],
            contactNumber: contactNumber || "",
            email: email || "", // Update based on your business logic
            githubLink: githublink || "",
            cgpa: cgpa || "",
          });

          console.log("from the useEffect ", formData);
        } else {
          // If data.data is empty, use the default user values
          setFormData({
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            rollNo: user.rollNo,
            course: user.branch,
            languages: [],
            achievements: [],
            skills: [],
            contactNumber: user.phoneNumber,
            email: "",
            githubLink: "",
            cgpa: user.cgpa,
          });
        }
      } catch (error) {
        console.error("Error fetching general details:", error);
      }
    };

    fetchGeneralDetails();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "languages") {
      setFormData((prev) => ({
        ...prev,
        languages: value.split(",").map((lang) => lang.trim()),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleAchievementChange = (index, value) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = value;
    setFormData((prev) => ({
      ...prev,
      achievements: updatedAchievements,
    }));
  };

  const addAchievementField = () => {
    setFormData((prev) => ({
      ...prev,
      achievements: [...prev.achievements, ""],
    }));
  };

  const removeAchievementField = (index) => {
    const updatedAchievements = formData.achievements.filter(
      (_, i) => i !== index
    );
    setFormData((prev) => ({
      ...prev,
      achievements: updatedAchievements,
    }));
  };

  // Handle CGPA input change with validation
  const handleCgpaChange = (e) => {
    const { value } = e.target;

    // Ensure the value matches the pattern (up to two decimal places)
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setFormData((prev) => ({
        ...prev,
        cgpa: value,
      }));
    }
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const addSkillField = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkillField = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const validateForm = () => {
    let valid = true;
    let errorMessages = {
      email: "",
      githubLink: "",
      contactNumber: "",
      languages: "",
    };

    // Email validation: should not end with @nirmauni.ac.in
    if (formData.email.endsWith("@nirmauni.ac.in")) {
      errorMessages.email = "Email should not end with @nirmauni.ac.in";
      valid = false;
    }

    // GitHub link validation: should be a valid URL
    const githubPattern =
      /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    if (formData.githubLink && !githubPattern.test(formData.githubLink)) {
      errorMessages.githubLink = "Please enter a valid GitHub URL";
      valid = false;
    }

    // Contact Number validation (required)
    if (!formData.contactNumber) {
      errorMessages.contactNumber = "Contact Number is required";
      valid = false;
    }

    // CGPA validation (required, between 0 and 10, and supports 2 decimal places)
    if (formData.cgpa) {
      const cgpaValue = parseFloat(formData.cgpa);
      if (
        isNaN(cgpaValue) ||
        cgpaValue < 0 ||
        cgpaValue > 10 ||
        !/^\d(\.\d{1,2})?$/.test(formData.cgpa)
      ) {
        errorMessages.cgpa =
          "CGPA should be a number between 0 and 10, with up to 2 decimal places.";
        valid = false;
      }
    }

    // Languages validation (required)
    if (!formData.languages) {
      errorMessages.languages = "Languages are required";
      valid = false;
    }

    // Set error messages
    setErrors(errorMessages);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("sending the data ",formData);
    // Perform validation before submitting
    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:8000/api/profile/createdetails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
            credentials: "include",
          }
        );

        const result = await response.json();
        if (result.message) {
          alert(result.message);
        } else {
          alert("An error occurred while submitting the data.");
        }
      } catch (error) {
        console.error("Error submitting general details:", error);
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">General Details Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
        {/* Name Fields (Disabled) */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700">
              First Name
            </label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="middleName" className="block text-gray-700">
              Middle Name
            </label>
            <input
              type="text"
              name="middleName"
              value={user.middleName}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              disabled
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Roll No (Disabled) */}
        <div>
          <label htmlFor="rollNo" className="block text-gray-700">
            Roll No
          </label>
          <input
            type="text"
            name="rollNo"
            value={user.rollNo}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>

        {/* <div>
          <label htmlFor="cgpa" className="block text-gray-700">
            CGPA (0-10) *
          </label>
          <input
            type="text"
            name="cgpa"
            value={formData.cgpa}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your CGPA"
          />
          {errors.cgpa && <p className="text-red-600">{errors.cgpa}</p>}
        </div> */}

        <div>
          <label htmlFor="cgpa" className="block text-gray-700">
            CGPA (0-10) *
          </label>
          <input
            type="text"
            name="cgpa"
            value={user.cgpa}
            onChange={handleCgpaChange} // Use the new handler for CGPA
            className="w-full p-2 border rounded"
            placeholder="Enter your CGPA"
            disabled
          />
          {errors.cgpa && <p className="text-red-600">{errors.cgpa}</p>}
        </div>

        {/* Course (Disabled) */}
        <div>
          <label htmlFor="course" className="block text-gray-700">
            Course
          </label>
          <input
            type="text"
            name="course"
            value={user.branch}
            disabled
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Contact Number (Required) */}
        <div>
          <label htmlFor="contactNumber" className="block text-gray-700">
            Contact Number
          </label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.contactNumber && (
            <p className="text-red-600">{errors.contactNumber}</p>
          )}
        </div>

        {/* Email (Required) */}
        <div>
          <label htmlFor="email" className="block text-gray-700">
            Personal Email ( other than nirmauni ) *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
          {errors.email && <p className="text-red-600">{errors.email}</p>}
        </div>

        {/* GitHub Link (Placeholder added) */}
        <div>
          <label htmlFor="githubLink" className="block text-gray-700">
            GitHub Link *
          </label>
          <input
            type="url"
            name="githubLink"
            value={formData.githubLink}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="https://github.com/your-username"
          />
          {errors.githubLink && (
            <p className="text-red-600">{errors.githubLink}</p>
          )}
        </div>

        {/* Known Languages (Required) */}
        <div>
          <label htmlFor="languages" className="block text-gray-700">
            Known Languages
          </label>
          <input
            type="text"
            name="languages"
            value={formData.languages.join(", ")}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., English, Hindi"
            required
          />
          {errors.languages && (
            <p className="text-red-600">{errors.languages}</p>
          )}
        </div>

        {/* Achievements */}
        <div>
          <label className="block text-gray-700">Achievements</label>
          {formData.achievements.map((achievement, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={achievement}
                onChange={(e) => handleAchievementChange(index, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`Achievement ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeAchievementField(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAchievementField}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Add Achievement
          </button>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-gray-700">Skills</label>
          {formData.skills.map((skill, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => handleSkillChange(index, e.target.value)}
                className="w-full p-2 border rounded"
                placeholder={`Skill ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeSkillField(index)}
                className="text-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addSkillField}
            className="bg-gray-200 px-2 py-1 rounded hover:bg-gray-300"
          >
            Add Skill
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default GeneralDetailsForm;
