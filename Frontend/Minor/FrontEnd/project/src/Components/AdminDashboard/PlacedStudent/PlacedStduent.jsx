import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeModal from "./ResumeModel"; // Import the modal component

function PlacedStudent() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/jobs/get");
        const companyList = response.data.jobPostings.map((job) => ({
          id: job.postId,
          name: job.companyName,
        }));
        setCompanies(companyList);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const handleCompanyChange = (event) => {
    setSelectedCompany(event.target.value);
    setStudents([]);
  };

  const handleShowData = async () => {
    if (selectedCompany) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/jobs/getstudentbypostid",
          { postId: selectedCompany }
        );
        setStudents(response.data || []);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    }
  };

  const handlePlacementChange = async (studentId, placed) => {
    console.log(studentId, selectedCompany);

    // Update the UI instantly
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.userId === studentId ? { ...student, placed: true } : student
      )
    );

    try {
      const response = await axios.post(
        "http://localhost:8000/api/jobs/placed-students/add",
        {
          userId: studentId,
          postId: selectedCompany,
        }
      );

      if (response.status === 201) {
        alert("Placement status updated successfully.");
        // Refresh student data to ensure state consistency
        const updatedResponse = await axios.post(
          "http://localhost:8000/api/jobs/getstudentbypostid",
          { postId: selectedCompany }
        );
        setStudents(updatedResponse.data || []);
      } else if (response.status === 200) {
        alert("Reverted successfully.");
        // Refresh student data to ensure state consistency
        const updatedResponse = await axios.post(
          "http://localhost:8000/api/jobs/getstudentbypostid",
          { postId: selectedCompany }
        );
        setStudents(updatedResponse.data || []);
      } else {
        throw new Error("Failed to update placement status.");
      }
    } catch (error) {
      console.error("Error updating placement status:", error);
      alert("Failed to update placement status. Please try again.");

      // Rollback the UI update if the API call fails
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student.userId === studentId ? { ...student, placed: false } : student
        )
      );
    }
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-primary-dark mb-6 text-center">
        Student Applications
      </h2>
      <div className="flex items-center space-x-4 mb-6">
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="border text-primary-dark p-3 rounded-lg focus:outline-none focus:ring focus:ring-primary-light transition-all w-full sm:w-1/3"
        >
          <option value="" disabled>
            Select a Company
          </option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>
              {company.name}
            </option>
          ))}
        </select>
        <button
          onClick={handleShowData}
          className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-all focus:outline-none"
        >
          Show Data
        </button>
      </div>

      <div className="overflow-x-auto">
        {students.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  First Name
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Last Name
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Email
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Phone Number
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Branch
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  CGPA
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Placement Status
                </th>
                <th className="p-3 text-left bg-primary-lightest text-primary-dark">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.userId} className="border-t">
                  <td className="p-3">{student.firstName}</td>
                  <td className="p-3">{student.lastName}</td>
                  <td className="p-3">{student.email}</td>
                  <td className="p-3">{student.phoneNumber}</td>
                  <td className="p-3">{student.branch}</td>
                  <td className="p-3">{student.cgpa}</td>
                  <td className="p-3">
                    <button
                      onClick={() =>
                        handlePlacementChange(student.userId, student.placed)
                      }
                      className={`px-6 py-3 rounded-md ${
                        student.placed
                          ? "bg-green-200 text-green-800 cursor-not-allowed"
                          : "bg-primary-lightest hover:bg-primary-light text-black"
                      }`}
                    >
                      {student.placed ? "Placed" : "Place"}
                    </button>
                    <button
                      onClick={() => handleViewProfile(student)}
                      className="ml-4 px-6 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          selectedCompany && (
            <p className="text-primary-darker italic text-center">
              No students applied for this job.
            </p>
          )
        )}
      </div>

      {/* Resume Modal */}
      <ResumeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}

export default PlacedStudent;
