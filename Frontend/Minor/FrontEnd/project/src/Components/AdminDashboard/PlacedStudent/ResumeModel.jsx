import React, { useEffect, useState } from "react";
import axios from "axios";

const ResumeModal = ({ isOpen, onClose, student }) => {
  const [projects, setProjects] = useState([]);

  console.log(student);
  // Fetch project data on component mount
  useEffect(() => {
    if (student && student.userId) {
      axios
        .post("http://localhost:8000/api/profile/getProjId", {
          userId: student.userId,
        })
        .then((response) => {
          setProjects(response.data.data);
        })
        .catch((error) => {
          console.error("Error fetching projects:", error);
        });
    }
  }, [student]);

  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-3/4 lg:w-1/2 p-6">
        <button
          className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded"
          onClick={onClose}
        >
          Close
        </button>
        <h1 className="text-2xl font-bold mb-4">
          {student.firstName} {student.lastName}'s Resume
        </h1>
        <p className="text-gray-700 mb-2">
          <strong>Email:</strong> {student.email}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Phone:</strong> {student.phoneNumber}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>Branch:</strong> {student.branch}
        </p>
        <p className="text-gray-700 mb-2">
          <strong>CGPA:</strong> {student.cgpa}
        </p>
        {student.intro && (
          <p className="text-gray-700 mt-4">
            <strong>Introduction:</strong> {student.intro}
          </p>
        )}

        {/* Display project list if available */}
        {projects.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Projects:</h2>
            <ul className="list-disc pl-5 mt-2">
              {projects.map((project) => (
                <li key={project._id}>
                  <strong>{project.title}</strong>: {project.description}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeModal;
