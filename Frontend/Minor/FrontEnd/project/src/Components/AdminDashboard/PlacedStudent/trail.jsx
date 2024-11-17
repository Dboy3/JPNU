import React, { useState, useEffect } from "react";
import axios from "axios";

function PlacedStudent() {
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companies, setCompanies] = useState([]);
  const [students, setStudents] = useState([]);

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
    try {
      // Call API to update placement status in the database
      const response = await axios.post("http://localhost:8000/api/placements/update", {
        studentId,
        postId: selectedCompany,
        placed: !placed, // Toggle placed value
      });

      // If the placement status is true (placed), add data to the PlacedData collection
      if (!placed) {
        await axios.post("http://localhost:8000/api/placements/placeddata", {
          userId: studentId,
          postId: selectedCompany,
        });
      }

      // Update students list with the new placement status
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === studentId
            ? { ...student, placed: !placed }
            : student
        )
      );
    } catch (error) {
      console.error("Error updating placement status:", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-primary-dark mb-4 text-center">
        Student Applications
      </h2>
      <div className="flex items-center space-x-3 mb-4">
        <select
          value={selectedCompany}
          onChange={handleCompanyChange}
          className="border text-primary-dark p-2 rounded focus:outline-none focus:ring focus:ring-primary-light transition-all"
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
          className="bg-primary text-white px-3 py-2 rounded-md hover:bg-primary-dark transition-all focus:outline-none"
        >
          Show Data
        </button>
      </div>

      {/* Students Table */}
      <div>
        {students.length > 0 ? (
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  First Name
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  Last Name
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  Email
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  Phone Number
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  Branch
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  CGPA
                </th>
                <th className="p-2 text-left bg-primary-lightest text-primary-dark">
                  Placement Status
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id} className="border-t">
                  <td className="p-2">{student.firstName}</td>
                  <td className="p-2">{student.lastName}</td>
                  <td className="p-2">{student.email}</td>
                  <td className="p-2">{student.phoneNumber}</td>
                  <td className="p-2">{student.branch}</td>
                  <td className="p-2">{student.cgpa}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handlePlacementChange(student._id, student.placed)}
                      className={`px-4 py-2 rounded-md ${
                        student.placed
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                      } text-white`}
                    >
                      {student.placed ? "Placed" : "Unplaced"}
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
    </div>
  );
}

export default PlacedStudent;
